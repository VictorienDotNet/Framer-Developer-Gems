import React from "react";
import { FrameWithMotion } from "../../render/presentation/Frame/FrameWithMotion.js";
import { toJustifyOrAlignment } from "../Stack/Stack.js";
export const pageContentWrapperType = "PageContentWrapper";
export function PageContainer({ children, effect, dragEnabled, direction, contentHeight, contentWidth, alignment, gap, isLastPage, contentOffsetRef, constraintsRef, directionLock, onDragStart, onDrag, onDragEnd, layoutId, }) {
    const isHorizontalDirection = direction === "horizontal";
    const dragAxis = isHorizontalDirection ? "x" : "y";
    const hasHorizontalGap = isHorizontalDirection && !isLastPage && gap;
    const hasVerticalGap = !isHorizontalDirection && !isLastPage && gap;
    const hasAutoWidth = contentWidth !== "stretch" && isHorizontalDirection;
    const hasAutoHeight = contentHeight !== "stretch" && !isHorizontalDirection;
    const wrapperWidth = hasAutoWidth ? "auto" : "100%";
    const wrapperHeight = hasAutoHeight ? "auto" : "100%";
    const containerWidth = hasHorizontalGap && wrapperWidth === "100%" ? `calc(100% + ${gap}px)` : wrapperWidth;
    const containerHeight = hasVerticalGap && wrapperHeight === "100%" ? `calc(100% + ${gap}px)` : wrapperHeight;
    return (React.createElement(FrameWithMotion, { position: "relative", "data-framer-component-type": "PageContainer", width: containerWidth, height: containerHeight, layoutId: layoutId ? `${layoutId}-container` : undefined, backgroundColor: "transparent", drag: dragEnabled ? dragAxis : false, dragDirectionLock: directionLock, _dragX: contentOffsetRef.current.x, _dragY: contentOffsetRef.current.y, dragConstraints: constraintsRef.current, onDrag: onDrag, onDragStart: onDragStart, onDragEnd: onDragEnd, preserve3d: true, style: {
            pointerEvents: undefined,
            paddingRight: hasHorizontalGap ? gap : 0,
            paddingBottom: hasVerticalGap ? gap : 0,
        } },
        React.createElement(FrameWithMotion, { position: "relative", "data-framer-component-type": pageContentWrapperType, width: wrapperWidth, height: wrapperHeight, preserve3d: false, backgroundColor: "transparent", key: effect ? Object.keys(effect).join("") : "", style: {
                ...effect,
                pointerEvents: undefined,
                display: "flex",
                flexDirection: isHorizontalDirection ? "row" : "column",
                alignItems: alignment && toJustifyOrAlignment(alignment),
            } }, children)));
}
//# sourceMappingURL=PageContainer.js.map