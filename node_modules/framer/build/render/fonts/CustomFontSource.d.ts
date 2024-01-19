import { Asset, Font, FontSource, ReadonlyFont, ReadonlyTypeface, Typeface, TypefaceLocator, TypefaceSourceNames } from "./types.js";
export declare const customFontSelectorPrefix = "CUSTOM;";
/** @internal */
export declare class CustomFontSource implements FontSource {
    readonly name: TypefaceSourceNames;
    private typefaces;
    private byFamily;
    assetsByFamily: Map<string, Asset>;
    importFonts(assets: readonly Asset[]): Font[];
    private isValidCustomFontAsset;
    inferVariantName(family: string): string;
    createTypeface(family: string): Typeface;
    private addTypeface;
    parseSelector(selector: string): TypefaceLocator | null;
    getFontBySelector(selector: string, createFont?: boolean): ReadonlyFont | undefined;
    getTypefaceByFamily(family: string): ReadonlyTypeface;
}
//# sourceMappingURL=CustomFontSource.d.ts.map