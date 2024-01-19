import type { MotionStyle, MotionValue } from "framer-motion";
import type { BackgroundImage } from "../types/BackgroundImage.js";
import { Animatable } from "../../animation/Animatable/Animatable.js";
import { Color } from "../types/Color/Color.js";
import { Gradient } from "../types/Gradient.js";
/** @public */
export type Background = Color | Gradient | BackgroundImage | MotionValue<string> | string;
export interface DeprecatedBackgroundProperties {
    background: Animatable<Background> | Background | null;
    /**
     * @internal
     */
    backgroundColor: string | Color;
}
/** @public */
export interface BackgroundProperties {
    /**
     * Set the background of a `Frame`. Supports color strings, color objects and images by using `src`. Set to a semi-transparent blue color by default.
     * This will override the values set by the `image` property. To use a color and a image, use `backgroundColor` instead
     * ```jsx
     * <Frame background="#09F"/>
     * <Frame background={Color({r: 255, g: 0, b: 102})} />
     * <Frame background={{ alpha: 1, angle: 75, start: "#09F", end: "#F09"}} />
     * <Frame background={{ src: "https://example.com/logo.png"}} />
     * ```
     * @public
     */
    background: Background | null;
    /**
     * Set the background color of a `Frame`. Supports color strings and objects. Use this property to set a background color alongside the `image` property.
     * ```jsx
     * <Frame backgroundColor="#09F"/>
     * <Frame backgroundColor={Color({r: 255, g: 0, b: 102})} />
     * ```
     * @public
     */
    backgroundColor: string | Color;
    /**
     * Sets a background image of a `Frame`. Will wrap the passed value in a `url('')` if needed.
     * @remarks
     * ```jsx
     * <Frame image="https://source.unsplash.com/random" />
     * ```
     * @public
     */
    image: string;
}
export declare function collectBackgroundFromProps({ background, backgroundColor }: Partial<DeprecatedBackgroundProperties | BackgroundProperties>, style: MotionStyle): void;
//# sourceMappingURL=Background.d.ts.map