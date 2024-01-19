import { motion } from "framer-motion";
import process from "process";
import React from "react";
import { InternalID } from "../../utils/internalId.js";
import { safeWindow } from "../../utils/safeWindow.js";
import { shadowForShape } from "../style/shadow.js";
import { toSVGPath } from "../traits/Path.js";
import { BackgroundImage } from "../types/BackgroundImage.js";
import { Color, ConvertColor } from "../types/Color/index.js";
import { LinearGradient, RadialGradient } from "../types/Gradient.js";
import { RenderEnvironment, RenderTarget } from "../types/RenderEnvironment.js";
import { svgElementAttributeDefaults } from "../types/svgElementAttributeDefaults.js";
import { transformValues } from "../utils/createTransformValues.js";
import { elementPropertiesForLinearGradient, elementPropertiesForRadialGradient, } from "../utils/elementPropertiesForGradient.js";
import { imagePatternPropsForFill } from "../utils/imagePatternPropsForFill.js";
import { transformString } from "../utils/transformString.js";
import { LinearGradientElement, RadialGradientElement } from "./GradientElement.js";
import { ImagePatternElement } from "./ImagePatternElement.js";
import { Layer } from "./Layer.js";
import { SVGRoot } from "./SVGRoot.js";
/**
 * @internal
 */
