import { distance, interpolate, mix } from "framer-motion";
import React from "react";
import { CustomPropertiesContext } from "../presentation/CustomProperties.js";
import { ConvertColor } from "../types/Color/ConvertColor.js";
import { Rect } from "../types/Rect.js";
import { RenderTarget } from "../types/RenderEnvironment.js";
import { BoxShadow } from "../types/Shadow.js";
import { isFiniteNumber } from "../utils/isFiniteNumber.js";
import { roundedNumberString } from "../utils/roundedNumber.js";
export function shadowsAsFilter(shadows) {
    const filters = [];
    if (shadows && shadows.length) {
        const dropShadows = shadows.map((shadowItem) => {
            return `drop-shadow(${shadowItem.x}px ${shadowItem.y}px ${shadowItem.blur}px ${shadowItem.color})`;
        });
        filters.push(...dropShadows);
    }
    return filters;
}
export function collectTextShadowsForProps(props, style) {
    if (!props.shadows || props.shadows.length === 0)
        return;
    const textShadow = props.shadows
        .map((shadow) => {
        return `${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.color}`;
    })
        .join(", ");
    if (!textShadow)
        return;
    style.textShadow = textShadow;
}
export function collectBoxShadowsForProps(props, style) {
    if (!props.shadows || props.shadows.length === 0)
        return;
    const boxShadow = props.shadows.map((shadowItem) => BoxShadow.toCSS(shadowItem)).join(", ");
    if (!boxShadow)
        return;
    style.boxShadow = boxShadow;
}
/** @internal */
export function shadowForShape(boxShadows, rect, shapeId, fillAlpha, strokeAlpha, strokeWidth, strokeClipId, svgStrokeAttributes) {
    const definition = [];
    let outsetElement = null;
    let insetElement = null;
    const needsStrokeClip = false;
    const shadows = [];
    const insetShadows = [];
    const boxShadowsCount = boxShadows.length;
    // The canvas renderer relies on setting this class to show / hide shadows at different zoom levels
    const svgShadowClass = "svg-shadow";
    const svgShadowProps = RenderTarget.current() === RenderTarget.canvas ? { className: svgShadowClass } : {};
    for (const shadow of boxShadows) {
        shadow.inset ? insetShadows.push(shadow) : shadows.push(shadow);
    }
    if (shadows.length > 0) {
        shadows.reverse();
        const outsideShadowId = shapeId.add("_shadow_out");
        const normalizedFrame = Rect.atOrigin(rect);
        const shadowRects = [normalizedFrame];
        for (const shadow of shadows) {
            const shadowFrame = localShadowFrame(shadow, normalizedFrame, true);
            if (shadowFrame === null) {
                continue;
            }
            shadowRects.push(shadowFrame);
        }
        let maxBlur = 0;
        const filterElements = [];
        const mergeElements = [];
        for (let i = 0, il = shadows.length; i < il; i++) {
            const shadow = shadows[i];
            if (!shadow)
                continue;
            const shadowElements = outerShadowElements(shapeId, shadow, i);
            maxBlur = Math.max(maxBlur, shadow.blur);
            filterElements.push(shadowElements.filterElements);
            mergeElements.push(shadowElements.mergeElement);
        }
        let expandStrokeWidth = strokeWidth;
        if (!isFiniteNumber(expandStrokeWidth))
            expandStrokeWidth = 0;
        let miter = svgStrokeAttributes.strokeMiterlimit;
        if (!isFiniteNumber(miter))
            miter = 4;
        let shadowRect = Rect.merge(...shadowRects);
        shadowRect = Rect.inflate(shadowRect, ((expandStrokeWidth * miter) / 2 + maxBlur) * 1.1);
        // calculate percentage of shadow frame compared to node frame
        const width = rect.width + (strokeWidth ? strokeWidth / 2 : 0.1);
        const height = rect.height + (strokeWidth ? strokeWidth / 2 : 0.1);
        const filterX = (shadowRect.x / width) * 100;
        const filterY = (shadowRect.y / height) * 100;
        const filterWidth = (shadowRect.width / width) * 100;
        const filterHeight = (shadowRect.height / height) * 100;
        definition.push(React.createElement("filter", { key: outsideShadowId.id, id: outsideShadowId.id, x: `${filterX.toFixed(1)}%`, y: `${filterY.toFixed(1)}%`, width: `${filterWidth.toFixed(1)}%`, height: `${filterHeight.toFixed(1)}%`, filterUnits: "objectBoundingBox", ...svgShadowProps },
            filterElements,
            shadows.length > 1 ? React.createElement("feMerge", null, mergeElements) : null));
        outsetElement = (React.createElement("g", { filter: outsideShadowId.urlLink, ...svgShadowProps },
            React.createElement("use", { ...svgStrokeAttributes, fill: "black", fillOpacity: fillAlpha <= 0 ? 0 : 1, stroke: "black", strokeOpacity: strokeAlpha <= 0 ? 0 : 1, strokeWidth: strokeAlpha > 0 ? strokeWidth : 0, xlinkHref: shapeId.link, clipPath: strokeClipId.urlLink })));
    }
    if (insetShadows.length) {
        insetShadows.reverse();
        const insideShadowId = shapeId.add("_shadow_inside");
        const normalizedFrame = Rect.atOrigin(rect);
        const shadowFrames = [normalizedFrame];
        for (const shadow of insetShadows) {
            const shadowFrame = localShadowFrame(shadow, normalizedFrame, true);
            if (shadowFrame === null) {
                continue;
            }
            shadowFrames.push(shadowFrame);
        }
        const shadowRect = Rect.merge(...shadowFrames);
        // calculate percentage of shadow frame compared to node frame
        const width = rect.width + (strokeWidth ? strokeWidth / 2 : 0.1);
        const height = rect.height + (strokeWidth ? strokeWidth / 2 : 0.1);
        const filterX = (shadowRect.x / width) * 100;
        const filterY = (shadowRect.y / height) * 100;
        const filterWidth = (shadowRect.width / width) * 100;
        const filterHeight = (shadowRect.height / height) * 100;
        const filterElements = [];
        const mergeElements = [];
        for (let i = 0, il = insetShadows.length; i < il; i++) {
            const shadow = insetShadows[i];
            if (!shadow)
                continue;
            const shadowElements = innerShadowElements(shapeId, shadow, i);
            filterElements.push(shadowElements.filterElements);
            mergeElements.push(shadowElements.mergeElement);
        }
        definition.push(React.createElement("filter", { key: insideShadowId.id, id: insideShadowId.id, x: `${filterX.toFixed(1)}%`, y: `${filterY.toFixed(1)}%`, width: `${filterWidth.toFixed(1)}%`, height: `${filterHeight.toFixed(1)}%`, filterUnits: "objectBoundingBox", ...svgShadowProps },
            filterElements,
            insetShadows.length > 1 ? React.createElement("feMerge", null, mergeElements) : null));
        // if we rendered at lower resolution, we need a clip path ...
        let clipPath;
        if (needsStrokeClip) {
            clipPath = strokeClipId.urlLink;
        }
        insetElement = (React.createElement("use", { fill: "black", fillOpacity: "1", filter: insideShadowId.urlLink, xlinkHref: shapeId.link, clipPath: clipPath, ...svgShadowProps }));
    }
    return { definition, outsetElement, insetElement, needsStrokeClip };
}
function outerShadowElements(shapeID, shadow, index) {
    const shadowKey = shapeID.add("_outer_shadow" + index);
    const offsetResultId = shadowKey.add("offset").id;
    const blurResultId = shadowKey.add("blur").id;
    const matrixResultId = shadowKey.add("matrix").id;
    const filterElements = (React.createElement(OuterShadowFilterElements, { key: shadowKey.id + "-filters", shadow: shadow, blurId: blurResultId, offsetId: offsetResultId, matrixId: matrixResultId }));
    const mergeElement = React.createElement("feMergeNode", { key: shadowKey.id + "-merge", in: matrixResultId });
    return { filterElements, mergeElement };
}
const OuterShadowFilterElements = props => {
    const lookup = React.useContext(CustomPropertiesContext);
    const { shadow, blurId, offsetId, matrixId } = props;
    // We need to lookup the actual value for the color when dealing with CSS variables.
    // This needs to be extracted into an API provided to Library dependants via a context.
    let color = shadow.color;
    const result = lookup(color);
    if (result) {
        color = result;
    }
    const rgb = ConvertColor.toRgb(color);
    const r = roundedNumberString(rgb.r / 255, 3);
    const g = roundedNumberString(rgb.g / 255, 3);
    const b = roundedNumberString(rgb.b / 255, 3);
    const matrixValues = `0 0 0 0 ${r}   0 0 0 0 ${g}   0 0 0 0 ${b}  0 0 0 ${rgb.a} 0`;
    return (React.createElement(React.Fragment, null,
        React.createElement("feOffset", { dx: shadow.x, dy: shadow.y, in: "SourceAlpha", result: offsetId }),
        React.createElement("feGaussianBlur", { stdDeviation: shadow.blur / 2, in: offsetId, result: blurId }),
        React.createElement("feColorMatrix", { colorInterpolationFilters: "sRGB", values: matrixValues, type: "matrix", in: blurId, result: matrixId })));
};
function innerShadowElements(shapeID, shadow, index) {
    const shadowKey = shapeID.add("_inside_shadow" + index);
    const blurId = shadowKey.add("blur").id;
    const offsetId = shadowKey.add("offset").id;
    const compositeId = shadowKey.add("composite").id;
    const matrixId = shadowKey.add("matrix").id;
    const filterElements = (React.createElement(InnerShadowFilterElements, { key: shadowKey.id + "-filters", shadow: shadow, blurId: blurId, offsetId: offsetId, compositeId: compositeId, matrixId: matrixId }));
    const mergeElement = React.createElement("feMergeNode", { key: shadowKey.id + "-merge", in: matrixId });
    return { filterElements, mergeElement };
}
const InnerShadowFilterElements = props => {
    const lookup = React.useContext(CustomPropertiesContext);
    const { shadow, blurId, offsetId, compositeId, matrixId } = props;
    // We need to lookup the actual value for the color when dealing with CSS variables.
    // This needs to be extracted into an API provided to Library dependants via a context.
    let color = shadow.color;
    const result = lookup(color);
    if (result) {
        color = result;
    }
    const rgb = ConvertColor.toRgb(color);
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    const matrixValues = `0 0 0 0 ${r}   0 0 0 0 ${g}   0 0 0 0 ${b}  0 0 0 ${rgb.a} 0`;
    return (React.createElement(React.Fragment, null,
        React.createElement("feGaussianBlur", { stdDeviation: shadow.blur / 2, in: "SourceAlpha", result: blurId }),
        React.createElement("feOffset", { dx: shadow.x, dy: shadow.y, in: blurId, result: offsetId }),
        React.createElement("feComposite", { in: offsetId, in2: "SourceAlpha", operator: "arithmetic", k2: "-1", k3: "1", result: compositeId }),
        React.createElement("feColorMatrix", { colorInterpolationFilters: "sRGB", values: matrixValues, type: "matrix", in: compositeId, result: matrixId })));
};
export function calcMaxRealisticShadowBlur(distance, focus) {
    return interpolate([0, 0.5, 1], [distance * 5, distance, 0])(focus);
}
const maxSpread = 5;
export function calcRealisticShadowSpread(diffusion) {
    return mix(-maxSpread, 0, diffusion);
}
/** @internal */
export function localShadowFrame(shadow, frame, isSVG = false) {
    if (!isSVG && shadow["inset"])
        return null;
    let growth = shadow.blur;
    let minX;
    let maxX;
    let minY;
    let maxY;
    if (isSVG) {
        minX = -Math.abs(shadow.x) - growth;
        maxX = Math.abs(shadow.x) + frame.width + growth;
        minY = -Math.abs(shadow.y) - growth;
        maxY = Math.abs(shadow.y) + frame.height + growth;
    }
    else if (BoxShadow.is(shadow) && shadow.type === "realistic") {
        growth =
            calcMaxRealisticShadowBlur(distance(shadow.x, shadow.y), shadow.focus) +
                calcRealisticShadowSpread(shadow.diffusion);
        if (shadow.x >= 0) {
            minX = 0 - growth;
            maxX = shadow.x + frame.width + growth;
        }
        else {
            minX = shadow.x - growth;
            maxX = frame.width + growth;
        }
        if (shadow.y >= 0) {
            minY = 0 - growth;
            maxY = shadow.y + frame.height + growth;
        }
        else {
            minY = shadow.y - growth;
            maxY = frame.height + growth;
        }
    }
    else {
        growth += shadow.spread;
        minX = shadow.x - growth;
        maxX = shadow.x + frame.width + growth;
        minY = shadow.y - growth;
        maxY = shadow.y + frame.height + growth;
    }
    if (maxX <= minX || maxY <= minY)
        return null;
    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}
//# sourceMappingURL=shadow.js.map