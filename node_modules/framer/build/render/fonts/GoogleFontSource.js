import { getFontVariants } from "./getFontVariants.js";
import { knownGoogleFontCategories, TypefaceSourceNames, } from "./types.js";
export const googleFontSelectorPrefix = "GF;";
/** @internal */
export class GoogleFontSource {
    name = TypefaceSourceNames.Google;
    typefaces = [];
    byFamily = new Map();
    getTypefaceByFamily(family) {
        return this.byFamily.get(family) ?? null;
    }
    static parseVariant(variant) {
        if (variant === "regular")
            return { style: "normal", weight: 400 };
        // Parse Google Font variant IDs that are formatted like "100", "200",
        // "regular" and "400italic".
        const match = /([0-9]*)([a-z]*)/.exec(variant);
        if (!match)
            return null;
        const weight = parseInt(match[1] || "400");
        const style = match[2] || "normal";
        return { weight, style };
    }
    parseSelector(selector) {
        if (!selector.startsWith(googleFontSelectorPrefix))
            return null;
        const tokens = selector.split("-");
        if (tokens.length !== 2)
            return null;
        const [family, variant] = tokens;
        if (!family || !variant)
            return null;
        return { family: family.replace(googleFontSelectorPrefix, ""), variant, source: this.name };
    }
    static createSelector(family, variant) {
        return `${googleFontSelectorPrefix}${family}-${variant}`;
    }
    addTypeface(family) {
        const typeface = { family: family, fonts: [], source: this.name };
        this.typefaces.push(typeface);
        this.byFamily.set(typeface.family, typeface);
        return typeface;
    }
    importFonts(webFonts) {
        this.typefaces.length = 0;
        this.byFamily.clear();
        const fonts = [];
        webFonts.forEach(webFont => {
            webFont.variants.forEach(variant => {
                const family = webFont.family;
                // Find the parent Typeface for the font (or create it)
                let typeface = this.getTypefaceByFamily(family);
                if (!typeface) {
                    typeface = this.addTypeface(family);
                }
                const variantInfo = GoogleFontSource.parseVariant(variant) ?? {};
                const { weight, style } = variantInfo;
                const selector = GoogleFontSource.createSelector(family, variant);
                const { variantBold, variantItalic, variantBoldItalic } = getFontVariants(variant, webFont.variants, GoogleFontSource.parseVariant);
                const font = {
                    typeface,
                    variant,
                    selector,
                    selectorBold: variantBold ? GoogleFontSource.createSelector(family, variantBold) : undefined,
                    selectorBoldItalic: variantBoldItalic
                        ? GoogleFontSource.createSelector(family, variantBoldItalic)
                        : undefined,
                    selectorItalic: variantItalic ? GoogleFontSource.createSelector(family, variantItalic) : undefined,
                    weight,
                    style,
                    category: ensureKnownCategory(webFont.category),
                    file: webFont.files[variant]?.replace("http://", "https://"),
                };
                typeface.fonts.push(font);
                fonts.push(font);
            });
        });
        return fonts;
    }
}
function ensureKnownCategory(category) {
    if (knownGoogleFontCategories.includes(category))
        return category;
    return undefined;
}
//# sourceMappingURL=GoogleFontSource.js.map