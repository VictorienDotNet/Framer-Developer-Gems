/// <reference types="google.fonts" />
import { Font, FontSource, FontVariant, ReadonlyTypeface, TypefaceSourceName, WebFontLocator } from "./types.js";
export declare const googleFontSelectorPrefix = "GF;";
/** @internal */
export declare class GoogleFontSource implements FontSource {
    readonly name: TypefaceSourceName;
    private typefaces;
    private byFamily;
    getTypefaceByFamily(family: string): ReadonlyTypeface | null;
    static parseVariant(variant: string): FontVariant | null;
    parseSelector(selector: string): WebFontLocator | null;
    static createSelector(family: string, variant: string): string;
    private addTypeface;
    importFonts(webFonts: google.fonts.WebfontFamily[]): Font[];
}
//# sourceMappingURL=GoogleFontSource.d.ts.map