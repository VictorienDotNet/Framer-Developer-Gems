import { isFramerX, isSafari, isTest } from "../../utils/environment.js";
import { RenderTarget } from "../types/RenderEnvironment.js";
/**
 * This file contains a bunch of helpers to force browser to render elements
 * with layer backing (GPU accelleration)
 */
/**
 * The string in this smallValue is very specifically "0.000001px".
 *
 * - Safari before Catalina will change 1e-7 into 0.0000001px
 * - Safari in Catalina will change 0.0000001px into 1e-7
 *
 * So this value should be "0.000001px" (1e-6) and not smaller, because
 * otherwise it will break the string replacement for removing the translateZ
 * hack.
 */
const smallValue = "0.000001px";
export const translateZ = ` translateZ(${smallValue})`;
// We only apply this hack on the canvas and in Safari or FramerX
const useTranslateZHack = isFramerX() || isSafari() || isTest();
/**
 * Forces layer backing during rendering with a motion style
 */
export function forceLayerBackingWithMotionStyle(motionStyle) {
    // This forces 3d acceleration on Chrome
    motionStyle.willChange = "transform";
    // We only want to use the translateZ hack on the canvas
    const onCanvas = RenderTarget.current() === RenderTarget.canvas;
    if (useTranslateZHack && onCanvas) {
        motionStyle.translateZ = smallValue;
    }
}
/**
 * Forces layer backing during rendering with React's CSS properties
 *
 * @internal
 */
export function forceLayerBackingWithCSSProperties(cssProperties) {
    // This forces 3d acceleration on Chrome
    cssProperties.willChange = "transform";
    setTranslateZHack(cssProperties, true);
}
/**
 * Forces layer backing by changing the style of an HTML Element that is already
 * rendered to the DOM
 * @param element The HTML element to force the layer backing on
 * @param enabled Whether to enable forced layer backing. If `true` the styles
 * will be modified to force layer backing. If `false` those styles will be
 * removed from the element
 */
export function forceLayerBackingOnElement(element, enabled) {
    if (enabled) {
        const willChange = element.style.willChange || "";
        if (willChange !== "transform") {
            // This forces 3d acceleration on Chrome
            element.style.willChange = "transform";
        }
    }
    else {
        element.style.removeProperty("will-change");
    }
    setTranslateZHack(element.style, enabled);
}
/**
 * Within Safari we can force gpu layers (avoid dumping them) by adding a small
 * translateZ value:
 * https://github.com/WebKit/webkit/blob/6ddbf54e861f9df5e0171422c32cc6173120f717/LayoutTests/compositing/layer-creation/compositing-policy.html#L23
 * So to prevent this memory heuristic to trigger, we also rig those layers with
 * a tiny translateZ property.
 */
function setTranslateZHack(style, enabled) {
    const onCanvas = RenderTarget.current() === RenderTarget.canvas;
    if (!useTranslateZHack || !onCanvas) {
        // We only want to use the translateZ hack in Safari and FramerX on the canvas
        return;
    }
    const transform = style.transform || "";
    if (enabled) {
        const hasTranslateZ = transform.includes(translateZ);
        if (!hasTranslateZ) {
            style.transform = transform + translateZ;
        }
    }
    else {
        style.transform = transform.replace(translateZ, "");
    }
}
//# sourceMappingURL=setLayerBacked.js.map