import { motion } from "framer-motion";
import process from "process";
import React, { useEffect, useRef } from "react";
import { Animatable } from "../../animation/Animatable/Animatable.js";
import { cx } from "../../modules/cx.js";
import { navigateFromAttributes } from "../../modules/framerPageLink.js";
import { useImplicitPathVariables, useLinkMatchesRoute } from "../../modules/Link.js";
import { replaceFramerPageLinks } from "../../modules/replaceFramerPageLinks.js";
import { useIsOnFramerCanvas } from "../../modules/useIsOnFramerCanvas.js";
import { useCurrentRoute, useRoutePreloader, useRouter } from "../../router/index.js";
import { deviceFont } from "../../utils/environment.js";
import { safeWindow } from "../../utils/safeWindow.js";
import { isString } from "../../utils/utils.js";
import { fontStore, LoadFontResult } from "../fonts/fontStore.js";
import { useFontLoadStatus } from "../fonts/useFontLoadStatus.js";
import { collectTextShadowsForProps } from "../style/shadow.js";
import { DimensionType } from "../types/Constraints.js";
import { calculateRect, ParentSizeState, useParentSize, } from "../types/NewConstraints.js";
import { RenderTarget } from "../types/RenderEnvironment.js";
import { collectFiltersFromProps } from "../utils/filtersForNode.js";
import { findAnchorElement } from "../utils/findAnchorElement.js";
import { injectComponentCSSRules } from "../utils/injectComponentCSSRules.js";
import { isFiniteNumber } from "../utils/isFiniteNumber.js";
import { isShallowEqualArray } from "../utils/isShallowEqualArray.js";
import { layoutHintDataPropsForCenter } from "../utils/layoutHintDataPropsForCenter.js";
import { forceLayerBackingWithCSSProperties } from "../utils/setLayerBacked.js";
import { transformTemplate } from "../utils/transformTemplate.js";
import { useLayoutId } from "../utils/useLayoutId.js";
import { measureClosestComponentContainer, useMeasureLayout } from "../utils/useMeasureLayout.js";
import { ComponentContainerContext } from "./ComponentContainerContext.js";
import { Layer } from "./Layer.js";
// Before migrating to functional components we need to get parentSize data from context
/**
 * @internal
 */
