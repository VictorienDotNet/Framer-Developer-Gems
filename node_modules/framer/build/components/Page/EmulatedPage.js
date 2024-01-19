import { animate, animateValue, motionValue, useMotionValue } from "framer-motion";
import process from "process";
import React from "react";
import { FrameWithMotion } from "../../render/presentation/Frame/FrameWithMotion.js";
import { RenderTarget } from "../../render/types/RenderEnvironment.js";
import { injectComponentCSSRules } from "../../render/utils/injectComponentCSSRules.js";
import { isFiniteNumber } from "../../render/utils/isFiniteNumber.js";
import { isMotionValue } from "../../render/utils/isMotionValue.js";
import { useLayoutId } from "../../render/utils/useLayoutId.js";
import { useIsomorphicLayoutEffect } from "../../useIsomorphicLayoutEffect.js";
import { isReactChild, isReactElement } from "../../utils/type-guards.js";
import { warnOnce } from "../../utils/warnOnce.js";
import { EmptyState } from "../EmptyState.js";
import { useWheelScroll } from "../Scroll/useWheelScroll.js";
import { makePaddingString, paddingFromProps } from "../utils/paddingFromProps.js";
import { PageContainer, pageContentWrapperType } from "./PageContainer.js";
/**
 * The Page component allows you to create horizontally or vertically swipeable areas. It can be
 * imported from the Framer Library and used in code components. Add children to create pages to
 * swipe between. These children will be stretched to the size of the page component by default,
 * but can also be set to auto to maintain their original size.
 *
 * @remarks
 * ```jsx
 * import React from "react"
 * import { Frame, Page } from "framer"
 * export class Page extends React.Component {
 *   render() {
 *     return (
 *       <Page>
 *         <Frame />
 *       </Page>
 *     )
 *   }
 * }
 * ```
 * @public
 */