export const Vector = /* @__PURE__ */ (() => {
    return class VectorInner extends Layer {
        static defaultVectorProps = {
            isRootVectorNode: false,
            name: null,
            includeTransform: undefined,
            defaultFillColor: undefined,
            defaultStrokeColor: undefined,
            defaultStrokeWidth: undefined,
            defaultStrokeAlignment: "center",
            width: 100,
            height: 100,
            rotation: 0,
            rotate: undefined,
            frame: undefined,
            opacity: undefined,
            calculatedPath: [],
            d: undefined,
            shapeId: undefined,
            insideStroke: false,
            strokeEnabled: true,
            strokeClipId: undefined,
            strokeWidth: undefined,
            idAttribute: undefined,
            transition: undefined,
            shadows: [],
            strokeAlpha: 1,
            rect: { x: 0, y: 0, width: 0, height: 0 },
            lineCap: "butt",
            strokeColor: "#0AF",
            lineJoin: "miter",
            strokeMiterLimit: 4,
            strokeDashArray: "0",
            strokeDashOffset: 0,
            fill: "rgba(0,170,255,0.5)",
        };
        static defaultProps = {
            ...Layer.defaultProps,
            ...VectorInner.defaultVectorProps,
        };
        render() {
            if (process.env.NODE_ENV !== "production" && safeWindow["perf"])
                safeWindow["perf"].nodeRender();
            const { opacity, calculatedPath, d, insideStroke, shapeId, strokeEnabled, strokeClipId, strokeWidth, idAttribute, rect, shadows, strokeAlpha, name, includeTransform, isRootVectorNode, rotation, id, lineCap, lineJoin, strokeColor, strokeMiterLimit, strokeDashArray, strokeDashOffset, fill, variants, transition, } = this.props;
            // invisible shapes will result in these not being set, and should not be rendered
            if (!id || !shapeId || !strokeClipId)
                return null;
            const rotate = this.props.rotate ?? rotation ?? 0;
            const { target } = RenderEnvironment;
            /**
             * @TODO For Vectors to animate smoothly in Generated Components, we
             * need to reconsider how we set this transform. This transform needs to
             * be set on changes for the image fill to update, but also used in an
             * `initial` prop, and set by `variants` so that rotation animates. We
             * also have to consider canvas performance.
             */
            const transform = transformValues(rect, rotate, isRootVectorNode, includeTransform);
            let vectorFill;
            let fillAlpha = 0;
            let imagePattern;
            let linearGradient;
            let radialGradient;
            if (typeof fill === "string" || Color.isColorObject(fill)) {
                const fillColor = Color.isColorObject(fill) ? fill.initialValue || Color.toRgbString(fill) : fill;
                if (fillColor !== "transparent") {
                    vectorFill = fillColor;
                    fillAlpha = ConvertColor.getAlpha(vectorFill);
                }
            }
            else if (LinearGradient.isLinearGradient(fill)) {
                linearGradient = elementPropertiesForLinearGradient(fill, id);
                vectorFill = `url(#${linearGradient.id})`;
                fillAlpha = 1;
            }
            else if (RadialGradient.isRadialGradient(fill)) {
                radialGradient = elementPropertiesForRadialGradient(fill, id);
                vectorFill = `url(#${radialGradient.id})`;
                fillAlpha = 1;
            }
            else if (BackgroundImage.isImageObject(fill)) {
                imagePattern = imagePatternPropsForFill(fill, transform, id);
                if (imagePattern) {
                    vectorFill = `url(#${imagePattern.id})`;
                    fillAlpha = 1;
                }
            }
            if (vectorFill === svgElementAttributeDefaults.fill) {
                vectorFill = undefined;
            }
            if (vectorFill === undefined) {
                vectorFill = "transparent";
            }
            const fillEnabled = vectorFill !== undefined && vectorFill !== "transparent" && fillAlpha !== 0;
            // If both fill and stroke are disabled, pretend there’s a fill for the shadow
            if (!fillEnabled && !strokeEnabled) {
                fillAlpha = 1;
            }
            let mainElement;
            let strokeClipPath = null;
            let shapeReference = null;
            let strokeElement = null;
            let pathTranslate;
            let elementTransform;
            const translatePaths = target === RenderTarget.export;
            if (transform.rotation === 0 && translatePaths) {
                pathTranslate = transform;
            }
            else {
                pathTranslate = { x: 0, y: 0 };
                elementTransform = transformString(transform);
            }
            const pathAttributes = {
                d: d ?? toSVGPath(calculatedPath, pathTranslate, target),
                transform: elementTransform,
            };
            // When used from the Preview, we need to revive BoxShadow instances:
            const svgStrokeAttributes = {};
            if (strokeEnabled && strokeWidth !== 0) {
                svgStrokeAttributes.strokeWidth = strokeWidth;
                svgStrokeAttributes.stroke = strokeColor;
                svgStrokeAttributes.strokeLinecap = lineCap;
                svgStrokeAttributes.strokeLinejoin = lineJoin;
                if (lineJoin === "miter") {
                    svgStrokeAttributes.strokeMiterlimit = strokeMiterLimit;
                }
                svgStrokeAttributes.strokeDasharray = strokeDashArray;
                if (strokeDashOffset !== 0) {
                    svgStrokeAttributes.strokeDashoffset = strokeDashOffset;
                }
            }
            for (const key in svgElementAttributeDefaults) {
                if (svgStrokeAttributes[key] === svgElementAttributeDefaults[key]) {
                    svgStrokeAttributes[key] = undefined;
                }
            }
            const internalShapeId = InternalID.forKey(shapeId);
            const internalStrokeClipId = InternalID.forKey(strokeClipId);
            const shadow = shadowForShape(shadows, rect, internalShapeId, fillAlpha, strokeAlpha, strokeWidth, internalStrokeClipId, svgStrokeAttributes);
            const currentName = target === RenderTarget.preview ? name || undefined : undefined;
            if (shadow.insetElement !== null || shadow.outsetElement !== null || insideStroke) {
                pathAttributes.id = internalShapeId.id;
                shapeReference = React.createElement(motion.path, { ...{ ...pathAttributes }, variants: variants, transition: transition });
                if (shadow.needsStrokeClip || insideStroke) {
                    strokeClipPath = (React.createElement("clipPath", { id: internalStrokeClipId.id },
                        React.createElement("use", { xlinkHref: internalShapeId.link })));
                }
                if (shadow.insetElement !== null && strokeEnabled && strokeWidth && strokeWidth > 0) {
                    mainElement = (React.createElement("use", { xlinkHref: internalShapeId.link, fill: vectorFill, strokeOpacity: "0", name: currentName }));
                    strokeElement = (React.createElement("use", { xlinkHref: internalShapeId.link, clipPath: internalStrokeClipId.urlLink, fill: "transparent", ...svgStrokeAttributes, strokeWidth: strokeWidth }));
                }
                else {
                    mainElement = (React.createElement("use", { xlinkHref: internalShapeId.link, fill: vectorFill, clipPath: internalStrokeClipId.urlLink, ...svgStrokeAttributes, strokeWidth: strokeWidth, name: currentName }));
                }
            }
            else {
                pathAttributes.id = idAttribute;
                mainElement = (React.createElement(motion.path, { ...{
                        ...pathAttributes,
                        fill: vectorFill,
                        ...svgStrokeAttributes,
                    }, name: currentName, variants: variants, transition: transition }));
            }
            const imagePatternElement = imagePattern ? React.createElement(ImagePatternElement, { ...imagePattern }) : undefined;
            let gradient;
            if (linearGradient) {
                gradient = React.createElement(LinearGradientElement, { ...linearGradient });
            }
            else if (radialGradient) {
                gradient = React.createElement(RadialGradientElement, { ...radialGradient });
            }
            let defs = null;
            if (shapeReference ||
                strokeClipPath ||
                (shadow.definition && shadow.definition.length) ||
                gradient ||
                imagePatternElement) {
                defs = (React.createElement("defs", null,
                    shapeReference,
                    strokeClipPath,
                    shadow.definition,
                    gradient,
                    imagePatternElement));
            }
            // Generated Components with variants require a default value to animate to/from.
            const opacityValue = opacity ?? (variants ? 1 : undefined);
            if (defs === null &&
                shadow.outsetElement === null &&
                shadow.insetElement === null &&
                strokeElement === null) {
                // Render the mainElement with opacity
                mainElement = (React.createElement(motion.path, { ...{
                        ...pathAttributes,
                        fill: vectorFill,
                        ...svgStrokeAttributes,
                    }, opacity: opacityValue, variants: variants, transition: transition, name: currentName }));
                // Don't group the main element if not needed:
                return this.renderElement(mainElement);
            }
            else {
                return this.renderElement(React.createElement(motion.g, { opacity: opacityValue, variants: variants, transition: transition },
                    defs,
                    shadow.outsetElement,
                    mainElement,
                    shadow.insetElement,
                    strokeElement));
            }
        }
        renderElement(element) {
            const { isRootVectorNode, width, height, rect, willChangeTransform, includeTransform } = this.props;
            const frame = this.props.frame ?? rect ?? { x: 0, y: 0, width: 100, height: 100 };
            if (!isRootVectorNode)
                return element;
            if (includeTransform)
                return element;
            /**
             * @TODO For generated components, this <svg> wrapper needs to become a
             * <motion.svg> and animate it's changes to width/height with layout,
             * and translate x & y with variants.
             */
            return (React.createElement(SVGRoot, { frame: frame, width: width, height: height, willChangeTransform: willChangeTransform, innerRef: this.setLayerElement }, element));
        }
    };
})();
//# sourceMappingURL=Vector.js.map