export const Text = /* @__PURE__ */ React.forwardRef(function Text(props, forwardedRef) {
    const parentSize = useParentSize();
    const layoutId = useLayoutId(props);
    const fallbackLayoutRef = useRef(null);
    const layoutRef = forwardedRef ?? fallbackLayoutRef;
    const { navigate, getRoute } = useRouter();
    const currentRoute = useCurrentRoute();
    useRoutePreloader(props.preload ?? []);
    const onCanvas = useIsOnFramerCanvas();
    const matchesCurrentRoute = useLinkMatchesRoute(props.__link);
    const fontLoadStatus = useFontLoadStatus(props.fonts);
    useMeasureLayout(props, layoutRef);
    const { fonts, __fromCanvasComponent } = props;
    // The fonts array is typically regenerated for every change to a text node,
    // so we need to keep track of previous values to avoid calls to the font
    // store when the contents of the array are the same between renders
    const prevFontsRef = useRef([]);
    const fontsDidChange = !isShallowEqualArray(prevFontsRef.current ?? [], fonts ?? []);
    prevFontsRef.current = fonts;
    useEffect(() => {
        if (!fontsDidChange || !fonts)
            return;
        fontStore.loadWebFontsFromSelectors(fonts).then(results => {
            // After fonts load, layout is likely to shift in auto-sized
            // elements. Since measurements would have typically already been
            // taken at this point, this can lead to selection outlines
            // appearing out of sync with the rendered component. On the canvas
            // we hook into the font loading process and manually trigger a
            // re-render for the node when it completes, which in turn makes
            // sure that all layout measurements take the latest layout shifts
            // into account. In compiled smart components, however, we can't use
            // the same solution. We'll instead check if new fonts have been
            // loaded, and attempt to add a measure request for the closest
            // component container, which in the case of component instances is
            // the only node whose measurements need updating (we don't track
            // measurements for things rendered inside the component itself,
            // which could also be affected by layout shifts).
            // If we're not running on the canvas and from within a smart
            // component, there's no need to measure.
            if (!__fromCanvasComponent || !layoutRef.current || RenderTarget.current() !== RenderTarget.canvas)
                return;
            // We only need to measure if at least one new font has been loaded.
            // Otherwise we assume there was no layout shift.
            const didLoadNewFonts = results.some(result => result.status === "fulfilled" && result.value === LoadFontResult.Loaded);
            if (!didLoadNewFonts)
                return;
            measureClosestComponentContainer(layoutRef.current);
        });
    }, [fonts]);
    const implicitPathVariables = useImplicitPathVariables();
    const interceptPageLinks = React.useCallback((event) => {
        const anchorElement = findAnchorElement(event.target, layoutRef.current);
        // Don't prevent cmd + click, allowing users to open in new tab.
        if (event.metaKey || !navigate || !anchorElement)
            return;
        // Page links written to the draft text in the
        // data:framer/page-link, format should have been parsed, and
        // replaced with paths. If that has happened, we can access the
        // route id and transition properties as data attributes, finally
        // performing a navigation.
        const didNavigate = navigateFromAttributes(navigate, anchorElement, implicitPathVariables);
        if (didNavigate) {
            event.preventDefault();
        }
    }, [navigate, implicitPathVariables]);
    useEffect(() => {
        layoutRef.current?.addEventListener("click", interceptPageLinks);
        const ref = layoutRef.current;
        return () => ref?.removeEventListener("click", interceptPageLinks);
    }, [interceptPageLinks]);
    // Parse the raw draft html to replace framer page links in the
    // data:framer/page-link, format with the paths their target corresponds to.
    // This needs to happen whenever the rawHTML string changes, since smart
    // components can update the draft text in variants by updating this prop
    // value.
    //
    // In future, for generated code, it might be better to try to convert the
    // draft html to a react tree during generation. We could do that in code
    // generation since we are already converting strings to jsx, and that would
    // allow us to do this replacement without a regex.
    const rawHTML = React.useMemo(() => {
        if (!props.rawHTML || onCanvas || !getRoute || !currentRoute)
            return props.rawHTML;
        return replaceFramerPageLinks(props.rawHTML, getRoute, currentRoute, implicitPathVariables);
    }, [props.rawHTML, getRoute, onCanvas, currentRoute, implicitPathVariables]);
    return (React.createElement(TextComponent, { ...props, innerRef: layoutRef, layoutId: layoutId, parentSize: parentSize, fontLoadStatus: fontLoadStatus, rawHTML: rawHTML, matchesCurrentRoute: matchesCurrentRoute }));
});
export const TextComponent = /* @__PURE__ */ (() => {
    return class TextComponentInner extends Layer {
        static supportsConstraints = true;
        static defaultTextProps = {
            opacity: undefined,
            left: undefined,
            right: undefined,
            top: undefined,
            bottom: undefined,
            _constraints: {
                enabled: true,
                aspectRatio: null,
            },
            rotation: 0,
            visible: true,
            alignment: undefined,
            verticalAlignment: "top",
            shadows: [],
            font: "16px " + deviceFont(),
        };
        static defaultProps = {
            ...Layer.defaultProps,
            ...TextComponentInner.defaultTextProps,
            isEditable: false,
            environment: RenderTarget.current,
            withExternalLayout: false,
            fontLoadStatus: "loading",
        };
        editorText;
        get frame() {
            return calculateRect(this.props, this.props.parentSize || ParentSizeState.Unknown, false);
        }
        getOverrideText() {
            const { _forwardedOverrideId, _forwardedOverrides, id } = this.props;
            const forwardedOverrideId = _forwardedOverrideId ?? id;
            if (forwardedOverrideId && _forwardedOverrides) {
                const text = _forwardedOverrides[forwardedOverrideId];
                if (isString(text)) {
                    return text;
                }
            }
        }
        render() {
            // Refactor to use React.useContext()
            return React.createElement(ComponentContainerContext.Consumer, null, this.renderMain);
        }
        collectLayout(style, inCodeComponent) {
            if (this.props.withExternalLayout)
                return;
            const frame = this.frame;
            const { rotation, autoSize, positionSticky, positionStickyTop, positionStickyRight, positionStickyBottom, positionStickyLeft, width: externalWidth, height: externalHeight, _usesDOMRect, positionFixed, positionAbsolute, } = this.props;
            const rotate = Animatable.getNumber(rotation);
            const isDOMLayoutAutoSized = _usesDOMRect && (externalWidth === "auto" || externalHeight === "auto");
            if (frame && !isDOMLayoutAutoSized && RenderTarget.hasRestrictions()) {
                Object.assign(style, {
                    transform: `translate(${frame.x}px, ${frame.y}px) rotate(${rotate.toFixed(4)}deg)`,
                    // Using “auto” fixes wrapping problems where our size calculation does not work out well when zooming the
                    // text (due to rendering differences).
                    // TODO: When the `autoSize` prop is removed, it's safe to leave
                    // this at `${frame.width}px`, because all auto cases will be
                    // handled by DOM layout in the `else` side of the conditional
                    width: autoSize ? "auto" : `${frame.width}px`,
                    minWidth: `${frame.width}px`,
                    height: `${frame.height}px`,
                });
            }
            else {
                const { left, right, top, bottom } = this.props;
                let width;
                let height;
                if (autoSize) {
                    width = "auto";
                    height = "auto";
                }
                else {
                    if (!isFiniteNumber(left) || !isFiniteNumber(right)) {
                        width = externalWidth;
                    }
                    if (!isFiniteNumber(top) || !isFiniteNumber(bottom)) {
                        height = externalHeight;
                    }
                }
                Object.assign(style, {
                    left,
                    right,
                    top,
                    bottom,
                    width,
                    height,
                    rotate,
                });
            }
            const onCanvas = RenderTarget.current() === RenderTarget.canvas;
            if (positionSticky) {
                if (!onCanvas || inCodeComponent) {
                    style.position = "sticky";
                    style.willChange = "transform";
                    style.zIndex = 1;
                    style.top = positionStickyTop;
                    style.right = positionStickyRight;
                    style.bottom = positionStickyBottom;
                    style.left = positionStickyLeft;
                }
            }
            else if (onCanvas && (positionFixed || positionAbsolute)) {
                style.position = "absolute";
            }
        }
        setElement = (element) => {
            if (this.props.innerRef) {
                this.props.innerRef.current = element;
            }
            this.setLayerElement(element);
        };
        get transformTemplate() {
            const { _usesDOMRect, widthType, heightType, __fromCanvasComponent } = this.props;
            if (this.props.transformTemplate)
                return this.props.transformTemplate;
            const frame = this.frame;
            const isDOMLayoutAutoSized = _usesDOMRect && (widthType === DimensionType.Auto || heightType === DimensionType.Auto);
            const hasTransformTemplate = !frame || !RenderTarget.hasRestrictions() || __fromCanvasComponent || isDOMLayoutAutoSized;
            if (hasTransformTemplate)
                return transformTemplate(this.props.center);
        }
        /** Used by the ComponentContainerContext */
        renderMain = (inCodeComponent) => {
            if (process.env.NODE_ENV !== "production" && safeWindow["perf"])
                safeWindow["perf"].nodeRender();
            const { font, visible, alignment, willChangeTransform, opacity, id, layoutId, className, transition, variants, name, __fromCanvasComponent, _initialStyle, widthType, heightType, _usesDOMRect, autoSize, style: styleProp, fontLoadStatus, matchesCurrentRoute, preload, tabIndex, ...rest } = this.props;
            if (!visible) {
                return null;
            }
            injectComponentCSSRules();
            // We want to hide the Text component underneath the TextEditor when editing.
            const isHidden = this.props.isEditable && this.props.environment() === RenderTarget.canvas;
            const justifyContent = convertVerticalAlignment(this.props.verticalAlignment);
            // Add more styling and support vertical text alignment
            const style = {
                outline: "none",
                display: "flex",
                flexDirection: "column",
                justifyContent: justifyContent,
                opacity: isHidden ? 0 : opacity,
                flexShrink: 0,
            };
            // QUICKFIX: Legacy code overrides pass the style from the text node as _initialStyle.
            // We have only consumed that object in FrameWithMotion but never in the Text component.
            // With the new WithTextStyle we need to render some CSS custom properties that are passed by the TextNode.
            // As the _initialStyle object contains additional styles that could break old projects we can't spread it.
            if (_initialStyle) {
                for (const key in _initialStyle) {
                    if (key.startsWith("--framer")) {
                        style[key] = _initialStyle[key];
                    }
                }
            }
            const dataProps = {
                "data-framer-component-type": "Text",
                "data-framer-name": name,
            };
            // Compatibility for Smart Components generated before
            // https://github.com/framer/FramerStudio/pull/8270.
            if (autoSize) {
                dataProps["data-framer-component-text-autosized"] = "true";
            }
            this.collectLayout(style, inCodeComponent);
            collectFiltersFromProps(this.props, style);
            collectTextShadowsForProps(this.props, style);
            if (style.opacity === 1 || style.opacity === undefined) {
                // Wipe opacity setting if it's the default (1 or undefined)
                delete style.opacity;
            }
            if (willChangeTransform) {
                // We're not using Layer.applyWillChange here, because adding willChange:transform causes clipping issues in export
                forceLayerBackingWithCSSProperties(style);
            }
            let rawHTML = this.props.rawHTML;
            const text = this.getOverrideText() || this.props.text;
            if (isString(text)) {
                if (rawHTML) {
                    rawHTML = replaceDraftHTMLWithText(rawHTML, text);
                }
                else {
                    rawHTML = `<p style="font: ${font}">${text}</p>`;
                }
            }
            if (this.props.style) {
                Object.assign(style, this.props.style);
            }
            const centeringTransformTemplate = this.transformTemplate;
            if (centeringTransformTemplate)
                Object.assign(dataProps, layoutHintDataPropsForCenter(this.props.center));
            if (rawHTML) {
                style.lineHeight = "1px";
                style.fontSize = "0px";
                // Hide the fonts while loading to avoid layout flashes
                if (RenderTarget.current() === RenderTarget.canvas && fontLoadStatus === "loading") {
                    style.visibility = "hidden";
                }
                // On the canvas, color the text background red if a font could not be loaded
                if (RenderTarget.current() === RenderTarget.canvas && fontLoadStatus === "timeout") {
                    style.backgroundColor = "rgba(255, 0, 0, 0.3)";
                }
                Object.assign(style, styleProp);
                // Old compiled smart components use the dedicated alignment prop which should get preference over the property in style
                if (alignment)
                    style["--framer-text-alignment"] = alignment;
                // Only render a tabindex attribute if its explicitely requested.
                const tabIndexProps = getTabIndexProps(tabIndex);
                return (React.createElement(motion.div, { layoutId: layoutId, id: id, ...tabIndexProps, ...dataProps, ...rest, style: style, transformTemplate: centeringTransformTemplate, dangerouslySetInnerHTML: { __html: rawHTML }, "data-center": this.props.center, className: cx(className, matchesCurrentRoute && "isCurrent"), transition: transition, variants: variants, ref: this.setElement }));
            }
        };
    };
})();
// Wrapping link tag is optional.
const linkTag = "(?:<a[^>]*>)?";
const linkClosingTag = "(?:</a>)?";
// Outer tag can be div, span, or other semantic tag.
const outerTag = "<[^>]+>";
const outerClosingTag = "</[^>]+>";
// Block tag can be div (older components), or span (newer components).
const blockTag = "<(?:div|span)[^>]*>";
const blockClosingTag = "</(?:div|span)>";
// Insidie a block there is one or more tags for inline styles.
const inlineTag = "<[^>]+>";
const inlineClosingTag = "</[^>]+>";
const textContentRegex = new RegExp(`^(${linkTag}${outerTag}${blockTag}${inlineTag}).*?(${inlineClosingTag}).*?(${blockClosingTag}${outerClosingTag}${linkClosingTag})$`, 
//                                              ^^^ this is the content we want to replace
//                                                                      ^^^ this is the content we want to discard
"s" // let the "." also match newlines
);
/**
 * If text is overriden in an override or by a variable, we take the rawHTML,
 * find the first styled span inside the first block, put the text in there, and
 * discard everything else. For example:
 *
 *     <p>
 *         <span>
 *             <span style="BOLD">Hello </span>
 *             <span>World from the 1st block</span>
 *             <br>
 *         </span>
 *         <span>
 *             <!-- Second block is an empty line -->
 *             <span><br></span>
 *         </span>
 *         <span>
 *             <span>More text in third block</span>
 *             <br>
 *         </span>
 *     </p>
 *
 * will become:
 *
 *     <h1>
 *         <span>
 *             <span style="BOLD">Text from the text prop, e.g., a variable or an override</span>
 *             <br>
 *         </span>
 *     </h1>
 */
export function replaceDraftHTMLWithText(rawHTML, text) {
    // We're going to hell for parsing HTML with regex, but using a DOMParser
    // won't work during SSR...
    return rawHTML.replace(textContentRegex, (_, openingTags, inlineClosingTag, closingTags) => openingTags + text + inlineClosingTag + "<br>" + closingTags);
}
function convertVerticalAlignment(verticalAlignment) {
    switch (verticalAlignment) {
        case "top":
            return "flex-start";
        case "center":
            return "center";
        case "bottom":
            return "flex-end";
    }
}
function getTabIndexProps(tabIndex) {
    if (tabIndex === undefined)
        return {};
    return { tabIndex };
}
//# sourceMappingURL=Text.js.map