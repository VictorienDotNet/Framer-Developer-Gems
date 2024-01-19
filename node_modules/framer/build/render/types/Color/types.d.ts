/** @public */
export declare enum ColorFormat {
    RGB = "rgb",
    HSL = "hsl",
    HSV = "hsv",
    HEX = "hex",
    NAME = "name"
}
export interface ColorRGB {
    r: number;
    g: number;
    b: number;
}
/** @public */
export type ColorRGBA = ColorRGB & {
    a: number;
};
/** @public */
export type ColorTypeRGBA = ColorRGBA & {
    format: ColorFormat;
};
/** @public */
export interface ColorHSL {
    h: number;
    s: number;
    l: number;
}
/** @public */
export type ColorHSLA = ColorHSL & {
    a: number;
};
export type ColorTypeHSLA = ColorHSLA & {
    format: ColorFormat;
};
/** @public */
export interface ColorHSV {
    h: number;
    s: number;
    v: number;
}
/** @public */
export type ColorHSVA = ColorHSV & {
    a: number;
};
export type ColorTypeHSVA = ColorHSVA & {
    format: ColorFormat;
};
export interface CompleteColor {
    format: ColorFormat;
    r: number;
    g: number;
    b: number;
    h: number;
    s: number;
    l: number;
    a: number;
}
/** @public */
export type IncomingColor = ColorRGB | ColorHSL | ColorRGBA | ColorHSLA | string;
/**
 * Various Color functions, such as {@link (Color:namespace).mix} and {@link
 * (Color:namespace).interpolate}, take an optional color model that
 * determines how two colors are mixed together.
 *
 * @remarks
 *
 * ```javascript
 * const newColor = Color.mix(Color("red"), Color("blue"), {model: ColorMixModelType.HSL})
 * ```
 *
 * @public
 */
export declare enum ColorMixModelType {
    /**
     * Use the {@link https://en.wikipedia.org/wiki/RGB_color_model | RGB color space} without an alpha value
     *
     * @remarks
     *
     * ```javascript
     * const newColor = Color.mix(Color("red"), Color("blue"), {model: ColorMixModelType.RGB})
     * ```
     *
     * @public
     */
    RGB = "rgb",
    /**
     * Use the {@link https://en.wikipedia.org/wiki/RGB_color_model | RGB color space} color space with an alpha value
     *
     * @remarks
     *
     * ```javascript
     * const newColor = Color.mix(Color("red"), Color("blue"), {model: ColorMixModelType.RGBA})
     * ```
     *
     * @public
     */
    RGBA = "rgba",
    /**
     * Use the {@link https://en.wikipedia.org/wiki/HSL_and_HSV | HSL} color space with an alpha value
     *
     * @remarks
     *
     * ```javascript
     * const newColor = Color.mix(Color("red"), Color("blue"), {model: ColorMixModelType.HSL})
     * ```
     *
     * @public
     */
    HSL = "hsl",
    /**
     * Use the {@link https://en.wikipedia.org/wiki/HSL_and_HSV | HSL} color space with an alpha value
     *
     * @remarks
     *
     * ```javascript
     * const newColor = Color.mix(Color("red"), Color("blue"), {model: ColorMixModelType.HSLA})
     * ```
     *
     * @public
     */
    HSLA = "hsla",
    /**
     * Use the {@link http://www.hsluv.org | HSLuv } human friendly color model
     *
     * @remarks
     *
     * ```javascript
     * const newColor = Color.mix(Color("red"), Color("blue"), {model: ColorMixModelType.HUSL})
     * ```
     *
     * @public
     */
    HUSL = "husl"
}
//# sourceMappingURL=types.d.ts.map