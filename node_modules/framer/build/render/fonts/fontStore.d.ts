/// <reference types="google.fonts" />
import { CustomFontSource } from "./CustomFontSource.js";
import { FontshareFont, FontshareSource } from "./FontshareSource.js";
import { GoogleFontSource } from "./GoogleFontSource.js";
import { LocalFontSource } from "./LocalFontSource.js";
import { Asset, DraftFontProperties, ReadonlyFont, ReadonlyTypeface, TypefaceLocator } from "./types.js";
/**
 * Used to differentiate between requests that are immediately fulfilled,
 * because the font was already loaded, and those that resulted in a newly
 * loaded font
 *
 * @internal
 */
export declare enum LoadFontResult {
    AlreadyLoaded = 0,
    Loaded = 1
}
/**
 * Stores all available fonts, whether they are currently loaded or not
 * Provides APIs to import, add and resolve fonts and font selectors
 * Model:
 * `FontStore` (single instance available via `fontStore`)
 *   `FontSource` (local/google)
 *     `Typeface` (font family and its variants)
 *       `Font` (font family with a specific variant)
 * Every `Font` has a `selector` (string), which is a unique identifier of a font
 * Google web fonts provide consistent naming for fonts,
 * so it's also possible to `parseFontSelector()` and get some info about a web font from only its selector
 *
 * @internal
 */
export declare class FontStore {
    /**
     * Enabling the `FontStore` will make Text components automatically load
     * their fonts on render. Otherwise font loading is the responsibility of
     * the environment.
     */
    enabled: boolean;
    private bySelector;
    private getGoogleFontsListPromise;
    private getFontshareFontsListPromise;
    private loadedSelectors;
    private googleFamilyNames;
    defaultFont: ReadonlyFont;
    constructor();
    local: LocalFontSource;
    google: GoogleFontSource;
    fontshare: FontshareSource;
    custom: CustomFontSource;
    private addFont;
    getAvailableFonts(): ReadonlyFont[];
    private importLocalFonts;
    importGoogleFonts(): Promise<google.fonts.WebfontFamily[]>;
    importFontshareFonts(): Promise<FontshareFont[]>;
    importCustomFonts(assets: readonly Asset[]): void;
    getTypeface(info: TypefaceLocator): ReadonlyTypeface | null;
    getFontBySelector(selector: string, createFont?: boolean): ReadonlyFont | undefined;
    getDraftPropertiesBySelector(selector: string): DraftFontProperties | null;
    isSelectorLoaded(selector: string): boolean;
    /**
     * Load a single font
     * */
    private loadFont;
    loadWebFontsFromSelectors(selectors: string[]): Promise<PromiseSettledResult<LoadFontResult>[]>;
    loadMissingFonts(fontSelectors: readonly string[], fontsLoadedCallback?: () => void): Promise<void>;
}
/** @internal */
export declare const fontStore: FontStore;
//# sourceMappingURL=fontStore.d.ts.map