export const Page = /* @__PURE__ */ React.forwardRef(function Page(props, forwardedRef) {
    const { direction = "horizontal", contentWidth = "stretch", contentHeight = "stretch", alignment = "start", currentPage = 0, animateCurrentPageUpdate = true, gap: gapValue = 10, padding = 0, momentum = false, dragEnabled = true, defaultEffect = "none", background = "transparent", overflow = "hidden", __fromCodeComponentNode, effect, children, contentOffsetX, contentOffsetY, onChangePage, onScrollStart, onScroll, onDragStart, onDrag, onDragEnd, directionLock, onScrollEnd, onDirectionLock, onUpdate, wheelEnabled = false, layoutId: specificLayoutId, ...rest } = props;
    const layoutId = useLayoutId(props, { specificLayoutId, postfix: "page" });
    const containerProps = { ...rest, background };
    const hasMountedRef = React.useRef(false);
    const hasFixedSize = RenderTarget.hasRestrictions() &&
        props.__fromCodeComponentNode &&
        isFiniteNumber(containerProps.width) &&
        isFiniteNumber(containerProps.height);
    if (!hasFixedSize && __fromCodeComponentNode && !containerProps.__fromCanvasComponent) {
        containerProps.width = "100%";
        containerProps.height = "100%";
        containerProps._constraints = { enabled: true };
    }
    const { initial, prev } = React.useRef({
        initial: { x: 0, y: 0 },
        prev: { x: 0, y: 0 },
    }).current;
    const isHorizontal = direction === "horizontal";
    let gap = gapValue;
    if (gap < 0) {
        warnOnce(`The 'gap' property of Page component can not be negative, but is ${gapValue}.`);
        gap = 0;
    }
    injectComponentCSSRules();
    const pageCount = React.Children.count(children);
    const maxOffsetRef = React.useRef(0);
    const constraints = React.useRef({ top: 0, left: 0, right: 0, bottom: 0 });
    const fallbackContainerRef = React.useRef(null);
    const containerRef = forwardedRef || fallbackContainerRef;
    const scrollableRef = React.useRef(null);
    const pageEffectValuesRef = React.useRef([]);
    const pageRectsRef = React.useRef([]);
    // On the Framer Canvas we need to use `useMotionValue` because it falls
    // back to a React state update in static mode, allowing the component to
    // update. Since you cannot conditionally render a hook, we use 0 as the
    // default value if the React prop is **already** a motion value, and then
    // simply do not use the returned motion value.
    const internalX = useMotionValue(isMotionValue(contentOffsetX) ? 0 : contentOffsetX ?? 0);
    const internalY = useMotionValue(isMotionValue(contentOffsetY) ? 0 : contentOffsetY ?? 0);
    const contentOffsetRef = React.useRef({
        x: isMotionValue(contentOffsetX) ? contentOffsetX : internalX,
        y: isMotionValue(contentOffsetY) ? contentOffsetY : internalY,
    });
    const currentContentPageRef = React.useRef(currentPage);
    const propsBoundedCurrentPageRef = React.useRef(currentPage); // Bounded version of props.currentPage
    const latestPropsRef = React.useRef(props);
    latestPropsRef.current = props;
    const lastDirectionRef = React.useRef(props.direction);
    const snapToPage = useSnapToPage(currentContentPageRef, contentOffsetRef, isHorizontal);
    const [_, setForceUpdateCount] = React.useState(0);
    const containerSizeRef = React.useRef({ width: 200, height: 200 });
    if (hasFixedSize && isFiniteNumber(containerProps.width) && isFiniteNumber(containerProps.height)) {
        containerSizeRef.current.width = containerProps.width;
        containerSizeRef.current.height = containerProps.height;
    }
    const updateOnResize = React.useCallback(() => {
        if (!hasFixedSize)
            setForceUpdateCount(v => v + 1);
    }, [hasFixedSize]);
    // Setup a listener on the window's size. If it changes, and we are in
    // preview, we may need to render to trigger motion's onLayoutMeasure to
    // update the constraints.
    React.useEffect(() => {
        if (RenderTarget.current() !== RenderTarget.preview)
            return;
        globalThis.addEventListener("resize", updateOnResize);
        return () => {
            globalThis.removeEventListener("resize", updateOnResize);
        };
    }, [updateOnResize]);
    const applyEffects = () => {
        pageEffectValuesRef.current.forEach((effectDictionary, index) => {
            const values = effectValues(index, latestPropsRef, pageRectsRef, contentOffsetRef, maxOffsetRef);
            if (!effectDictionary || !values)
                return;
            for (const [key, value] of Object.entries(values)) {
                const effectValue = effectDictionary[key];
                if (isMotionValue(effectValue)) {
                    // Because these are the actual Animatable values passed to the Frame
                    // Updating their value will modify the Frame
                    effectValue.set(value);
                }
            }
        });
    };
    const updateMaxOffsetFromPageContents = (containerSize) => {
        const newPageContentRects = getPageContentRects(containerRef, containerSize, direction, gap);
        if (newPageContentRects)
            pageRectsRef.current = newPageContentRects;
        const newMaxOffset = getMaxOffset(containerSizeRef.current, pageRectsRef.current, direction, latestPropsRef.current);
        if (newMaxOffset !== maxOffsetRef.current) {
            maxOffsetRef.current = newMaxOffset;
            constraints.current.top = -newMaxOffset;
            constraints.current.left = -newMaxOffset;
            /**
             * @FIXME Without this forced render, if you resize Page on the
             * canvas when it's current page is not 0, you will see flashes of
             * the previous page. This happens when the MotionValue for the x or
             * y offset is out of sync with the size of the Page and the Page
             * contents, which manifests as the current page not being
             * transformed far enough from the start point.
             *
             * Unfortunately, it's not 100% clear why this force render is
             * required.
             *
             * Since the offset is a Motion Value, its updates are not tied to
             * React renders, so it stays up to date based on a 60fps render
             * cycle run by framer-motion. However, this setState is called
             * inside a useLayoutEffect hook. If an update is scheduled during a
             * useLayoutEffect hook, painting is deferred until no more updates
             * are scheduled. In the case of this function, the first
             * useLayoutEffect after a resize will trigger this React render,
             * painting will be deferred, and the same useLayoutEffect will run
             * a second time, finally calling this function a second time. On
             * the second invocation of this function, since we cache the
             * previous maxOffset to a ref, this state update will not get
             * called. Since no updates are scheduled in the second render,
             * React will finally paint the update.
             *
             * Since this bug only happens in Safari in some circumstances when
             * resizing on the canvas at 60fps, it's possible that there is a
             * case where when we do not defer painting in the first
             * useLayoutEffect, the React render and the MotionValue update are
             * not in sync, causing a brief flash.
             *
             * However, if we can figure out a way to ensure those updates
             * happen in sync, we should remove this React render as it is
             * unnecessary and will only hinder performance when used elsewhere,
             * such as generated components where you can resize a Page while
             * performing a page transition.
             */
            if (RenderTarget.current() === RenderTarget.canvas)
                setForceUpdateCount(v => v + 1);
        }
    };
    // Measure the container size, and return the size if it has changed.
    const measureContainerSize = () => {
        const element = containerRef.current;
        if (!element)
            return null;
        const { offsetWidth, offsetHeight } = element;
        const currentSize = containerSizeRef.current;
        if (offsetWidth !== currentSize.width || offsetHeight !== currentSize.height) {
            containerSizeRef.current = {
                width: offsetWidth,
                height: offsetHeight,
            };
            return containerSizeRef.current;
        }
        return null;
    };
    const updateAndSnapToPage = (newPage, mount = false) => {
        const newBoundedCurrentPage = getBoundedCurrentPage(newPage, pageCount);
        const boundedCurrentPageDidChange = newBoundedCurrentPage !== propsBoundedCurrentPageRef.current;
        if (boundedCurrentPageDidChange) {
            propsBoundedCurrentPageRef.current = newBoundedCurrentPage;
            updateCurrentPage(newBoundedCurrentPage, currentContentPageRef, !mount ? onChangePage : undefined);
        }
        // Finally, even if the current page did not change, the offset may
        // have. Snap the current page to the latest offset.
        const offset = offsetForPage(newBoundedCurrentPage, pageCount, pageRectsRef, isHorizontal, maxOffsetRef);
        const animated = animateCurrentPageUpdate && RenderTarget.current() !== RenderTarget.canvas && !mount;
        snapToPage(newBoundedCurrentPage, offset, { animated });
    };
    // Handle setting up MotionValue handlers, performing initial measurements,
    // and setting the initial dragConstraints on mount. Finally snap to the
    // current page without an animation. Mount does not trigger motion's
    // onLayoutMeasure handler.
    useIsomorphicLayoutEffect(() => {
        if (hasMountedRef.current)
            return;
        /**
         * Defer the measurement of drag constraints until the next animation frame.
         * When the preview is closed and reopened, it's switched from display: none
         * to display: block. When an element is the child of display: none its measurements
         * return `0`. When this layout effect fires, the preview iframe *is* set to
         * display: block but in a twist of browser render scheduling this hasn't yet
         * affected the iframe contents. So by deferring to the following animation frame
         * we allow the iframe contents to take on dimension again.
         * Fixes: https://github.com/framer/company/issues/23200
         */
        requestAnimationFrame(() => {
            // If the Page has been mounted with a non-default current page, update
            // the ref on mount so that the useEffect that watches changes to the
            // currentPage prop doesn't fire incorrectly on subsequent renders.
            currentContentPageRef.current = currentPage;
            const contentOffset = contentOffsetRef.current;
            contentOffset.x.on("change", applyEffects);
            contentOffset.y.on("change", applyEffects);
            applyEffects();
            hasMountedRef.current = true;
            const containerSize = measureContainerSize() ?? containerSizeRef.current;
            updateMaxOffsetFromPageContents(containerSize);
            updateAndSnapToPage(currentContentPageRef.current, true);
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    // Handle user update to the currentPage from React props. This runs after
    // onLayoutMeasure, so the current offsets will already be set based on any
    // updates to the children or container sizes. Must only fire when
    // currentPage changes.
    React.useEffect(() => {
        if (currentPage !== currentContentPageRef.current)
            updateAndSnapToPage(currentPage);
    }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps
    // Measure the container size, and measure the children sizes when motion
    // flags that it's performing a measure with any transforms removed.
    const handleMeasureLifecycle = () => {
        // Measure the container, update the ref, and return the Size if it has changed.
        const newContainerSize = measureContainerSize();
        // Get the rects of each PageContainer, and calculate and update drag
        // constraints based on the current container size.
        updateMaxOffsetFromPageContents(newContainerSize ?? containerSizeRef.current);
        // Calculate if the Page's offset transform needs to be updated
        // to either keep the current page centered, or snap to a new page.
        updateAndSnapToPage(currentContentPageRef.current);
        // Finally, if the measured size or direction has changed, ensure that the offset for the
        // opposite direction is reset to 0. E.g. if the direction is
        // horizontal, reset the vertical scroll to 0.
        if (newContainerSize || direction !== lastDirectionRef.current) {
            if (direction === "horizontal") {
                contentOffsetRef.current.y.set(0);
            }
            else {
                contentOffsetRef.current.x.set(0);
            }
            lastDirectionRef.current = direction;
        }
    };
    // Motion's onLayoutMeasure is not called on the canvas, so if we are on
    // the canvas, we trigger the same callback we pass to onLayoutMeasure here
    // in a useLayoutEffect. This is fine because we don't have to worry about
    // un-setting parent transforms for measurements on the canvas.
    useIsomorphicLayoutEffect(() => {
        if (RenderTarget.current() !== RenderTarget.canvas)
            return;
        handleMeasureLifecycle();
    });
    const onDragStartHandler = (event, info) => {
        if (onScrollStart)
            onScrollStart(info);
        if (onDragStart)
            onDragStart(event, info);
        prev.x = initial.x = info.point.x;
        prev.y = initial.y = info.point.y;
    };
    const onDragHandler = (event, info) => {
        if (onScroll)
            onScroll(info);
        if (onDrag)
            onDrag(event, info);
        prev.x = info.point.x;
        prev.y = info.point.y;
    };
    const onDragTransitionEnd = () => {
        if (props.onDragTransitionEnd)
            props.onDragTransitionEnd();
        if (onScrollEnd) {
            const { x, y } = contentOffsetRef.current;
            const point = { x: x.get(), y: y.get() };
            onScrollEnd({
                point,
                velocity: { x: x.getVelocity(), y: y.getVelocity() },
                offset: { x: point.x - initial.x, y: point.y - initial.y },
                delta: { x: point.x - prev.x, y: point.y - prev.y },
            });
        }
    };
    const onDragEndHandler = async (event, info) => {
        const contentOffset = isHorizontal ? contentOffsetRef.current.x : contentOffsetRef.current.y;
        contentOffset.stop();
        const startPosition = contentOffset.get();
        const axis = isHorizontal ? "x" : "y";
        const velocity = info.velocity[axis];
        let index = nearestPageIndex(pageRectsRef.current, startPosition, startPosition, isHorizontal, momentum);
        if (velocity) {
            /**
             * TODO: This is a bit hacky. We're hijacking the inertia animation for the modifyTarget functionality. Maybe this is information we can
             * pass through the `onDragEnd` event handler if `dragMomentum` is `true`.
             */
            animateValue({
                type: "inertia",
                keyframes: [startPosition],
                velocity,
                modifyTarget: (endPosition) => {
                    index = nearestPageIndex(pageRectsRef.current, startPosition, endPosition, isHorizontal, momentum);
                    return endPosition;
                },
            }).stop();
        }
        updateCurrentPage(index, currentContentPageRef, onChangePage);
        const offset = offsetForPage(index, pageCount, pageRectsRef, isHorizontal, maxOffsetRef);
        if (onDragEnd)
            onDragEnd(event, info);
        const handler = contentOffsetRef.current[axis];
        handler.set(startPosition);
        animate(handler, offset, {
            type: "spring",
            velocity,
            stiffness: 500,
            damping: 50,
            onComplete: onDragTransitionEnd,
        });
    };
    pageEffectValuesRef.current = [];
    const childComponents = React.Children.map(children, (child, index) => {
        if (!isReactChild(child) || !isReactElement(child)) {
            return child;
        }
        const update = {
            right: undefined,
            bottom: undefined,
            top: undefined,
            left: undefined,
            _constraints: {
                enabled: false,
            },
        };
        if (containerProps.__fromCanvasComponent) {
            update.style = child.props.style ?? {};
            if (contentWidth === "stretch")
                update.style.width = "100%";
            if (contentHeight === "stretch")
                update.style.height = "100%";
        }
        else {
            if (contentWidth === "stretch")
                update.width = "100%";
            if (contentHeight === "stretch")
                update.height = "100%";
        }
        let effectDictionary;
        const values = effectValues(index, latestPropsRef, pageRectsRef, contentOffsetRef, maxOffsetRef);
        if (values) {
            // We use motion values so we can set them in the onMove function
            effectDictionary = {};
            for (const key in values) {
                effectDictionary[key] = motionValue(values[key]);
            }
        }
        pageEffectValuesRef.current.push(effectDictionary);
        return (React.createElement(PageContainer, { key: index, effect: effectDictionary, dragEnabled: dragEnabled, direction: direction, contentHeight: contentHeight, contentWidth: contentWidth, alignment: alignment, gap: gap, isLastPage: index === pageCount - 1, contentOffsetRef: contentOffsetRef, constraintsRef: constraints, directionLock: directionLock, onDragStart: onDragStartHandler, onDrag: onDragHandler, onDragEnd: onDragEndHandler, layoutId: layoutId ? `${layoutId}-${index}` : undefined }, React.cloneElement(child, update)));
    });
    useWheelScroll(scrollableRef, {
        enabled: wheelEnabled,
        initial,
        prev,
        direction,
        constraints,
        offsetX: contentOffsetRef.current.x,
        offsetY: contentOffsetRef.current.y,
        onScrollStart,
        onScroll,
        onScrollEnd,
    });
    return (React.createElement(FrameWithMotion, { "data-framer-component-type": "PageWrapper", preserve3d: false, perspective: hasEffect(props) ? 1200 : undefined, ...containerProps, 
        // Overflow is managed via a property control.
        style: { pointerEvents: undefined, ...containerProps.style, overflow: overflow }, layoutId: layoutId, ref: containerRef, onLayoutMeasure: handleMeasureLifecycle },
        React.createElement(FrameWithMotion, { "data-framer-component-type": "Page", ref: scrollableRef, background: null, x: contentOffsetRef.current.x, y: contentOffsetRef.current.y, width: "100%", height: "100%", preserve3d: true, layout: true, layoutId: layoutId !== undefined ? layoutId + "-page" : undefined, style: {
                padding: makePaddingString(paddingFromProps(props)),
                display: "flex",
                flexDirection: isHorizontal ? "row" : "column",
                pointerEvents: props.style?.pointerEvents,
            } },
            React.createElement(EmptyState, { title: "Page", description: "Click and drag the connector to any frame on the canvas \u2192", children: children, size: containerSizeRef.current, insideUserCodeComponent: !__fromCodeComponentNode }),
            childComponents)));
});
// Effects
function cubeEffect(info) {
    const { normalizedOffset, direction } = info;
    const isHorizontal = direction === "horizontal";
    return {
        originX: normalizedOffset < 0 ? 1 : 0,
        originY: normalizedOffset < 0 ? 1 : 0,
        rotateY: isHorizontal ? Math.min(Math.max(-90, normalizedOffset * 90), 90) : 0,
        rotateX: isHorizontal ? 0 : Math.min(Math.max(-90, normalizedOffset * -90), 90),
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
    };
}
function coverflowEffect(info) {
    const { normalizedOffset, direction, size } = info;
    const isHorizontal = direction === "horizontal";
    return {
        rotateY: isHorizontal ? Math.min(45, Math.max(-45, normalizedOffset * -45)) : 0,
        rotateX: isHorizontal ? 0 : Math.min(45, Math.max(-45, normalizedOffset * 45)),
        originX: isHorizontal ? (normalizedOffset < 0 ? 0 : 1) : 0.5,
        originY: isHorizontal ? 0.5 : normalizedOffset < 0 ? 0 : 1,
        x: isHorizontal ? `${normalizedOffset * -25}%` : 0,
        y: isHorizontal ? 0 : `${normalizedOffset * -25}%`,
        z: -Math.abs(normalizedOffset),
        scale: 1 - Math.abs(normalizedOffset / 10),
    };
}
function calcPileAxisOffset(offset, length) {
    return offset * length - offset * 8;
}
function pileEffect(info) {
    const { normalizedOffset, direction, size } = info;
    const isHorizontal = direction === "horizontal";
    const absoluteOffset = Math.abs(normalizedOffset);
    return {
        x: normalizedOffset < 0 && isHorizontal ? calcPileAxisOffset(absoluteOffset, size.width) : 0,
        y: normalizedOffset < 0 && !isHorizontal ? calcPileAxisOffset(absoluteOffset, size.height) : 0,
        scale: normalizedOffset < 0 ? 1 - absoluteOffset / 50 : 1,
    };
}
function wheelEffect(info) {
    const { normalizedOffset, direction, size } = info;
    const isHorizontal = direction === "horizontal";
    const originZ = ((isHorizontal ? size.width : size.height) * 18) / (2 * Math.PI);
    const rotateX = isHorizontal ? 0 : normalizedOffset * -20;
    const rotateY = isHorizontal ? normalizedOffset * 20 : 0;
    const y = isHorizontal ? 0 : normalizedOffset * -size.height;
    const x = isHorizontal ? normalizedOffset * -size.width : 0;
    return {
        opacity: 1 - Math.abs(normalizedOffset) / 4,
        transform: `translate(${x}px, ${y}px) translateZ(-${originZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${originZ}px)`,
    };
}
function getDefaultEffect(type) {
    switch (type) {
        case "cube":
            return cubeEffect;
        case "coverflow":
            return coverflowEffect;
        case "pile":
            return pileEffect;
        case "wheel":
            return wheelEffect;
        default:
            return null;
    }
}
function nearestPageIndex(pageRects, startPosition, endPosition, isHorizontalDirection, allowSkippingPages) {
    const distanceToStart = function (rect) {
        const rectPosition = isHorizontalDirection ? rect.x : rect.y;
        return Math.abs(rectPosition + startPosition);
    };
    const distanceToEnd = function (rect) {
        const rectPosition = isHorizontalDirection ? rect.x : rect.y;
        return Math.abs(rectPosition + endPosition);
    };
    if (allowSkippingPages) {
        const closestPages = [...pageRects].sort((a, b) => distanceToEnd(a) - distanceToEnd(b));
        if (!closestPages[0])
            return -1;
        return pageRects.indexOf(closestPages[0]);
    }
    else {
        const closestToStart = [...pageRects].sort((a, b) => distanceToStart(a) - distanceToStart(b));
        if (closestToStart.length === 1 && closestToStart[0])
            return pageRects.indexOf(closestToStart[0]);
        const pageA = closestToStart[0];
        const pageB = closestToStart[1];
        if (!pageA || !pageB)
            return -1;
        const closestPages = [pageA, pageB].sort((a, b) => distanceToEnd(a) - distanceToEnd(b));
        if (!closestPages[0])
            return -1;
        return pageRects.indexOf(closestPages[0]);
    }
}
function getPageContentRects(containerRef, containerSize, direction, gap) {
    const containerElement = containerRef.current;
    if (!containerElement)
        return;
    const contentWrappers = [];
    containerElement.firstChild?.childNodes.forEach(node => {
        const childNode = node.firstChild;
        if (!(childNode instanceof HTMLElement))
            return;
        const componentType = childNode.getAttribute("data-framer-component-type");
        if (componentType === pageContentWrapperType) {
            contentWrappers.push(childNode);
        }
    });
    const sizes = [];
    contentWrappers.forEach(contentWrapper => {
        if (contentWrapper instanceof HTMLElement && contentWrapper.firstChild instanceof HTMLElement) {
            let width = contentWrapper.firstChild.offsetWidth;
            let height = contentWrapper.firstChild.offsetHeight;
            if (process.env.NODE_ENV === "test") {
                width = 100;
                height = 100;
            }
            sizes.push({ width, height });
        }
        else {
            sizes.push(null);
        }
    });
    let maxX = 0;
    let maxY = 0;
    const isHorizontal = direction === "horizontal";
    return sizes.map(queriedSize => {
        const size = queriedSize || containerSize;
        const x = maxX;
        const y = maxY;
        if (isHorizontal) {
            maxX += size.width + gap;
        }
        else {
            maxY += size.height + gap;
        }
        return { ...size, x, y };
    });
}
function getMaxOffset(containerSize, pageContentRects, direction, paddingProps) {
    const lastPageRect = pageContentRects[pageContentRects.length - 1];
    if (!lastPageRect)
        return 0;
    const paddingSides = paddingFromProps(paddingProps);
    const isHorizontal = direction === "horizontal";
    const paddingStart = isHorizontal ? paddingSides.left : paddingSides.top;
    const paddingEnd = isHorizontal ? paddingSides.right : paddingSides.bottom;
    const pageWidth = isHorizontal ? lastPageRect.width : lastPageRect.height;
    const containerWidth = isHorizontal ? containerSize.width : containerSize.height;
    const freeSpace = containerWidth - paddingStart - paddingEnd - pageWidth;
    const target = isHorizontal ? lastPageRect.x : lastPageRect.y;
    // Scroll offset can't be negative, if it is accidentally negative, it will incorrectly offset the page contents from the starting point.
    if (freeSpace <= 0)
        return Math.max(target, 0);
    return Math.max(target - freeSpace, 0);
}
function offsetForPage(index, pageCount, pageRectsRef, isHorizontal, maxOffsetRef) {
    const pageIndex = Math.max(0, Math.min(pageCount - 1, index));
    const currentPageRect = pageRectsRef.current[pageIndex];
    if (!currentPageRect) {
        return 0;
    }
    if (isHorizontal) {
        return -Math.min(currentPageRect.x, maxOffsetRef.current);
    }
    else {
        return -Math.min(currentPageRect.y, maxOffsetRef.current);
    }
}
function useSnapToPage(currentContentPageRef, contentOffsetRef, isHorizontal) {
    return (pageIndex, offset, options) => {
        currentContentPageRef.current = pageIndex;
        const contentOffset = isHorizontal ? contentOffsetRef.current.x : contentOffsetRef.current.y;
        if (!options || !options.animated) {
            contentOffset.set(offset);
            return;
        } // else
        const axis = isHorizontal ? "x" : "y";
        const value = contentOffsetRef.current[axis];
        value.set(contentOffset.get());
        animate(value, offset, {
            type: "spring",
            velocity: contentOffset.getVelocity(),
            stiffness: 500,
            damping: 50,
        });
    };
}
// The current page property is capped to the number of children when positive, and cycles from last when negative
function getBoundedCurrentPage(pageIndex, pageCount) {
    return pageIndex >= 0 ? Math.min(pageIndex, pageCount - 1) : ((pageIndex % pageCount) + pageCount) % pageCount;
}
function effectValues(index, latestPropsRef, pageRectsRef, contentOffsetRef, maxOffsetRef) {
    const { direction: latestDirection = "horizontal", defaultEffect: latestDefaultEffect, effect: latestEffect, gap: latestGap = 10, } = latestPropsRef.current;
    const latestIsHorizontal = latestDirection === "horizontal";
    const pageRect = pageRectsRef.current[index] || {
        x: latestIsHorizontal ? index * 200 + latestGap : 0,
        y: latestIsHorizontal ? 0 : index * 200 + latestGap,
        width: 200,
        height: 200,
    };
    const effectFunction = latestEffect || getDefaultEffect(latestDefaultEffect);
    if (!effectFunction)
        return null;
    let offset;
    let normalizedOffset;
    const contentOffset = contentOffsetRef.current;
    const maxScrollOffset = maxOffsetRef.current;
    if (latestIsHorizontal) {
        offset = Math.min(pageRect.x, maxScrollOffset) + (contentOffset ? contentOffset.x.get() : 0);
        normalizedOffset = offset / (pageRect.width + latestGap);
    }
    else {
        offset = Math.min(pageRect.y, maxScrollOffset) + (contentOffset ? contentOffset.y.get() : 0);
        normalizedOffset = offset / (pageRect.height + latestGap);
    }
    const size = { width: pageRect.width, height: pageRect.height };
    return effectFunction({
        offset,
        normalizedOffset,
        size,
        index,
        direction: latestDirection,
        gap: latestGap,
        pageCount: pageRectsRef.current.length,
    });
}
function hasEffect(props) {
    return !!props.effect || !!getDefaultEffect(props.defaultEffect);
}
function updateCurrentPage(newPageIndex, currentContentPageRef, onChangePage) {
    if (currentContentPageRef.current === newPageIndex)
        return;
    if (onChangePage)
        onChangePage(newPageIndex, currentContentPageRef.current);
    currentContentPageRef.current = newPageIndex;
}
//# sourceMappingURL=EmulatedPage.js.map