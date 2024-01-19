import { getFontVariants } from "./getFontVariants.js";
import { TypefaceSourceNames, } from "./types.js";
export const fontsharePrefix = "FS;";
/** @internal */
const weightNameToNumber = {
    thin: 100,
    hairline: 100,
    extralight: 200,
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    ultra: 800,
    black: 900,
    heavy: 900, // Alternative name for "black".
};
/** @internal */
const weightNames = Object.keys(weightNameToNumber);
/** @internal */
// Match any of the weight names at the start of the variant string.
const allowedVariantsRegex = new RegExp(`^(${[...weightNames, "italic"].join("|")})`);
/** @internal */
export class FontshareSource {
    name = TypefaceSourceNames.Fontshare;
    typefaces = [];
    byFamily = new Map();
    getTypefaceByFamily(family) {
        return this.byFamily.get(family) ?? null;
    }
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
    static parseVariant(variant) {
        const variantSplit = variant.split(" ");
        const weightName = weightNames.find(weightName => {
            return variantSplit.includes(weightName);
        });
        const styleName = variant.includes("italic") ? "italic" : "normal";
        const weight = (weightName && weightNameToNumber[weightName]) || 400;
        const style = styleName === "italic" ? styleName : "normal";
        return {
            weight,
            style,
        };
    }
    parseSelector(selector) {
        if (!selector.startsWith(fontsharePrefix))
            return null;
        const tokens = selector.split("-");
        if (tokens.length !== 2)
            return null;
        const [family, variant] = tokens;
        if (!family || !variant)
            return null;
        return { family: family.replace(fontsharePrefix, ""), variant, source: this.name };
    }
    static createSelector(family, variant) {
        return `${fontsharePrefix}${family}-${variant}`;
    }
    addTypeface(typeface) {
        this.typefaces.push(typeface);
        this.byFamily.set(typeface.family, typeface);
    }
    importFonts(fontshareFonts) {
        this.typefaces.length = 0;
        this.byFamily.clear();
        const fonts = [];
        for (const fontshareFont of fontshareFonts) {
            const fontStyles = fontshareFont.font_styles.filter(fontStyle => {
                const variant = fontStyle.name.toLowerCase();
                // We exclude variants that don't map directly to a CSS
                // `font-weight`. For example, variants such as "hairline",
                // "semilight", "zero" or "variable" etc. We also don't support
                // the ability to select `font-stretch` in the properties
                // panel, so we also exclude any variant that has a "wide"
                // suffix.
                const allowedVariantMatch = allowedVariantsRegex.exec(variant);
                if (!allowedVariantMatch || variant.endsWith("wide")) {
                    return false;
                }
                return true;
            });
            for (const fontStyle of fontStyles) {
                const { name: family } = fontshareFont;
                const variant = fontStyle.name.toLowerCase();
                let typeface = this.getTypefaceByFamily(family);
                if (!typeface) {
                    typeface = { family: family, fonts: [], source: this.name };
                    this.addTypeface(typeface);
                }
                const selector = FontshareSource.createSelector(family, variant);
                const variantInfo = FontshareSource.parseVariant(variant) || {
                    weight: undefined,
                    style: undefined,
                };
                const { weight, style } = variantInfo;
                const { variantBold, variantBoldItalic, variantItalic } = getFontVariants(variant, fontStyles, FontshareSource.parseVariant);
                const font = {
                    typeface,
                    variant,
                    selector,
                    selectorBold: variantBold ? FontshareSource.createSelector(family, variantBold) : undefined,
                    selectorBoldItalic: variantBoldItalic
                        ? FontshareSource.createSelector(family, variantBoldItalic)
                        : undefined,
                    selectorItalic: variantItalic ? FontshareSource.createSelector(family, variantItalic) : undefined,
                    weight,
                    style,
                    file: fontStyle.file,
                };
                typeface.fonts.push(font);
                fonts.push(font);
            }
        }
        return fonts;
    }
}
//# sourceMappingURL=FontshareSource.js.map