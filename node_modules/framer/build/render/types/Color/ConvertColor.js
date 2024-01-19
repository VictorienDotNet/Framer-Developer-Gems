import { Color } from "./Color.js";
import { hsvToStr, stringToObject } from "./converters.js";
/**
 * @internal
 */
export const ConvertColor = {
    hueRotate: (color, angle) => {
        return Color.toHslString(Color.hueRotate(Color(color), angle));
    },
    setAlpha: (color, alpha) => {
        return Color.toRgbString(Color.alpha(Color(color), alpha));
    },
    getAlpha: (color) => {
        const obj = stringToObject(color);
        return obj ? obj.a : 1;
    },
    multiplyAlpha: (color, alpha) => {
        return Color.toRgbString(Color.multiplyAlpha(Color(color), alpha));
    },
    toHex: (color) => {
        return Color.toHexString(Color(color)).toUpperCase();
    },
    toRgb: (color) => {
        return Color.toRgb(Color(color));
    },
    toRgbString: (color) => {
        return Color.toRgbString(Color(color));
    },
    toHSV: (color) => {
        return Color.toHsv(Color(color));
    },
    toHSL: (color) => {
        return Color.toHsl(Color(color));
    },
    toHslString: (color) => {
        return Color.toHslString(Color(color));
    },
    toHsvString: (color) => {
        return Color.toHsvString(Color(color));
    },
    hsvToHSLString: (hsv) => {
        return Color.toHslString(Color(hsvToStr(hsv.h, hsv.s, hsv.v, hsv.a)));
    },
    hsvToString: (hsv) => {
        return hsvToStr(hsv.h, hsv.s, hsv.v);
    },
    rgbaToString: (color) => {
        return Color.toRgbString(Color(color));
    },
    hslToString: (hsl) => {
        return Color.toRgbString(Color(hsl));
    },
    toColorPickerSquare: (h) => {
        return Color.toRgbString(Color({ h, s: 1, l: 0.5, a: 1 }));
    },
    isValid: (color) => {
        return Color(color).isValid !== false;
    },
    equals: (a, b) => {
        if (typeof a === "string") {
            a = Color(a);
        }
        if (typeof b === "string") {
            b = Color(b);
        }
        return Color.equal(a, b);
    },
    toHexOrRgbaString: (input) => {
        const color = Color(input);
        return color.a !== 1 ? Color.toRgbString(color) : Color.toHexString(color);
    },
};
//# sourceMappingURL=ConvertColor.js.map