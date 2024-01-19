// Used for inspection
/** @public */
export var ColorFormat;
(function (ColorFormat) {
    ColorFormat["RGB"] = "rgb";
    ColorFormat["HSL"] = "hsl";
    ColorFormat["HSV"] = "hsv";
    ColorFormat["HEX"] = "hex";
    ColorFormat["NAME"] = "name";
})(ColorFormat || (ColorFormat = {}));
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
export var ColorMixModelType;
(function (ColorMixModelType) {
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
    ColorMixModelType["RGB"] = "rgb";
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
    ColorMixModelType["RGBA"] = "rgba";
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
    ColorMixModelType["HSL"] = "hsl";
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
    ColorMixModelType["HSLA"] = "hsla";
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
    ColorMixModelType["HUSL"] = "husl";
})(ColorMixModelType || (ColorMixModelType = {}));
//# sourceMappingURL=types.js.map