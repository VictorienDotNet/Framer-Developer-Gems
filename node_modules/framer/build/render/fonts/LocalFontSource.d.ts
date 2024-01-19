import { Font, FontSource, ReadonlyTypeface, Typeface, TypefaceSourceName } from "./types.js";
/** @internal */
export declare const systemTypefaceName = "System Default";
/** @internal */
export declare class LocalFontSource implements FontSource {
    readonly name: TypefaceSourceName;
    private typefaces;
    private byFamily;
    private typefaceAliasBySelector;
    private typefaceAliases;
    getTypefaceByFamily(family: string): ReadonlyTypeface | null;
    createTypeface(family: string): Typeface;
    private addTypeface;
    importFonts(): Font[];
    interTypefaceSelectors: Set<string>;
    private importInterTypeface;
    private addTypefaceAlias;
    private getSystemTypeface;
    getTypefaceAliasBySelector(selector: string): string | null;
    getTypefaceSelectorByAlias(alias: string): string | null;
    /** Typeface aliases are in the format of `__Alias-Name__` */
    isTypefaceAlias(value: string): boolean;
    /**
     * Use 'Inter' web font as System Default fonts on Mac with Chrome v81 v82
     * https://github.com/framer/company/issues/17277
     * https://bugs.chromium.org/p/chromium/issues/detail?id=1057654
     */
    private workaroundChrome81and82;
}
//# sourceMappingURL=LocalFontSource.d.ts.map