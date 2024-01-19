import { Font, FontSource, FontVariant, ReadonlyTypeface, TypefaceSourceName, WebFontLocator } from "./types.js";
export declare const fontsharePrefix = "FS;";
/** @internal */
export interface FontshareAxes {
    id: string;
    name: string;
    property: string;
    range_default: number;
    range_left: number;
    range_right: number;
}
/** @internal */
export interface FontshareStyle {
    id: string;
    name: string;
    file: string;
    is_variable: boolean;
}
/** @internal */
export interface FontshareFont {
    id: string;
    name: string;
    is_variable: boolean;
    font_styles: FontshareStyle[];
    font_axes: FontshareAxes[];
}
/** @internal */
export interface FontshareFonts {
    fonts: FontshareFont[];
}
/** @internal */
export declare class FontshareSource implements FontSource {
    readonly name: TypefaceSourceName;
    private typefaces;
    private byFamily;
    getTypefaceByFamily(family: string): ReadonlyTypeface | null;
    /**
     * Parses variant a string into a weight number and style, defaulting to a
     * weight of `400` and/or a style of `"normal"` depending on what isn't
     * present in the variant string.
     *
     * E.g:
     *   - `"bold"` becomes `{ weight: 700, style: "normal" }`
     *   - `"bold italic"` becomes `{ weight: 700, style: "italic" }`
     *   - `"italic"` becomes `{ weight: 400, style: "italic" }`
     */
    static parseVariant(variant: string): FontVariant | null;
    parseSelector(selector: string): WebFontLocator | null;
    static createSelector(family: string, variant: string): string;
    private addTypeface;
    importFonts(fontshareFonts: FontshareFont[]): Font[];
}
//# sourceMappingURL=FontshareSource.d.ts.map