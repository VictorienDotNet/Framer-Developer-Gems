import { isMotionComponent, motion, unwrapMotionComponent } from "framer-motion";
import React, { Children, cloneElement, forwardRef, isValidElement, useContext, useRef } from "react";
import { Animatable } from "../../animation/Animatable/Animatable.js";
import { cx } from "../../modules/cx.js";
import { useIsOnFramerCanvas } from "../../modules/useIsOnFramerCanvas.js";
import { isObject, isString } from "../../utils/utils.js";
import { collectTextShadowsForProps } from "../style/shadow.js";
import { calculateRect, ParentSizeState, useParentSize } from "../types/NewConstraints.js";
import { RenderTarget } from "../types/RenderEnvironment.js";
import { collectFiltersFromProps } from "../utils/filtersForNode.js";
import { injectComponentCSSRules } from "../utils/injectComponentCSSRules.js";
import { forceLayerBackingWithCSSProperties } from "../utils/setLayerBacked.js";
import { transformTemplate } from "../utils/transformTemplate.js";
import { useLayoutId } from "../utils/useLayoutId.js";
import { useMeasureLayout } from "../utils/useMeasureLayout.js";
import { ComponentContainerContext } from "./ComponentContainerContext.js";
import { convertVerticalAlignment, DeprecatedRichText, useLoadFonts, } from "./DeprecatedRichText.js";
const RichTextContainer = /* @__PURE__ */ forwardRef((props, ref) => {
    const { __fromCanvasComponent = false, _forwardedOverrideId, _forwardedOverrides, _usesDOMRect, bottom, center, children, environment = RenderTarget.current, fonts = [], height, isEditable = false, left, name, opacity, positionSticky, positionStickyBottom, positionStickyLeft, positionStickyRight, positionStickyTop, right, rotation = 0, style, stylesPresetsClassNames, text: plainText, top, verticalAlignment = "top", visible = true, width, willChangeTransform, withExternalLayout = false, viewBox, viewBoxScale = 1, ...rest } = props;
    const parentSize = useParentSize();
    const isOnCanvas = useIsOnFramerCanvas();
    const inCodeComponent = useContext(ComponentContainerContext);
    const layoutId = useLayoutId(props);
    const fallbackRef = useRef(null);
    const containerRef = ref ?? fallbackRef;
    useMeasureLayout(props, containerRef);
    useLoadFonts(fonts, __fromCanvasComponent, containerRef);
    if (!visible)
        return null;
    injectComponentCSSRules();
    const isHidden = isEditable && environment() === RenderTarget.canvas;
    const containerStyle = {
        outline: "none",
        display: "flex",
        flexDirection: "column",
        justifyContent: convertVerticalAlignment(verticalAlignment),
        opacity: isHidden ? 0 : opacity,
        flexShrink: 0,
    };
    const restrictedRenderTarget = RenderTarget.hasRestrictions();
    const frame = calculateRect(props, parentSize || ParentSizeState.Unknown, false);
    const isAutoSized = _usesDOMRect && (width === "auto" || height === "auto");
    const hasTransformTemplate = !!props.transformTemplate || !frame || !restrictedRenderTarget || __fromCanvasComponent || isAutoSized;
    const template = hasTransformTemplate ? props.transformTemplate ?? transformTemplate(center) : undefined;
    if (!withExternalLayout) {
        if (frame && restrictedRenderTarget && !isAutoSized) {
            const rotate = Animatable.getNumber(rotation).toFixed(4);
            containerStyle.transform = `translate(${frame.x}px, ${frame.y}px) rotate(${rotate}deg)`;
            containerStyle.width = frame.width;
            containerStyle.minWidth = frame.width;
            containerStyle.height = frame.height;
        }
        else {
            containerStyle.left = left;
            containerStyle.right = right;
            containerStyle.top = top;
            containerStyle.bottom = bottom;
            containerStyle.width = width;
            containerStyle.height = height;
            // I have no idea why this works as a number but not as a string. This is copied from the Text component.
            containerStyle.rotate = rotation;
        }
        if (positionSticky) {
            if (!isOnCanvas || inCodeComponent) {
                containerStyle.position = "sticky";
                containerStyle.willChange = "transform";
                containerStyle.zIndex = 1;
                containerStyle.top = positionStickyTop;
                containerStyle.right = positionStickyRight;
                containerStyle.bottom = positionStickyBottom;
                containerStyle.left = positionStickyLeft;
            }
        }
        else if (isOnCanvas && (props.positionFixed || props.positionAbsolute)) {
            containerStyle.position = "absolute";
        }
    }
    collectFiltersFromProps(props, containerStyle);
    collectTextShadowsForProps(props, containerStyle);
    if (willChangeTransform) {
        // We're not using Layer.applyWillChange here, because adding willChange:transform causes clipping issues in export
        forceLayerBackingWithCSSProperties(containerStyle);
    }
    Object.assign(containerStyle, style);
    if (layoutId) {
        rest.layout = "preserve-aspect";
    }
    if (isString(props.viewBox)) {
        return (React.createElement(motion.svg, { ...rest, ref: containerRef, style: containerStyle, layoutId: layoutId, transformTemplate: template, "data-framer-name": name, "data-framer-component-type": "RichTextContainer", viewBox: viewBox },
            React.createElement(motion.foreignObject, { width: "100%", height: "100%", transform: `scale(${viewBoxScale})`, style: { overflow: "visible", transformOrigin: "center center" } }, children && styleRichTextChildren(children, stylesPresetsClassNames, plainText))));
    }
    return (React.createElement(motion.div, { ...rest, ref: containerRef, style: containerStyle, layoutId: layoutId, transformTemplate: template, "data-framer-name": name, "data-framer-component-type": "RichTextContainer" }, children && styleRichTextChildren(children, stylesPresetsClassNames, plainText)));
});
function styleRichTextChildren(element, stylesPresetsClassNames, plainText) {
    let children = Children.toArray(element.props.children);
    // If a plain text is passed into the RichText component, trim the children
    // to only the first branch and replace the text of its leaf node below.
    if (isString(plainText)) {
        children = children.slice(0, 1);
    }
    children = children.map(child => {
        // Recursively process children.
        if (isValidElement(child)) {
            return styleRichTextChildren(child, stylesPresetsClassNames, plainText);
        }
        // Replace the text of the leaf node.
        if (isString(plainText)) {
            return plainText;
        }
        return child;
    });
    const { ["data-preset-tag"]: dataPresetTag, ...props } = element.props;
    if (isString(element.type) || isMotionComponent(element.type)) {
        const tag = dataPresetTag || unwrapMotionComponent(element.type) || element.type;
        const stylesPresetClassName = isString(tag) ? stylesPresetsClassNames?.[tag] : undefined;
        props.className = cx("framer-text", props.className, stylesPresetClassName);
    }
    // Add `framer-text` className and the correct stylesPresetClassName if
    // necessary to the element.
    return cloneElement(element, props, ...children);
}
/** @internal */
export const RichText = /* @__PURE__ */ forwardRef(({ children, html, htmlFromDesign, ...props }, ref) => {
    const content = html || children || htmlFromDesign;
    // The legacy RichText component did accept HTML instead of JSX. This is
    // used when VariantComponent hasn't been regenerated or if the user is
    // passing a code override that sets the `html` prop.
    if (isString(content)) {
        // The implementation of the collectElementStylesPresets has changed
        // to pass in a object but the DeprecatedRichText component still
        // expects a string.
        if (!props.stylesPresetsClassName && isObject(props.stylesPresetsClassNames)) {
            props.stylesPresetsClassName = Object.values(props.stylesPresetsClassNames).join(" ");
        }
        const contentProp = {
            // We need to use the original prop name.
            [isString(html) ? "html" : "htmlFromDesign"]: content,
        };
        return React.createElement(DeprecatedRichText, { ...props, ...contentProp, ref: ref });
    }
    // Scenario: If the content has been regenerated but the
    // GeneratedVariantComponent is stale.
    if (!props.stylesPresetsClassNames && isString(props.stylesPresetsClassName)) {
        // Previously the collectElementStylesPresets was setting the
        // stylesPresetsClassName to a string with 5 classNames
        // representing the different presets. To separate them again we
        // depend on specific order they were defined in.
        const [h1, h2, h3, p, a] = props.stylesPresetsClassName.split(" ");
        // If one of them is set, all of them should be set.
        if (h1 === undefined || h2 === undefined || h3 === undefined || p === undefined || a === undefined) {
            // eslint-disable-next-line no-console
            console.warn(`Encountered invalid stylesPresetsClassNames: ${props.stylesPresetsClassNames}`);
        }
        else {
            props.stylesPresetsClassNames = { h1, h2, h3, p, a };
        }
    }
    return (React.createElement(RichTextContainer, { ...props, ref: ref }, isValidElement(content) ? content : undefined));
});
//# sourceMappingURL=RichText.js.map