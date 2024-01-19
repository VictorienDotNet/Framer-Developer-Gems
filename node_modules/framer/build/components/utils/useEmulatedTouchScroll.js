// We disable the rule of hooks because we early return when not in the preview
// or on a touch device. This early return will be constistent per environment.
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect } from "react";
import { Point } from "../../render/types/Point.js";
import { RenderTarget } from "../../render/types/RenderEnvironment.js";
import { isSafari, isTouch } from "../../utils/environment.js";
import { safeWindow } from "../../utils/safeWindow.js";
import { animatePointWithInertia } from "./animatePointWithInertia.js";
const scrollThreshold = 3;
const isTouchDevice = /* @__PURE__ */ isTouch();
const isSafariBrowser = /* @__PURE__ */ isSafari();
function getTouchAction(element) {
    if (!(element instanceof HTMLElement))
        return null;
    return element.style.touchAction;
}
function canPanInDirection(element, direction) {
    switch (direction) {
        case "horizontal":
            return getTouchAction(element) === "pan-x";
        case "vertical":
            return getTouchAction(element) === "pan-y";
        default:
            return false;
    }
}
function isInteractiveElement(element) {
    const tag = element.tagName.toLowerCase();
    if (tag === "input")
        return true;
    if (tag === "text")
        return true;
    if (tag === "textarea")
        return true;
    return false;
}
function canStartScrollFromElement(element, direction) {
    if (!(element instanceof Element))
        return false;
    if (isInteractiveElement(element))
        return false;
    if (element.hasAttribute("draggable")) {
        if (!canPanInDirection(element, direction)) {
            return false;
        }
    }
    return true;
}
function getEventPoint(event) {
    return {
        x: event.pageX,
        y: event.pageY,
    };
}
function setStyle(element, property, value) {
    if (element?.style) {
        element.style[property] = value;
    }
}
function getStyle(element, property) {
    return element?.style?.[property];
}
var TouchScrollPhase;
(function (TouchScrollPhase) {
    TouchScrollPhase[TouchScrollPhase["Idle"] = 0] = "Idle";
    TouchScrollPhase[TouchScrollPhase["TouchDown"] = 1] = "TouchDown";
    TouchScrollPhase[TouchScrollPhase["Drag"] = 2] = "Drag";
    TouchScrollPhase[TouchScrollPhase["DragLocked"] = 3] = "DragLocked";
    TouchScrollPhase[TouchScrollPhase["DragAnimation"] = 4] = "DragAnimation";
    TouchScrollPhase[TouchScrollPhase["Interrupted"] = 5] = "Interrupted";
})(TouchScrollPhase || (TouchScrollPhase = {}));
const emptyObject = {};
Object.freeze(emptyObject);
export function useEmulateTouchScroll(ref, direction, enabled) {
    if (isTouchDevice)
        return emptyObject;
    if (RenderTarget.current() !== RenderTarget.preview)
        return emptyObject;
    const scrollAnimationControlsRef = React.useRef(null);
    useEffect(() => {
        if (!ref.current)
            return;
        const element = ref.current;
        let phase = TouchScrollPhase.Idle;
        let targets = null;
        let downPoint = null;
        let scrollOffsetStart = null;
        let mouseMoveEvents = [];
        function onMouseMove(event) {
            switch (phase) {
                case TouchScrollPhase.Idle:
                case TouchScrollPhase.DragAnimation:
                case TouchScrollPhase.DragLocked:
                    return;
            }
            // If command is pressed we fallback to normal behavior
            if (event.metaKey)
                return;
            const point = getEventPoint(event);
            if (!downPoint)
                return;
            // Calculate the offset so we can use it in the callback
            const offset = Point.subtract(point, downPoint);
            // If we didn't scroll before and reached the threshold
            if (phase === TouchScrollPhase.TouchDown || phase === TouchScrollPhase.Interrupted) {
                const deltaX = Math.abs(offset.x);
                const deltaY = Math.abs(offset.y);
                if ((deltaX > scrollThreshold || deltaY > scrollThreshold) && deltaX !== deltaY) {
                    const scrollDirection = deltaX > deltaY ? "horizontal" : "vertical";
                    const shouldIgnoreBecauseOfDirectionLock = (direction === "horizontal" && scrollDirection === "vertical") ||
                        (direction === "vertical" && scrollDirection === "horizontal");
                    if (shouldIgnoreBecauseOfDirectionLock) {
                        phase = TouchScrollPhase.DragLocked;
                        return;
                    }
                    phase = TouchScrollPhase.Drag;
                    // We disable events on the clicked target so we avoid clicks if you mean to scroll
                    targets?.forEach(([target]) => setStyle(target, "pointerEvents", "none"));
                }
            }
            // We need this in Safari to avoid scroll from text selection near borders
            // Unfortunately we'll have to do this for all events and this could break
            // in subtle ways.
            if (isSafariBrowser)
                event.preventDefault();
            // Don't do anything if we didn't reach the threshold
            if (phase !== TouchScrollPhase.Drag)
                return;
            // Don't start selecting text too
            safeWindow.getSelection()?.empty();
            mouseMoveEvents = getRecentEvents([...mouseMoveEvents, event]);
            // Update offset
            if (scrollOffsetStart) {
                if (direction !== "vertical")
                    element.scrollLeft = scrollOffsetStart.x - offset.x;
                if (direction !== "horizontal")
                    element.scrollTop = scrollOffsetStart.y - offset.y;
            }
        }
        function onMouseUp(event) {
            safeWindow.removeEventListener("mousemove", onMouseMove, false);
            safeWindow.removeEventListener("mouseup", onMouseUp);
            // Make sure to restore events back on the element if we removed them
            if (phase === TouchScrollPhase.Drag && targets) {
                targets.forEach(([target, originalPointerEventsValue]) => setStyle(target, "pointerEvents", originalPointerEventsValue || "auto"));
            }
            targets = null;
            const velocity = calculateVelocity({ mouseMoveEvents, mouseUpEvent: event });
            downPoint = null;
            if (phase === TouchScrollPhase.Drag) {
                // Scroll
                // Unlike page snapping we only have to animate the scroll if we started a drag
                const shouldAnimateY = direction !== "horizontal" && velocity.y !== 0;
                const shouldAnimateX = direction !== "vertical" && velocity.x !== 0;
                if (!shouldAnimateY && !shouldAnimateX) {
                    phase = TouchScrollPhase.Idle;
                    return;
                }
                phase = TouchScrollPhase.DragAnimation;
                scrollAnimationControlsRef.current = animatePointWithInertia({
                    from: { x: element.scrollLeft, y: element.scrollTop },
                    velocity: {
                        x: shouldAnimateX ? velocity.x : 0,
                        y: shouldAnimateY ? velocity.y : 0,
                    },
                    onUpdate: position => {
                        if (shouldAnimateX)
                            element.scrollLeft = position.x;
                        if (shouldAnimateY)
                            element.scrollTop = position.y;
                    },
                    onStop: () => {
                        if (phase !== TouchScrollPhase.Interrupted) {
                            phase = TouchScrollPhase.Idle;
                        }
                        scrollAnimationControlsRef.current = null;
                    },
                    onComplete: () => {
                        if (phase !== TouchScrollPhase.DragAnimation) {
                            throw Error("On animation completion we should still be in the animation phase");
                        }
                        phase = TouchScrollPhase.Idle;
                        scrollAnimationControlsRef.current = null;
                    },
                });
            }
            else {
                phase = TouchScrollPhase.Idle;
            }
        }
        function onMouseWheel() {
            // Stop any running animations when using mouse wheel or trackpad
            scrollAnimationControlsRef.current?.stop();
        }
        function onMouseDown(event) {
            if (!enabled)
                return;
            // If command or control was entered we fallback to normal behavior
            if (event.metaKey)
                return;
            if (!canStartScrollFromElement(event.target, direction)) {
                // Stop any running scroll animation
                if (phase === TouchScrollPhase.DragAnimation) {
                    phase = TouchScrollPhase.Idle;
                    scrollAnimationControlsRef.current?.stop();
                }
                return;
            }
            const previousPhase = phase;
            phase =
                previousPhase === TouchScrollPhase.DragAnimation
                    ? TouchScrollPhase.Interrupted
                    : TouchScrollPhase.TouchDown;
            downPoint = getEventPoint(event);
            targets = document
                .elementsFromPoint(downPoint.x, downPoint.y)
                .filter((targetEl) => targetEl instanceof HTMLElement || targetEl instanceof SVGElement)
                .map(targetEl => [targetEl, getStyle(targetEl, "pointerEvents")]);
            scrollOffsetStart = { x: element.scrollLeft, y: element.scrollTop };
            mouseMoveEvents = [];
            if (scrollAnimationControlsRef.current) {
                if (previousPhase !== TouchScrollPhase.DragAnimation) {
                    throw Error("When stopping a drag animation we need to be animating");
                }
                scrollAnimationControlsRef.current.stop();
            }
            safeWindow.addEventListener("mousemove", onMouseMove);
            safeWindow.addEventListener("mouseup", onMouseUp);
            element.addEventListener("mousewheel", onMouseWheel);
        }
        // Set up a the base handler on the scrollable element
        element.addEventListener("mousedown", onMouseDown);
        return () => {
            // Clean up all event handlers on unmount
            element.removeEventListener("mousedown", onMouseDown);
            element.removeEventListener("mousewheel", onMouseWheel);
            safeWindow.removeEventListener("mousemove", onMouseMove);
            safeWindow.removeEventListener("mouseup", onMouseUp);
            // Stop any running scroll animations
            phase = TouchScrollPhase.Interrupted;
            scrollAnimationControlsRef.current?.stop();
        };
    }, [ref, direction, enabled]);
    return React.useMemo(() => {
        return {
            cancelEmulatedTouchScrollAnimation: () => {
                scrollAnimationControlsRef.current?.stop();
            },
        };
    }, []);
}
// Keep events that are younger than 4 / 60 s
const timeDelta = (4 / 60) * 1000;
function getRecentEvents(events) {
    // There is no API to get the time origin of event timestamps, as a workaround
    // we create a custom event and read the timestamp
    const currentTime = new CustomEvent("getTime").timeStamp;
    const maxAge = currentTime - timeDelta;
    return events.filter(event => event.timeStamp > maxAge);
}
const zeroPoint = { x: 0, y: 0 };
export function calculateVelocity({ mouseMoveEvents, mouseUpEvent, }) {
    const recentMouseMoveEvents = getRecentEvents(mouseMoveEvents);
    const oldestMouseMoveEvent = recentMouseMoveEvents[0];
    if (!oldestMouseMoveEvent)
        return zeroPoint;
    const deltaX = mouseUpEvent.clientX - oldestMouseMoveEvent.clientX;
    const deltaY = mouseUpEvent.clientY - oldestMouseMoveEvent.clientY;
    const time = mouseUpEvent.timeStamp - oldestMouseMoveEvent.timeStamp;
    if (time === 0)
        return zeroPoint;
    return {
        x: (deltaX / time) * 1000,
        y: (deltaY / time) * 1000,
    };
}
//# sourceMappingURL=useEmulatedTouchScroll.js.map