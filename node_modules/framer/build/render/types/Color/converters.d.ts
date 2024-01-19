import { ColorHSL, ColorHSV, ColorRGB, ColorRGBA, ColorTypeHSLA, ColorTypeHSVA, ColorTypeRGBA } from "./types.js";
export declare function rgbToHsluv(r: number, g: number, b: number): ColorHSL;
export declare function rgbaFromHusl(h: number, s: number, l: number, a?: number): ColorRGBA;
export declare function hsvToStr(h: number, s: number, v: number, a?: number): string;
export declare function rgbToRgb(r: number, g: number, b: number): ColorRGB;
export declare function rgbToHex(r: number, g: number, b: number, allow3Char: boolean): string;
export declare function rgbToHsl(r: number | string, g: number | string, b: number | string): ColorHSL;
export declare function hslToRgb(h: number, s: number, l: number): ColorRGB;
export declare function rgbToHsv(r: number, g: number, b: number): ColorHSV;
export declare function hsvToRgb(h: number, s: number, v: number): ColorRGB;
export declare function stringToObject(inputColor: string): ColorTypeRGBA | ColorTypeHSLA | ColorTypeHSVA | false;
//# sourceMappingURL=converters.d.ts.map