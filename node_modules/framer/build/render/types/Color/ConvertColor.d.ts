import type { ColorHSL, ColorHSLA, ColorHSV, ColorHSVA, ColorRGB, ColorRGBA } from "./types.js";
import { Color } from "./Color.js";
/**
 * @internal
 */
export declare const ConvertColor: {
    hueRotate: (color: string, angle: number) => string;
    setAlpha: (color: string, alpha: number) => string;
    getAlpha: (color: string) => number;
    multiplyAlpha: (color: string, alpha: number) => string;
    toHex: (color: string) => string;
    toRgb: (color: string) => ColorRGBA;
    toRgbString: (color: string) => string;
    toHSV: (color: string) => ColorHSVA;
    toHSL: (color: string) => ColorHSLA;
    toHslString: (color: string) => string;
    toHsvString: (color: string) => string;
    hsvToHSLString: (hsv: ColorHSV | ColorHSVA) => string;
    hsvToString: (hsv: ColorHSV | ColorHSVA) => string;
    rgbaToString: (color: ColorRGB | ColorRGBA) => string;
    hslToString: (hsl: ColorHSL | ColorHSLA) => string;
    toColorPickerSquare: (h: number) => string;
    isValid: (color: string) => boolean;
    equals: (a: Color | string, b: Color | string) => boolean;
    toHexOrRgbaString: (input: string) => string;
};
//# sourceMappingURL=ConvertColor.d.ts.map