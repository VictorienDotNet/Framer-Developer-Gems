import type { MotionStyle } from "framer-motion";
/** @public */
export interface BlendingProperties {
    blendingMode: BlendingMode;
}
/** @public */
export type BlendingMode = "normal" | "multiply" | "screen" | "overlay" | "darken" | "lighten" | "color-dodge" | "color-burn" | "hard-light" | "soft-light" | "difference" | "exclusion" | "hue" | "saturation" | "color" | "luminosity";
/** @internal */
export declare function collectBlendingFromProps(node: Partial<BlendingProperties>, style: MotionStyle): void;
//# sourceMappingURL=Blending.d.ts.map