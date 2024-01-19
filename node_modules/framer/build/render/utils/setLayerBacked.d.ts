import type { MotionStyle } from "framer-motion";
import type { CSSProperties } from "react";
export declare const translateZ: string;
/**
 * Forces layer backing during rendering with a motion style
 */
export declare function forceLayerBackingWithMotionStyle(motionStyle: MotionStyle): void;
/**
 * Forces layer backing during rendering with React's CSS properties
 *
 * @internal
 */
export declare function forceLayerBackingWithCSSProperties(cssProperties: CSSProperties): void;
/**
 * Forces layer backing by changing the style of an HTML Element that is already
 * rendered to the DOM
 * @param element The HTML element to force the layer backing on
 * @param enabled Whether to enable forced layer backing. If `true` the styles
 * will be modified to force layer backing. If `false` those styles will be
 * removed from the element
 */
export declare function forceLayerBackingOnElement(element: HTMLElement, enabled: boolean): void;
//# sourceMappingURL=setLayerBacked.d.ts.map