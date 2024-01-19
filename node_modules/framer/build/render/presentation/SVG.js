import { motion } from "framer-motion";
import process from "process";
import React from "react";
import { Animatable } from "../../animation/Animatable/Animatable.js";
import { safeWindow } from "../../utils/safeWindow.js";
import { collectOpacityFromProps } from "../traits/Opacity.js";
import { BackgroundImage } from "../types/BackgroundImage.js";
import { Color } from "../types/Color/Color.js";
import { LinearGradient } from "../types/LinearGradient.js";
import { calculateRect, constraintsEnabled, ParentSizeState, useParentSize, } from "../types/NewConstraints.js";
import { RadialGradient } from "../types/RadialGradient.js";
import { RenderEnvironment, RenderTarget } from "../types/RenderEnvironment.js";
import { elementPropertiesForLinearGradient, elementPropertiesForRadialGradient, } from "../utils/elementPropertiesForGradient.js";
import { collectFiltersFromProps } from "../utils/filtersForNode.js";
import { imagePatternPropsForFill } from "../utils/imagePatternPropsForFill.js";
import { injectComponentCSSRules } from "../utils/injectComponentCSSRules.js";
import { isFiniteNumber } from "../utils/isFiniteNumber.js";
import { layoutHintDataPropsForCenter } from "../utils/layoutHintDataPropsForCenter.js";
import { transformTemplate } from "../utils/transformTemplate.js";
import { useLayoutId } from "../utils/useLayoutId.js";
import { useMeasureLayout } from "../utils/useMeasureLayout.js";
import { resetSetStyle } from "../utils/useWebkitFixes.js";
import { useProvidedWindow } from "../WindowContext.js";
import { ImagePatternElement } from "./ImagePatternElement.js";
import { Layer } from "./Layer.js";
import { sharedSVGManager } from "./SharedSVGManager.js";
// Before migrating to functional components we need to get parentSize data from context
/**
 * @internal
 */
