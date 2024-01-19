import { isValidMotionProp, motion, resolveMotionValue } from "framer-motion";
import process from "process";
import React, { forwardRef, useContext, useRef } from "react";
import { isPropValid } from "../../../utils/isPropValid.js";
import { safeWindow } from "../../../utils/safeWindow.js";
import { BackgroundImageComponent } from "../../style/BackgroundImageComponent.js";
import { backgroundImageFromProps } from "../../style/backgroundImageFromProps.js";
import { Border } from "../../style/BorderComponent.js";
import { DimensionType } from "../../types/Constraints.js";
import { constraintsEnabled, ParentSizeState, useConstraints, useProvideParentSize, } from "../../types/NewConstraints.js";
import { RenderTarget } from "../../types/RenderEnvironment.js";
import { injectComponentCSSRules } from "../../utils/injectComponentCSSRules.js";
import { layoutHintDataPropsForCenter } from "../../utils/layoutHintDataPropsForCenter.js";
import { nodeIdFromString } from "../../utils/nodeIdFromString.js";
import { processOverrideForwarding } from "../../utils/processOverrideForwarding.js";
import { transformValues } from "../../utils/transformCustomValues.js";
import { transformTemplate } from "../../utils/transformTemplate.js";
import { useLayoutId } from "../../utils/useLayoutId.js";
import { useMeasureLayout } from "../../utils/useMeasureLayout.js";
import { ComponentContainerContext } from "../ComponentContainerContext.js";
import { Layer } from "../Layer.js";
import { getStyleForFrameProps, hasLeftAndRight, hasTopAndBottom } from "./getStyleForFrameProps.js";
function hasEvents(props) {
    for (const key in props) {
        if (key === "drag" ||
            key.startsWith("while") ||
            (typeof props[key] === "function" && key.startsWith("on") && !key.includes("Animation"))) {
            return true;
        }
    }
    return false;
}
const pointerEvents = [
    "onClick",
    "onDoubleClick",
    "onMouse",
    "onMouseDown",
    "onMouseUp",
    "onTapDown",
    "onTap",
    "onTapUp",
    "onPointer",
    "onPointerDown",
    "onPointerUp",
    "onTouch",
    "onTouchDown",
    "onTouchUp",
];
const pointerEventsSet = new Set([
    ...pointerEvents,
    ...pointerEvents.map(event => `${event}Capture`), // Add capture event variants
]);
function getCursorFromEvents(props) {
    if (props.drag) {
        return "grab";
    }
    for (const key in props) {
        if (pointerEventsSet.has(key)) {
            return "pointer";
        }
    }
    return undefined;
}
const overflowKey = "overflow";
function hasScrollableContent(props) {
    if (hasScrollingOverflow(props))
        return true;
    if (!props.style)
        return false;
    if (hasScrollingOverflow(props.style))
        return true;
    return false;
}
function hasScrollingOverflow(props) {
    if (overflowKey in props && (props[overflowKey] === "scroll" || props[overflowKey] === "auto"))
        return true;
    return false;
}
/** @internal */
export function unwrapFrameProps(frameProps) {
    const { left, top, bottom, right, width, height, center, _constraints, size, widthType, heightType, positionFixed, positionAbsolute, } = frameProps;
    const minWidth = resolveMotionValue(frameProps.minWidth);
    const minHeight = resolveMotionValue(frameProps.minHeight);
    const maxWidth = resolveMotionValue(frameProps.maxWidth);
    const maxHeight = resolveMotionValue(frameProps.maxHeight);
    const constraintProps = {
        top: resolveMotionValue(top),
        left: resolveMotionValue(left),
        bottom: resolveMotionValue(bottom),
        right: resolveMotionValue(right),
        width: resolveMotionValue(width),
        height: resolveMotionValue(height),
        size: resolveMotionValue(size),
        center,
        _constraints,
        widthType,
        heightType,
        positionFixed,
        positionAbsolute,
        minWidth,
        minHeight,
        maxWidth,
        maxHeight,
    };
    return constraintProps;
}
export const defaultFrameRect = { x: 0, y: 0, width: 200, height: 200 };
function useStyleAndRect(props) {
    injectComponentCSSRules();
    const inCodeComponent = Boolean(useContext(ComponentContainerContext));
    const { style, _initialStyle, __fromCanvasComponent, size } = props;
    const unwrappedProps = unwrapFrameProps(props);
    const constraintsRect = useConstraints(unwrappedProps);
    const defaultStyle = {
        display: "block",
        flexShrink: 0,
        userSelect: RenderTarget.current() !== RenderTarget.preview ? "none" : undefined,
    };
    if (!props.__fromCanvasComponent) {
        // XXX: this is hack until we find a better solution
        defaultStyle.backgroundColor = props.background === undefined ? "rgba(0, 170, 255, 0.3)" : undefined;
    }
    // To support setting overflow: auto on stacks in generated code, especially
    // in responsive screens, we need to ensure that pointerEvents: "none" is
    // not set if the Frame has no interaction events. There is no other way to
    // check in generated responsive screens, because overflow is set via css
    // classes, not inline style.
    const shouldDisablePointerEvents = !hasEvents(props) && !props.__fromCanvasComponent && !hasScrollableContent(props);
    const safeToEditPointerEvents = props.style ? !("pointerEvents" in props.style) : true;
    if (shouldDisablePointerEvents && safeToEditPointerEvents) {
        defaultStyle.pointerEvents = "none";
    }
    const addTextCentering = React.Children.count(props.children) > 0 &&
        React.Children.toArray(props.children).every(child => {
            return typeof child === "string" || typeof child === "number";
        });
    const centerTextStyle = addTextCentering && {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
    };
    const propsStyle = getStyleForFrameProps(props);
    if (size === undefined && !__fromCanvasComponent) {
        if (!hasLeftAndRight(propsStyle)) {
            defaultStyle.width = defaultFrameRect.width;
        }
        if (!hasTopAndBottom(propsStyle)) {
            defaultStyle.height = defaultFrameRect.height;
        }
    }
    if (unwrappedProps.minWidth !== undefined) {
        defaultStyle.minWidth = unwrappedProps.minWidth;
    }
    if (unwrappedProps.minHeight !== undefined) {
        defaultStyle.minHeight = unwrappedProps.minHeight;
    }
    let constraintsStyle = {};
    if (constraintsEnabled(unwrappedProps)) {
        // When we have an auto-sized dimension, the constraints rect will be
        // based on stale cached values, so we won't use it.
        if (constraintsRect && !isAutoSized(props)) {
            constraintsStyle = {
                left: constraintsRect.x,
                top: constraintsRect.y,
                width: constraintsRect.width,
                height: constraintsRect.height,
                right: undefined,
                bottom: undefined,
            };
        }
    }
    // In theory we should not have constraints and props styles at the same time
    // because we use constraints internally in vekter and top level props are only for usage from customer code
    //
    // In practice we have it with code overrides
    // But we take `propsStyle` priority in any case now
    Object.assign(defaultStyle, centerTextStyle, _initialStyle, propsStyle, constraintsStyle, style);
    // React styling library doesn't work well when combining long-hand and short-hand values, so we just use short-hand values always
    Object.assign(defaultStyle, {
        overflowX: defaultStyle.overflowX ?? defaultStyle.overflow,
        overflowY: defaultStyle.overflowY ?? defaultStyle.overflow,
        overflow: undefined,
    });
    Layer.applyWillChange(props, defaultStyle, true);
    let resultStyle = defaultStyle;
    if (!defaultStyle.transform) {
        // Reset the transform explicitly, because Framer Motion will not treat undefined values as 0 and still generate a transform
        resultStyle = { x: 0, y: 0, ...defaultStyle };
    }
    const onCanvas = RenderTarget.current() === RenderTarget.canvas;
    if (props.positionSticky) {
        if (!onCanvas || inCodeComponent) {
            resultStyle.position = "sticky";
            resultStyle.willChange = "transform";
            resultStyle.zIndex = 1;
            resultStyle.top = props.positionStickyTop;
            resultStyle.right = props.positionStickyRight;
            resultStyle.bottom = props.positionStickyBottom;
            resultStyle.left = props.positionStickyLeft;
        }
    }
    else if (onCanvas && (props.positionFixed || props.positionAbsolute)) {
        resultStyle.position = "absolute";
    }
    // Work around a framer-motion bug where key: undefined style values which
    // are moved to transforms add `fn(undefined)` to the transform string. Issue:
    // https://github.com/framer/company/issues/25915.
    if ("rotate" in resultStyle && resultStyle.rotate === undefined) {
        delete resultStyle.rotate;
    }
    return [resultStyle, constraintsRect];
}
// These properties are considered valid React DOM props because they're valid
// SVG props, so we need to manually exclude them.
const filteredProps = new Set([
    "width",
    "height",
    "opacity",
    "overflow",
    "radius",
    "background",
    "color",
    "x",
    "y",
    "z",
    "rotate",
    "rotateX",
    "rotateY",
    "rotateZ",
    "scale",
    "scaleX",
    "scaleY",
    "skew",
    "skewX",
    "skewY",
    "originX",
    "originY",
    "originZ",
]);
function getMotionProps(props) {
    const motionProps = {};
    for (const key in props) {
        const isValid = isValidMotionProp(key) || isPropValid(key);
        if (isValid && !filteredProps.has(key)) {
            motionProps[key] = props[key];
            /**
             * Support legacy layout animation props
             */
        }
        else if (key === "positionTransition" || key === "layoutTransition") {
            motionProps["layout"] = true;
            if (typeof props[key] !== "boolean" && !props.transition) {
                motionProps["transition"] = props[key];
            }
        }
    }
    return motionProps;
}
function hasDataFramerName(props) {
    return "data-framer-name" in props;
}
/** @internal */
const VisibleFrame = /* @__PURE__ */ forwardRef(function VisibleFrame(props, forwardedRef) {
    const { name, center, border, _border, __portal } = props;
    const { props: propsWithOverrides, children } = processOverrideForwarding(props);
    const motionProps = getMotionProps(propsWithOverrides);
    const layoutId = useLayoutId(props);
    const cursor = getCursorFromEvents(props);
    const fallbackRef = useRef(null);
    const ref = forwardedRef ?? fallbackRef;
    const dataProps = {
        "data-framer-component-type": "Frame",
        "data-framer-cursor": cursor,
        "data-framer-highlight": cursor === "pointer" ? true : undefined,
        "data-layoutid": layoutId,
    };
    // Vekter provides the `data-framer-name` prop. However to maintain api
    // compatibility when Frame is used in code, set `data-framer-name` if
    // `name` is provided and `data-framer-name` is not.
    if (!hasDataFramerName(props) && name) {
        dataProps["data-framer-name"] = name;
    }
    const [currentStyle, rect] = useStyleAndRect(propsWithOverrides);
    const unwrappedProps = unwrapFrameProps(propsWithOverrides);
    const autoSized = isAutoSized(unwrappedProps);
    if (center && !(rect && !autoSized && constraintsEnabled(unwrappedProps))) {
        if (!motionProps.transformTemplate)
            motionProps.transformTemplate = transformTemplate(center);
        Object.assign(dataProps, layoutHintDataPropsForCenter(center));
    }
    else if (!motionProps.transformTemplate) {
        motionProps.transformTemplate = undefined;
    }
    useMeasureLayout(props, ref);
    const backgroundImage = backgroundImageFromProps(props);
    // The parentSize resolved here won't be used if a parent further up the
    // tree disabled parent size resolution (e.g. when rendering inside a code component)
    const inCodeComponent = Boolean(useContext(ComponentContainerContext));
    const parentSize = resolveParentSize(propsWithOverrides, unwrappedProps, rect, inCodeComponent);
    const wrappedContent = useProvideParentSize(React.createElement(React.Fragment, null,
        backgroundImage ? (React.createElement(BackgroundImageComponent, { alt: props.alt ?? "", image: backgroundImage, containerSize: rect ?? undefined, nodeId: props.id && nodeIdFromString(props.id), layoutId: layoutId })) : null,
        children,
        React.createElement(Border, { ..._border, border: border, layoutId: layoutId })), parentSize);
    // It gets a motion component based on the `as` prop.
    // If `as` is not provided, it will default to `div`.
    const MotionComponent = motion[props.as ?? "div"];
    return (React.createElement(MotionComponent, { ...dataProps, ...motionProps, layoutId: layoutId, style: currentStyle, ref: ref, transformValues: transformValues },
        wrappedContent,
        __portal));
});
/** @internal */
export const FrameWithMotion = /* @__PURE__ */ forwardRef(function FrameWithMotion(props, ref) {
    if (process.env.NODE_ENV !== "production" && safeWindow["perf"])
        safeWindow["perf"].nodeRender();
    const { visible = true } = props;
    if (!visible)
        return null;
    return React.createElement(VisibleFrame, { ...props, ref: ref });
});
function resolveParentSize(props, unwrappedProps, rect, inCodeComponent) {
    if (inCodeComponent) {
        const parentSize = rect ? { width: rect.width, height: rect.height } : ParentSizeState.Disabled;
        return parentSize;
    }
    const { _usesDOMRect } = props;
    const { widthType = DimensionType.FixedNumber, heightType = DimensionType.FixedNumber, width, height, } = unwrappedProps;
    // The constraints rect might be based on stale layout information, or
    // return defaults if this is a DOM layout node, so we won't use it unless
    // `usesDOMRect` is also false
    if (rect && !_usesDOMRect) {
        return rect;
    }
    // Even if we can't resolve a full rect (e.g. when the node relies on DOM
    // layout for positioning), we might still be able to provide a size if this
    // is a fixed-size node
    if (widthType === DimensionType.FixedNumber &&
        heightType === DimensionType.FixedNumber &&
        typeof width === "number" &&
        typeof height === "number") {
        return { width, height };
    }
    // If this is a DOM layout node, or position fixed, we need to return
    // DisabledForCurrentLevel, instead of Disabled, because that way children
    // will still render using DOM layout, but we won't prevent any descendants
    // from using a resolved parent size further down the hierarchy
    if (_usesDOMRect || props.positionFixed || props.positionAbsolute) {
        return ParentSizeState.DisabledForCurrentLevel;
    }
    // If all else fails, return unknown
    return ParentSizeState.Unknown;
}
function isAutoSized({ width, height, }) {
    return width === "auto" || width === "min-content" || height === "auto" || height === "min-content";
}
//# sourceMappingURL=FrameWithMotion.js.map