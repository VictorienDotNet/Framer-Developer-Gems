import process from "process";
import { assert } from "../../utils/assert.js";
import { runtime } from "../../utils/runtimeInjection.js";
import { warnOnce } from "../../utils/warnOnce.js";
import { customFontSelectorPrefix, CustomFontSource } from "./CustomFontSource.js";
import { fontsharePrefix, FontshareSource } from "./FontshareSource.js";
import { googleFontSelectorPrefix, GoogleFontSource } from "./GoogleFontSource.js";
import { isFontReady, loadFont } from "./loadFont.js";
import { LocalFontSource } from "./LocalFontSource.js";
import { TypefaceSourceNames, } from "./types.js";
/**
 * Used to differentiate between requests that are immediately fulfilled,
 * because the font was already loaded, and those that resulted in a newly
 * loaded font
 *
 * @internal
 */
export var LoadFontResult;
(function (LoadFontResult) {
    LoadFontResult[LoadFontResult["AlreadyLoaded"] = 0] = "AlreadyLoaded";
    LoadFontResult[LoadFontResult["Loaded"] = 1] = "Loaded";
})(LoadFontResult || (LoadFontResult = {}));
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
export class FontStore {
    /**
     * Enabling the `FontStore` will make Text components automatically load
     * their fonts on render. Otherwise font loading is the responsibility of
     * the environment.
     */
    enabled = false;
    bySelector = new Map();
    getGoogleFontsListPromise;
    getFontshareFontsListPromise;
    loadedSelectors = new Set();
    googleFamilyNames = new Set();
    defaultFont;
    constructor() {
        this.local = new LocalFontSource();
        this.google = new GoogleFontSource();
        this.fontshare = new FontshareSource();
        this.custom = new CustomFontSource();
        this.bySelector = new Map();
        this.importLocalFonts();
        const defaultFont = this.getFontBySelector("Inter");
        assert(defaultFont, "Can’t find Inter font");
        this.defaultFont = defaultFont;
    }
    local;
    google;
    fontshare;
    custom;
    addFont(font) {
        this.bySelector.set(font.selector, font);
    }
    getAvailableFonts() {
        return Array.from(this.bySelector.values());
    }
    importLocalFonts() {
        this.local.importFonts().forEach(font => {
            this.addFont(font);
            // Immediately “load” fonts (as they require no real loading, except Inter)
            if (!this.local.interTypefaceSelectors.has(font.selector)) {
                this.loadFont(font);
            }
        });
    }
    async importGoogleFonts() {
        if (!this.getGoogleFontsListPromise) {
            this.getGoogleFontsListPromise = runtime.fetchGoogleFontsList();
            const googleFonts = await this.getGoogleFontsListPromise;
            this.google.importFonts(googleFonts).forEach(font => {
                this.googleFamilyNames.add(font.typeface.family.toLowerCase());
                this.addFont(font);
            });
        }
        return this.getGoogleFontsListPromise;
    }
    async importFontshareFonts() {
        if (!this.getFontshareFontsListPromise) {
            this.getFontshareFontsListPromise = runtime.fetchFontshareFontsList();
            const fontshareFonts = await this.getFontshareFontsListPromise;
            this.fontshare.importFonts(fontshareFonts).forEach(font => {
                if (!this.googleFamilyNames.has(font.typeface.family.toLowerCase())) {
                    this.addFont(font);
                }
            });
        }
        return this.getFontshareFontsListPromise;
    }
    importCustomFonts(assets) {
        // Clear custom fonts from the list as they might have been deleted from assets
        this.bySelector.forEach((_, key) => {
            if (key.startsWith(customFontSelectorPrefix)) {
                this.bySelector.delete(key);
            }
        });
        this.custom.importFonts(assets).forEach(font => this.addFont(font));
    }
    getTypeface(info) {
        const typeface = this[info.source].getTypefaceByFamily(info.family);
        return typeface;
    }
    getFontBySelector(selector, createFont = true) {
        if (selector.startsWith(customFontSelectorPrefix)) {
            return this.custom.getFontBySelector(selector, createFont);
        }
        return this.bySelector.get(selector);
    }
    // Function called by draft to get font properties for a selector, before the (google) font is available in the store
    // It replaces a previous function that created Font instances and added them to the store
    // on the fly while rendering drafts, which caused issues (overriding real google font info with fake instances with partial data).
    // Ideally this should not happen, but that's a fix for another day
    getDraftPropertiesBySelector(selector) {
        const font = this.getFontBySelector(selector);
        if (font) {
            return {
                style: font.style,
                weight: font.weight,
                variant: font.variant,
                family: font.typeface.family,
                source: font.typeface.source,
                category: font.category,
            };
        }
        // If this is an unknown selector, attempt to parse it as a google font selector
        const googleLocator = this.google.parseSelector(selector);
        if (googleLocator) {
            const fontVariant = GoogleFontSource.parseVariant(googleLocator.variant);
            if (fontVariant) {
                return {
                    style: fontVariant.style,
                    weight: fontVariant.weight,
                    variant: googleLocator.variant,
                    family: googleLocator.family,
                    source: TypefaceSourceNames.Google,
                    category: undefined,
                };
            }
        }
        const fontshareLocator = this.fontshare.parseSelector(selector);
        if (fontshareLocator) {
            const fontVariant = FontshareSource.parseVariant(fontshareLocator.variant);
            if (fontVariant) {
                return {
                    style: fontVariant.style,
                    weight: fontVariant.weight,
                    variant: fontshareLocator.variant,
                    family: fontshareLocator.family,
                    source: TypefaceSourceNames.Fontshare,
                    category: undefined,
                };
            }
        }
        return null;
    }
    isSelectorLoaded(selector) {
        return this.loadedSelectors.has(selector);
    }
    /**
     * Load a single font
     * */
    async loadFont(font) {
        if (this.isSelectorLoaded(font.selector)) {
            return LoadFontResult.AlreadyLoaded;
        }
        if (font.typeface.source === TypefaceSourceNames.Local) {
            // In case of a local font, we can safely assume it's loaded, except for
            // the Inter font, which is loaded via an external CSS file. Loading will be
            // initiated automatically by the browser, we only need to wait until it's ready.
            // NOTE: Skip for tests and assume Inter is loaded.
            if (this.local.interTypefaceSelectors.has(font.selector) && process.env.NODE_ENV !== "test") {
                await isFontReady(font.typeface.family, font.style, font.weight);
            }
            this.loadedSelectors.add(font.selector);
            return LoadFontResult.Loaded;
        }
        // Load custom or Google font
        if (!font.file) {
            return Promise.reject(`Unable to load font: ${font.selector}`);
        }
        await loadFont({
            family: font.typeface.family,
            url: font.file,
            weight: font.weight,
            style: font.style,
        }, document);
        this.loadedSelectors.add(font.selector);
        return LoadFontResult.Loaded;
    }
    async loadWebFontsFromSelectors(selectors) {
        if (!this.enabled)
            return [];
        const loadFontshareFonts = selectors.some(selector => selector.startsWith(fontsharePrefix));
        // In case we are loading a Google font, make sure the list of
        // Google fonts has been imported in the store
        if (selectors.some(s => s.startsWith(googleFontSelectorPrefix)) || loadFontshareFonts) {
            try {
                await this.importGoogleFonts();
            }
            catch (error) {
                warnOnce("Failed to load Google fonts:", error);
            }
            // Fontshare include typefaces that already exist in Google Fonts.
            // To avoid duplication, we need to **always** load Google Fonts
            // first, which will populate `this.googleFamilyNames`, and then
            // check if a typeface already exists when importing Fontshare
            // fonts.
            //
            // TODO: Perform this deduplication in FramerWebAPI because it's
            // making an extra request to Google Fonts even if the site only
            // uses Fontshare typefaces. This is only an issue in the editor,
            // and does not affect published sites.
            //
            // https://github.com/framer/company/issues/27752
            try {
                await this.importFontshareFonts();
            }
            catch (error) {
                warnOnce("Failed to load Fontshare fonts:", error);
            }
        }
        // Filter out all unknown fonts. This means that not every selector
        // that was requested might be loaded!
        const fonts = selectors.map(s => this.bySelector.get(s)).filter((f) => !!f);
        // Trigger the loading of all fonts. We’re using `allSettled` here
        // (polyfilled below) to make sure as many as possible are loaded. Fonts
        // that have failed before will immediately reject.
        return Promise.allSettled(fonts.map(f => this.loadFont(f)));
    }
    async loadMissingFonts(fontSelectors, fontsLoadedCallback) {
        const selectors = fontSelectors.filter(selector => {
            return !fontStore.isSelectorLoaded(selector);
        });
        if (selectors.length === 0)
            return;
        await fontStore.loadWebFontsFromSelectors(selectors);
        const isEachFontLoaded = selectors.every(selector => {
            return fontStore.isSelectorLoaded(selector);
        });
        if (isEachFontLoaded && fontsLoadedCallback)
            fontsLoadedCallback();
    }
}
/** @internal */
export const fontStore = /* @__PURE__ */ new FontStore();
/** Promise.allSettled polyfill */
Promise.allSettled =
    Promise.allSettled ||
        ((promises) => Promise.all(promises.map(p => p.then(v => ({ status: "fulfilled", value: v })).catch(e => ({ status: "rejected", reason: e })))));
//# sourceMappingURL=fontStore.js.map