export function SVG(props) {
    const parentSize = useParentSize();
    const ariaId = "svg" + React.useId();
    const layoutId = useLayoutId(props);
    const layoutRef = React.useRef(null);
    const providedWindow = useProvidedWindow();
    useMeasureLayout(props, layoutRef);
    return (React.createElement(SVGComponent, { ...props, innerRef: layoutRef, parentSize: parentSize, ariaId: ariaId, layoutId: layoutId, providedWindow: providedWindow }));
}
const MAX_BACKGROUND_SVG_TEXT_LENGTH = 50_000;
function containsImageReference(svg) {
    return svg.indexOf("image") >= 0;
}
function containsCustomPropertyReference(svg) {
    return svg.indexOf("var(--") >= 0;
}
function hasBorderRadius(style) {
    return !!(style.borderRadius ||
        style.borderBottomLeftRadius ||
        style.borderBottomRightRadius ||
        style.borderTopLeftRadius ||
        style.borderTopRightRadius);
}
function sizeSVG(container, props) {
    const div = container.current;
    if (!div)
        return;
    // The ResponsiveScreenContainer.tsx of vekter allows content to be rendered into an iframe via
    // a react portal. This means that the javascript is executed by react outside of the iframe,
    // but the html elements are mounted inside the iframe. That means that attempting to do checks
    // by reference between dom nodes and dom classes will fail. To work around this, we need to
    // make sure that we use the same reference. We do this by creating a context that captures the
    // value of the iframe's window, we then use that to reference the correct dom node class.
    const localWindow = props.providedWindow ?? safeWindow;
    const svg = div.firstElementChild;
    if (!svg || !(svg instanceof localWindow.SVGSVGElement))
        return;
    // Workaround for Firefox mostly: Sometimes react dehydration does not update
    // dangerouslySetInnerHTML properties. And ssg produces templates without viewBoxes, as there is
    // no DOMParser on the server side. And Firefox does not render the SVG correctly without a
    // viewBox that is the size of the svg referenced by <use ... />
    // See also: https://github.com/framer/company/issues/24019
    if (!svg.getAttribute("viewBox")) {
        const viewBox = sharedSVGManager.getViewBox(props.svg);
        if (viewBox) {
            svg.setAttribute("viewBox", viewBox);
        }
    }
    const { withExternalLayout, parentSize } = props;
    // SVGs rendered on the canvas will already have an explicit size calculated
    // and set by the `collectLayout()` method, so we don't need to resize them
    // again. When in a DOM Layout Stack or a code component parent size will be
    // disabled for the current level, so sizes won't be calculated, and SVGs
    // will be treated as if they have external layout.
    const canUseCalculatedOnCanvasSize = !withExternalLayout &&
        constraintsEnabled(props) &&
        parentSize !== ParentSizeState.Disabled &&
        parentSize !== ParentSizeState.DisabledForCurrentLevel;
    if (canUseCalculatedOnCanvasSize)
        return;
    const { intrinsicWidth, intrinsicHeight, _constraints } = props;
    if (svg.viewBox.baseVal?.width === 0 &&
        svg.viewBox.baseVal?.height === 0 &&
        isFiniteNumber(intrinsicWidth) &&
        isFiniteNumber(intrinsicHeight)) {
        svg.setAttribute("viewBox", `0 0 ${intrinsicWidth} ${intrinsicHeight}`);
    }
    // XXX TODO take the value from _constraints.aspectRatio into account
    if (_constraints && _constraints.aspectRatio) {
        svg.setAttribute("preserveAspectRatio", "");
    }
    else {
        svg.setAttribute("preserveAspectRatio", "none");
    }
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
}
export const SVGComponent = /* @__PURE__ */ (() => {
    return class SVGComponentInner extends Layer {
        static supportsConstraints = true;
        static defaultSVGProps = {
            left: undefined,
            right: undefined,
            top: undefined,
            bottom: undefined,
            style: undefined,
            _constraints: {
                enabled: true,
                aspectRatio: null,
            },
            parentSize: ParentSizeState.Unknown,
            rotation: 0,
            visible: true,
            svg: "",
            shadows: [],
        };
        static defaultProps = {
            ...Layer.defaultProps,
            ...SVGComponentInner.defaultSVGProps,
        };
        static frame(props) {
            return calculateRect(props, props.parentSize || ParentSizeState.Unknown);
        }
        container = React.createRef();
        svgElement = null;
        setSVGElement = (element) => {
            this.svgElement = element;
            this.setLayerElement(element);
        };
        previouslyRenderedSVG = "";
        get frame() {
            return calculateRect(this.props, this.props.parentSize || ParentSizeState.Unknown);
        }
        unmountedSVG = "";
        componentDidMount() {
            // This normally isn't called, but in strict+dev mode, react will call will did mount,
            // will unmount, did mount. If no render follows afterwards, the svg will disappear from the
            // page after 5 seconds.
            if (this.unmountedSVG) {
                const { svgContentId } = this.props;
                const contentid = svgContentId ? "svg" + svgContentId : null;
                sharedSVGManager.subscribe(this.unmountedSVG, !svgContentId, contentid);
                this.previouslyRenderedSVG = this.unmountedSVG;
            }
            if (this.props.svgContentId)
                return;
            sizeSVG(this.container, this.props);
        }
        componentWillUnmount() {
            sharedSVGManager.unsubscribe(this.previouslyRenderedSVG);
            this.unmountedSVG = this.previouslyRenderedSVG;
            this.previouslyRenderedSVG = "";
        }
        componentDidUpdate(prevProps) {
            super.componentDidUpdate(prevProps);
            if (this.props.svgContentId)
                return;
            const { fill } = this.props;
            if (BackgroundImage.isImageObject(fill) &&
                BackgroundImage.isImageObject(prevProps.fill) &&
                fill.src !== prevProps.fill.src) {
                resetSetStyle(this.svgElement, "fill", null, false);
            }
            sizeSVG(this.container, this.props);
        }
        collectLayout(style, innerStyle) {
            if (this.props.withExternalLayout) {
                // When the outer element is already sized correclty the inner element needs to fill it.
                innerStyle.width = "100%";
                innerStyle.height = "100%";
                innerStyle.aspectRatio = "inherit";
                return;
            }
            const frame = this.frame;
            const { rotation, intrinsicWidth, intrinsicHeight, width, height } = this.props;
            const rotate = Animatable.getNumber(rotation);
            style.opacity = isFiniteNumber(this.props.opacity) ? this.props.opacity : 1;
            /**
             * The if-statement below switches between positioning the SVG with
             * transforms or (in the else statement) with DOM-layout.
             *
             * On the canvas (when RenderTarget.hasRestrictions()) we want to
             * position with transforms for performance reasons. When dragging an
             * SVG around, if we can reposition an SVG using transforms, it won't
             * trigger a browser layout.
             *
             * In the preview we always position with DOM-layout, to not interfere
             * with Magic Motion that uses the transforms for animating.
             *
             * However, there might be cases where we do not have a frame to use for
             * positioning the SVG using transforms. For example when rendering
             * inside a Scroll component (that uses DOM-layout for it's children,
             * also on the canvas), we cannot always calculate a frame. In these
             * cases we do use DOM-layout to position the SVG, even on the canvas.
             */
            if (RenderTarget.hasRestrictions() && frame) {
                Object.assign(style, {
                    transform: `translate(${frame.x}px, ${frame.y}px) rotate(${rotate.toFixed(4)}deg)`,
                    width: `${frame.width}px`,
                    height: `${frame.height}px`,
                });
                if (constraintsEnabled(this.props)) {
                    style.position = "absolute";
                }
                const xFactor = frame.width / (intrinsicWidth || 1);
                const yFactor = frame.height / (intrinsicHeight || 1);
                innerStyle.transformOrigin = "top left";
                const { zoom, target } = RenderEnvironment;
                if (target === RenderTarget.export) {
                    const zoomFactor = zoom > 1 ? zoom : 1;
                    innerStyle.transform = `scale(${xFactor * zoomFactor}, ${yFactor * zoomFactor})`;
                    innerStyle.zoom = 1 / zoomFactor;
                }
                else {
                    innerStyle.transform = `scale(${xFactor}, ${yFactor})`;
                }
                if (intrinsicWidth && intrinsicHeight) {
                    innerStyle.width = intrinsicWidth;
                    innerStyle.height = intrinsicHeight;
                }
            }
            else {
                const { left, right, top, bottom } = this.props;
                Object.assign(style, {
                    left,
                    right,
                    top,
                    bottom,
                    width,
                    height,
                    rotate,
                });
                Object.assign(innerStyle, {
                    left: 0,
                    top: 0,
                    bottom: 0,
                    right: 0,
                    position: "absolute",
                });
            }
        }
        render() {
            if (process.env.NODE_ENV !== "production" && safeWindow["perf"])
                safeWindow["perf"].nodeRender();
            const { id, visible, style, fill, svg, intrinsicHeight, intrinsicWidth, ariaId = "", title, description, layoutId, className, variants, withExternalLayout, innerRef, svgContentId, height, opacity, width, ...rest } = this.props;
            if (!withExternalLayout && (!visible || !id))
                return null;
            const identifier = id ?? layoutId ?? "svg";
            injectComponentCSSRules();
            const frame = this.frame;
            // XXX find another way to not need these defaults
            const size = frame || { width: intrinsicWidth || 100, height: intrinsicHeight || 100 };
            const outerStyle = { ...style, imageRendering: "pixelated", flexShrink: 0 };
            const innerStyle = {};
            this.collectLayout(outerStyle, innerStyle);
            collectOpacityFromProps(this.props, outerStyle);
            collectFiltersFromProps(this.props, outerStyle);
            Layer.applyWillChange(this.props, outerStyle, false);
            /** The fillElement will be used an all paths in the SVG that have no fill set. */
            let fillElement = null;
            if (typeof fill === "string" || Color.isColorObject(fill)) {
                const fillColor = Color.isColorObject(fill) ? fill.initialValue || Color.toRgbString(fill) : fill;
                outerStyle.fill = fillColor;
                outerStyle.color = fillColor;
            }
            else if (LinearGradient.isLinearGradient(fill)) {
                const gradient = fill;
                // We need encodeURI() here to handle our old id's that contained special characters like ';'
                // Creating an url() entry for those id's unescapes them, so we need to use the URI encoded version
                const gradientId = `${encodeURI(id || "")}g${LinearGradient.hash(gradient)}`;
                outerStyle.fill = `url(#${gradientId})`;
                const { stops, x1, x2, y1, y2 } = elementPropertiesForLinearGradient(gradient, identifier);
                fillElement = (React.createElement("svg", { ref: this.setSVGElement, xmlns: "http://www.w3.org/2000/svg", width: "100%", height: "100%", style: { position: "absolute" } },
                    React.createElement("linearGradient", { id: gradientId, x1: x1, x2: x2, y1: y1, y2: y2 }, stops.map((stop, idx) => {
                        return (React.createElement("stop", { key: idx, offset: stop.position, stopColor: stop.color, stopOpacity: stop.alpha }));
                    }))));
            }
            else if (RadialGradient.isRadialGradient(fill)) {
                const gradient = fill;
                // We need encodeURI() here to handle our old id's that contained special characters like ';'
                // Creating an url() entry for those id's unescapes them, so we need to use the URI encoded version
                const gradientId = `${encodeURI(id || "")}g${RadialGradient.hash(gradient)}`;
                outerStyle.fill = `url(#${gradientId})`;
                const elementProperties = elementPropertiesForRadialGradient(gradient, identifier);
                fillElement = (React.createElement("svg", { ref: this.setSVGElement, xmlns: "http://www.w3.org/2000/svg", width: "100%", height: "100%", style: { position: "absolute" } },
                    React.createElement("radialGradient", { id: gradientId, cy: gradient.centerAnchorY, cx: gradient.centerAnchorX, r: gradient.widthFactor }, elementProperties.stops.map((stop, idx) => {
                        return (React.createElement("stop", { key: idx, offset: stop.position, stopColor: stop.color, stopOpacity: stop.alpha }));
                    }))));
            }
            else if (BackgroundImage.isImageObject(fill)) {
                const imagePattern = imagePatternPropsForFill(fill, size, identifier);
                if (imagePattern) {
                    outerStyle.fill = `url(#${imagePattern.id})`;
                    fillElement = (React.createElement("svg", { ref: this.setSVGElement, xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink", width: "100%", height: "100%", style: { position: "absolute" } },
                        React.createElement("defs", null,
                            React.createElement(ImagePatternElement, { ...imagePattern }))));
                }
            }
            const dataProps = {
                "data-framer-component-type": "SVG",
            };
            const hasTransformTemplate = !frame;
            if (hasTransformTemplate) {
                Object.assign(dataProps, layoutHintDataPropsForCenter(this.props.center));
            }
            // If the svg is smallish, and doesn't contain images, and there is no fill defined, and no
            // background is defined, then we can use a much cheaper method to render this svg by using
            // a backgroundImage data url.
            const svgAsBackgroundImage = !fillElement &&
                !outerStyle.fill &&
                !outerStyle.background &&
                !outerStyle.backgroundImage &&
                svg.length < MAX_BACKGROUND_SVG_TEXT_LENGTH &&
                !containsImageReference(svg) &&
                !containsCustomPropertyReference(svg);
            let content = null;
            if (svgAsBackgroundImage) {
                outerStyle.backgroundSize = "100% 100%";
                outerStyle.backgroundImage = `url('data:image/svg+xml;utf8,${encodeURIComponent(svg)}')`;
                sharedSVGManager.unsubscribe(this.previouslyRenderedSVG);
                this.previouslyRenderedSVG = "";
            }
            else {
                const contentid = svgContentId ? "svg" + svgContentId : null;
                const __html = sharedSVGManager.subscribe(svg, !svgContentId, contentid);
                sharedSVGManager.unsubscribe(this.previouslyRenderedSVG);
                this.previouslyRenderedSVG = svg;
                if (hasBorderRadius(outerStyle)) {
                    // Border radius will have no effect on nested elements, unless we add overflow hidden
                    outerStyle.overflow = "hidden";
                }
                // Note how the fillElement and fill is used below, via css a fill is set, then any svg
                // path that doesn't have a fill set will take on this fill.
                content = (React.createElement(React.Fragment, null,
                    fillElement,
                    React.createElement("div", { key: BackgroundImage.isImageObject(fill) ? fill.src : "", className: "svgContainer" // Style for this class is added by `injectComponentCSSRules`
                        , style: innerStyle, ref: this.container, dangerouslySetInnerHTML: { __html } })));
            }
            // Tag support, aria support, link support
            const MotionComponent = motion[this.props.as ?? "div"];
            const { href, target, rel, onClick } = this.props;
            const ariaDescriptionId = ariaId + "desc";
            return (React.createElement(MotionComponent, { ...dataProps, ...rest, layoutId: layoutId, transformTemplate: hasTransformTemplate ? transformTemplate(this.props.center) : undefined, id: id, ref: innerRef, style: outerStyle, className: className, variants: variants, tabIndex: this.props.tabIndex, role: title || description ? "img" : undefined, "aria-label": title, "aria-describedby": description ? ariaDescriptionId : undefined, ...{ href, target, rel, onClick } },
                content,
                description && (React.createElement("div", { style: VISUALLY_HIDDEN_STYLES, id: ariaDescriptionId }, description))));
        }
    };
})();
/**
 * @name VISUALLY_HIDDEN_STYLES
 * Attention these styles are only visually hidden,
 * meaning they still exist in the DOM and are included in the Accessibility API (if applicable).
 */
const VISUALLY_HIDDEN_STYLES = {
    clip: "rect(1px, 1px, 1px, 1px)",
    clipPath: "inset(50%)",
    height: "1px",
    width: "1px",
    margin: "-1px",
    overflow: "hidden",
    padding: 0,
    position: "absolute",
};
//# sourceMappingURL=SVG.js.map