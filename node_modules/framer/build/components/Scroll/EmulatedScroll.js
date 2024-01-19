import { frame, useDragControls, useMotionValue, } from "framer-motion";
import React, { useCallback, useMemo, useRef } from "react";
import { FrameWithMotion } from "../../render/presentation/Frame/FrameWithMotion.js";
import { RenderTarget } from "../../render/types/RenderEnvironment.js";
import { injectComponentCSSRules } from "../../render/utils/injectComponentCSSRules.js";
import { isFiniteNumber } from "../../render/utils/isFiniteNumber.js";
import { isMotionValue } from "../../render/utils/isMotionValue.js";
import { useLayoutId } from "../../render/utils/useLayoutId.js";
import { useIsomorphicLayoutEffect } from "../../useIsomorphicLayoutEffect.js";
import { EmptyState } from "../EmptyState.js";
import { useIsInCurrentNavigationTarget } from "../NavigationContainerContext.js";
import { useWheelScroll } from "./useWheelScroll.js";
const directionMap = {
    horizontal: "x",
    vertical: "y",
    both: true,
};
function convertScrollDirectionToDrag(scrollDirection) {
    return scrollDirection ? directionMap[scrollDirection] : scrollDirection;
}
const useUpdateChildSize = ({ dragDirection, children, fromCanvasComponent, }) => {
    return useMemo(() => {
        return React.Children.map(children, (child) => {
            if (child === null || typeof child !== "object" || typeof child.type === "string") {
                return child;
            }
            const updatedSize = {};
            switch (dragDirection) {
                case "vertical":
                    updatedSize.width = "100%";
                    break;
                case "horizontal":
                    updatedSize.height = "100%";
                    break;
                default:
                    return child;
            }
            const update = fromCanvasComponent
                ? { style: Object.assign({}, child.props.style, updatedSize) }
                : updatedSize;
            return React.cloneElement(child, update);
        });
    }, [dragDirection, children]);
};
const numberFromOptionalMotionValue = (value) => {
    return typeof value === "number" ? value : value.get();
};
/**
 * @private
 */
