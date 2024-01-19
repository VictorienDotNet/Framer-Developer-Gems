import React from "react";
import { cx } from "../../modules/cx.js";
import { FrameWithMotion } from "../../render/presentation/Frame/FrameWithMotion.js";
import { injectComponentCSSRules } from "../../render/utils/injectComponentCSSRules.js";
import { isFiniteNumber } from "../../render/utils/isFiniteNumber.js";
import { isMotionValue } from "../../render/utils/isMotionValue.js";
import { useLayoutId } from "../../render/utils/useLayoutId.js";
import { useIsomorphicLayoutEffect } from "../../useIsomorphicLayoutEffect.js";
import { EmptyState } from "../EmptyState.js";
import { useIsInCurrentNavigationTarget } from "../NavigationContainerContext.js";
import { useEmulateTouchScroll } from "../utils/useEmulatedTouchScroll.js";
import { useUpdateScrollOffset } from "../utils/useUpdateScrollOffset.js";
/**
 * @private
 */
export const NativeScroll = /* @__PURE__ */ React.forwardRef(function NativeScroll(props, forwardedRef) {
    const { direction = "vertical", scrollBarVisible = false, dragEnabled = true, contentOffsetX = 0, contentOffsetY = 0, contentWidth, contentHeight, children, resetOffset, onScroll, className, 
    // Not (yet) supported
    directionLock = false, wheelEnabled = true, scrollAnimate, dragTransition, dragMomentum, dragElastic, overdragEnabled = true, onScrollStart, onScrollEnd, onDragStart, onDrag, onDragEnd, onUpdate, onDirectionLock, layoutId: specificLayoutId, native, 
    // Rest
    ...containerProps } = props;
    const layoutId = useLayoutId(props, { specificLayoutId, postfix: "scroll" });
    const fallbackRef = React.useRef(null);
    const ref = forwardedRef || fallbackRef;
    const { cancelEmulatedTouchScrollAnimation } = useEmulateTouchScroll(ref, direction, dragEnabled);
    injectComponentCSSRules();
    const isInTarget = useIsInCurrentNavigationTarget();
    const previousIsInTargetRef = React.useRef(isInTarget);
    const updateScrollOffsetHandler = () => {
        if (!resetOffset)
            return;
        const previousIsTarget = previousIsInTargetRef.current;
        previousIsInTargetRef.current = isInTarget;
        const shouldResetOffset = isInTarget && !previousIsTarget;
        if (!shouldResetOffset)
            return;
        const element = ref.current;
        if (!element)
            return;
        if (direction !== "vertical") {
            cancelEmulatedTouchScrollAnimation?.();
            element.scrollLeft = Math.abs(isMotionValue(contentOffsetX) ? contentOffsetX.get() : contentOffsetX);
        }
        if (direction !== "horizontal") {
            cancelEmulatedTouchScrollAnimation?.();
            element.scrollTop = Math.abs(isMotionValue(contentOffsetY) ? contentOffsetY.get() : contentOffsetY);
        }
    };
    // We only want to update the scroll offset when isInTarget changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useIsomorphicLayoutEffect(updateScrollOffsetHandler, [isInTarget]);
    useUpdateScrollOffset(ref, "scrollLeft", contentOffsetX, cancelEmulatedTouchScrollAnimation);
    useUpdateScrollOffset(ref, "scrollTop", contentOffsetY, cancelEmulatedTouchScrollAnimation);
    const size = !containerProps.__fromCanvasComponent
        ? {
            width: containerProps.__fromCodeComponentNode ? "100%" : containerProps.width,
            height: containerProps.__fromCodeComponentNode ? "100%" : containerProps.height,
        }
        : {};
    return (React.createElement(FrameWithMotion, { ref: ref, "data-framer-component-type": "NativeScroll", background: "none" // need to set here to prevent default background from Frame
        , ...containerProps, ...size, onScroll: onScroll, layoutId: layoutId, onBeforeLayoutMeasure: updateScrollOffsetHandler, layoutScroll: true, className: cx(className, `direction-${direction}`, !scrollBarVisible && "scrollbar-hidden") },
        React.createElement(EmptyState, { children: children, size: {
                width: isFiniteNumber(containerProps.width) ? containerProps.width : "100%",
                height: isFiniteNumber(containerProps.height) ? containerProps.height : "100%",
            }, insideUserCodeComponent: !containerProps.__fromCodeComponentNode, title: "Scroll", description: "Click and drag the connector to any frame on the canvas \u2192" }),
        children));
});
//# sourceMappingURL=NativeScroll.js.map