export const EmulatedScroll = /* @__PURE__ */ React.forwardRef(function EmulatedScroll(props, forwardedRef) {
    const { direction = "vertical", directionLock = false, dragEnabled = true, dragElastic, dragMomentum, dragTransition, wheelEnabled = true, contentOffsetX = 0, contentOffsetY = 0, contentWidth, contentHeight, onScrollStart, onScroll, onScrollEnd, onDragStart, onDrag, onDragEnd, onUpdate, onDirectionLock, style, children, scrollAnimate, resetOffset, overdragEnabled = true, layoutId: specificLayoutId, native, ...containerProps } = props;
    const layoutId = useLayoutId(props, { specificLayoutId, postfix: "scroll" });
    const defaultX = useMotionValue(typeof contentOffsetX === "number" ? contentOffsetX : 0);
    const defaultY = useMotionValue(typeof contentOffsetY === "number" ? contentOffsetY : 0);
    const x = isMotionValue(contentOffsetX) ? contentOffsetX : defaultX;
    const y = isMotionValue(contentOffsetY) ? contentOffsetY : defaultY;
    const measuredConstraints = useRef(null);
    const dragControls = useDragControls();
    const isInTarget = useIsInCurrentNavigationTarget();
    const wasInTargetRef = useRef(true);
    injectComponentCSSRules();
    function setMeasureDragConstraints(constraints) {
        constraints = offsetToZero(constraints);
        if (contentWidth !== undefined)
            constraints.left = -contentWidth;
        if (contentHeight !== undefined)
            constraints.top = -contentHeight;
        return (measuredConstraints.current = constraints);
    }
    const { initial, prev } = useRef({
        initial: { x: 0, y: 0 },
        prev: { x: 0, y: 0 },
    }).current;
    const isPreview = RenderTarget.current() === RenderTarget.preview;
    const containerFallbackRef = useRef(null);
    const containerRef = forwardedRef || containerFallbackRef;
    const contentRef = useRef(null);
    const lastOffsetRef = useRef(null);
    function shouldResetScroll(inTarget) {
        const hasEnteredTarget = inTarget && wasInTargetRef.current === false;
        return resetOffset && hasEnteredTarget;
    }
    function measureAndUpdateScrollOffset() {
        if (!contentRef.current || !containerRef.current)
            return;
        // If the component is flagged to reset its scroll offset to its initial
        // values when it appears, check if the scroll was previously not
        // visible, and has become visible, and if so flag that we must reset
        // the scroll offset.
        const mustReset = shouldResetScroll(isInTarget);
        wasInTargetRef.current = isInTarget;
        // If the offset properties are not set, we don't need to measure and
        // update scroll offset.
        const previous = lastOffsetRef.current;
        if (previous === null && contentOffsetX === undefined && contentOffsetY === undefined)
            return;
        // Check if the values of the offset props have changed, requiring
        // scroll position to be updated. We only do this when the props are
        // numbers, because if they are motionValues, the offset has already
        // been changed by the motionValues themselves.
        const shouldUpdateOffset = previous === null ||
            (!isMotionValue(contentOffsetX) && contentOffsetX !== previous.offsetX) ||
            (!isMotionValue(contentOffsetY) && contentOffsetY !== previous.offsetY);
        // Check if the new maximum scroll offset has changed as a result of the
        // container or the scrollable content resizing.
        const currentMaxXOffset = contentRef.current.offsetWidth - containerRef.current.offsetWidth;
        const currentMaxYOffset = contentRef.current.offsetHeight - containerRef.current.offsetHeight;
        const hasSizeChanged = currentMaxXOffset !== previous?.maxXOffset || currentMaxYOffset !== previous?.maxYOffset;
        // Check if the actual scroll offset has changed via user interaction
        // relative to the last offset set via this function.
        const hasScrollOffsetChanged = previous?.x !== x.get() || previous?.y !== y.get();
        // If the size has changed, but the user hasn't scrolled away from the
        // last set scroll offset, we expect the resize not to result in an
        // incorrect scroll position. For instance, the maximum scrollable size
        // could shrink, meaning that a scroll offset that was previously
        // acceptable now results in undesirable overscroll. In this case we
        // need to reset to an acceptable offset.
        const shouldStayPinned = hasSizeChanged && !hasScrollOffsetChanged;
        if (mustReset || shouldUpdateOffset || shouldStayPinned) {
            const currentOffsetX = direction !== "vertical" ? numberFromOptionalMotionValue(contentOffsetX) : 0;
            const currentOffsetY = direction !== "horizontal" ? numberFromOptionalMotionValue(contentOffsetY) : 0;
            const nextXOffset = -Math.min(currentOffsetX, currentMaxXOffset);
            const nextYOffset = -Math.min(currentOffsetY, currentMaxYOffset);
            x.set(nextXOffset);
            y.set(nextYOffset);
            lastOffsetRef.current = {
                maxXOffset: currentMaxXOffset,
                maxYOffset: currentMaxYOffset,
                offsetX: currentOffsetX,
                offsetY: currentOffsetY,
                x: nextXOffset,
                y: nextYOffset,
            };
        }
    }
    // onBeforeLayoutMeasure is not called on the canvas, so handle updating
    // scroll offset on the canvas on any update with a layout effect.
    useIsomorphicLayoutEffect(() => {
        if (RenderTarget.current() !== RenderTarget.canvas)
            return;
        measureAndUpdateScrollOffset();
    });
    // onBeforeLayoutMeasure is not called on mount, so handle updating scroll
    // on mount in the preview.
    useIsomorphicLayoutEffect(() => {
        if (RenderTarget.current() === RenderTarget.canvas)
            return;
        measureAndUpdateScrollOffset();
    }, []);
    // isInTarget can change without motion calling measure on the element. To
    // solve that case, we run an effect when isInTarget changes, and call
    // measureAndUpdate if we need to reset. Since an effect runs after motion's
    // measurements phase, this will only run if we haven't already reset during
    // the render phase.
    React.useEffect(() => {
        if (shouldResetScroll(isInTarget))
            measureAndUpdateScrollOffset();
        // Always unset isInTarget to false on a change.
        // measureAndUpdateScrollOffset may not be called when navigating off
        // screen.
        if (isInTarget === false)
            wasInTargetRef.current = false;
    }, [isInTarget]);
    const getLatestPoint = () => ({ x: x.get(), y: y.get() });
    const resetInitialPoint = useCallback(() => {
        const point = getLatestPoint();
        initial.x = point.x;
        initial.y = point.y;
        prev.x = point.x;
        prev.y = point.y;
    }, []);
    const getPointData = useCallback(() => {
        const point = getLatestPoint();
        const data = {
            point,
            velocity: { x: x.getVelocity(), y: y.getVelocity() },
            offset: { x: point.x - initial.x, y: point.y - initial.y },
            delta: { x: point.x - prev.x, y: point.y - prev.y },
        };
        prev.x = point.x;
        prev.y = point.y;
        return data;
    }, [x, y]);
    const updateScrollListeners = useCallback(() => {
        onUpdate && onUpdate({ x: x.get(), y: y.get() });
        onScroll && onScroll(getPointData());
    }, [onScroll, onUpdate, getPointData, x, y]);
    const scheduleUpdateScrollListeners = useCallback(() => {
        frame.update(updateScrollListeners, false, true);
    }, [updateScrollListeners]);
    const onMotionDragStart = (event, info) => {
        resetInitialPoint();
        onDragStart && onDragStart(event, info);
        onScrollStart && onScrollStart(info);
    };
    const onMotionDragTransitionEnd = () => onScrollEnd && onScrollEnd(getPointData());
    const onWheelScrollStart = (info) => {
        onScrollStart?.(info);
    };
    useWheelScroll(containerRef, {
        enabled: wheelEnabled,
        initial,
        prev,
        direction,
        offsetX: x,
        offsetY: y,
        onScrollStart: onWheelScrollStart,
        onScroll,
        onScrollEnd,
        constraints: measuredConstraints,
    });
    const overdragX = useMotionValue(0);
    const overdragY = useMotionValue(0);
    useIsomorphicLayoutEffect(() => {
        const setScrollX = (xValue) => {
            const element = containerRef.current;
            if (!(element instanceof HTMLDivElement))
                return;
            element.scrollLeft = -xValue;
            const constraints = measuredConstraints.current;
            if (constraints && overdragEnabled) {
                let overdragXValue = 0;
                if (xValue > constraints.right)
                    overdragXValue = xValue;
                if (xValue < constraints.left)
                    overdragXValue = xValue - constraints.left;
                overdragX.set(overdragXValue);
            }
            scheduleUpdateScrollListeners();
        };
        const currentX = x.get();
        if (currentX !== 0)
            setScrollX(currentX);
        return x.on("change", setScrollX);
    }, [x, overdragX, scheduleUpdateScrollListeners, overdragEnabled]);
    useIsomorphicLayoutEffect(() => {
        const setScrollY = (yValue) => {
            const element = containerRef.current;
            if (!(element instanceof HTMLDivElement))
                return;
            element.scrollTop = -yValue;
            const constraints = measuredConstraints.current;
            if (constraints && overdragEnabled) {
                let overdragYValue = 0;
                if (yValue > constraints.bottom)
                    overdragYValue = yValue;
                if (yValue < constraints.top)
                    overdragYValue = yValue - constraints.top;
                overdragY.set(overdragYValue);
            }
            scheduleUpdateScrollListeners();
        };
        const currentY = y.get();
        if (currentY !== 0)
            setScrollY(currentY);
        return y.on("change", setScrollY);
    }, [y, overdragY, scheduleUpdateScrollListeners, overdragEnabled]);
    const nativeOnScroll = React.useCallback(() => {
        const element = containerRef.current;
        if (!(element instanceof HTMLDivElement))
            return;
        // we ignore native scroll changes when we are dragging or finishing a drag animation
        const xDelta = Math.abs(x.get() + element.scrollLeft);
        const yDelta = Math.abs(y.get() + element.scrollTop);
        if (xDelta > 1)
            x.set(-element.scrollLeft);
        if (yDelta > 1)
            y.set(-element.scrollTop);
    }, [x, y]);
    const isEmpty = React.Children.count(children) === 0;
    const width = direction !== "vertical" && !isEmpty ? "auto" : "100%";
    const height = direction !== "horizontal" && !isEmpty ? "auto" : "100%";
    const size = !containerProps.__fromCanvasComponent
        ? {
            width: containerProps.__fromCodeComponentNode ? "100%" : containerProps.width,
            height: containerProps.__fromCodeComponentNode ? "100%" : containerProps.height,
        }
        : {};
    return (React.createElement(FrameWithMotion, { "data-framer-component-type": "Scroll", background: "none" // need to set here to prevent default background from Frame
        , ...containerProps, ...size, style: {
            ...style,
            willChange: isPreview ? "transform" : undefined,
            overflow: "hidden",
        }, onScroll: nativeOnScroll, preserve3d: containerProps.preserve3d, ref: containerRef, layoutId: layoutId, layoutScroll: true, onBeforeLayoutMeasure: measureAndUpdateScrollOffset },
        React.createElement(FrameWithMotion, { "data-framer-component-type": "ScrollContentWrapper", animate: scrollAnimate, drag: dragEnabled && convertScrollDirectionToDrag(direction), dragDirectionLock: directionLock, dragElastic: dragElastic, dragMomentum: dragMomentum, dragTransition: dragTransition, dragConstraints: containerRef, dragControls: dragControls, onDragStart: onMotionDragStart, onDrag: onDrag, onDragEnd: onDragEnd, onDragTransitionEnd: onMotionDragTransitionEnd, onDirectionLock: onDirectionLock, onMeasureDragConstraints: setMeasureDragConstraints, width: width, height: height, _dragX: x, _dragY: y, position: "relative", x: overdragEnabled ? overdragX : undefined, y: overdragEnabled ? overdragY : undefined, ref: contentRef, style: {
                display: isEmpty ? "block" : "inline-block",
                willChange: isPreview ? "transform" : undefined,
                backgroundColor: "transparent",
                overflow: "visible",
                minWidth: "100%",
                minHeight: "100%",
            }, preserve3d: containerProps.preserve3d },
            React.createElement(EmptyState, { children: children, size: {
                    width: isFiniteNumber(containerProps.width) ? containerProps.width : "100%",
                    height: isFiniteNumber(containerProps.height) ? containerProps.height : "100%",
                }, insideUserCodeComponent: !containerProps.__fromCodeComponentNode, title: "Scroll", description: "Click and drag the connector to any frame on the canvas \u2192" }),
            useUpdateChildSize({
                dragDirection: direction,
                children,
                fromCanvasComponent: containerProps.__fromCanvasComponent,
            }))));
});
/**
 * Because we're overriding the usual drag x/y with scrollTop and scrollLeft
 * our constraints calculations need rebasing to 0
 */
function offsetToZero({ top, left, right, bottom }) {
    const width = right - left;
    const height = bottom - top;
    return {
        top: -height,
        left: -width,
        right: 0,
        bottom: 0,
    };
}
//# sourceMappingURL=EmulatedScroll.js.map