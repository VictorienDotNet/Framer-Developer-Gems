import { TypefaceSourceNames, } from "./types.js";
export const customFontSelectorPrefix = "CUSTOM;";
/**
 * Parses and returns the custom font filename if no properties were provided.
 * With properties provided, the preferred family and sub family are chosen over the base font family.
 * */
function getCustomFontName(fileName, properties) {
    if (!properties)
        return fileName.substring(0, fileName.lastIndexOf("."));
    const fontFamily = properties.font.preferredFamily === "" ? properties.font.fontFamily : properties.font.preferredFamily;
    // This variant can be used for custom font grouping
    const variant = properties.font.preferredSubFamily === "" ? properties.font.fontSubFamily : properties.font.preferredSubFamily;
    return `${fontFamily} ${variant}`;
}
/** @internal */
export class CustomFontSource {
    name = TypefaceSourceNames.Custom;
    typefaces = [];
    byFamily = new Map();
    assetsByFamily = new Map();
    importFonts(assets) {
        this.typefaces.length = 0;
        this.byFamily.clear();
        this.assetsByFamily.clear();
        const fonts = [];
        assets.forEach(asset => {
            if (!this.isValidCustomFontAsset(asset)) {
                return;
            }
            const fontName = getCustomFontName(asset.name, asset.properties);
            const typeface = this.createTypeface(fontName);
            const font = {
                typeface,
                selector: `${customFontSelectorPrefix}${fontName}`,
                variant: this.inferVariantName(fontName),
                postscriptName: asset.properties?.font.postscriptName,
                file: asset.url,
            };
            typeface.fonts.push(font);
            typeface.owner = asset.ownerType === "team" ? "team" : "project";
            this.assetsByFamily.set(fontName, asset);
            fonts.push(...typeface.fonts);
        });
        return fonts;
    }
    isValidCustomFontAsset(asset) {
        if (!asset.mimeType.startsWith("font/"))
            return false;
        if (asset.properties?.kind !== "font")
            return false;
        if (!asset.properties.font)
            return false;
        return "fontFamily" in asset.properties.font;
    }
    inferVariantName(family) {
        const possibleValues = [
            "thin",
            "ultra light",
            "extra light",
            "light",
            "normal",
            "medium",
            "semi bold",
            "bold",
            "extra bold",
            "black",
        ];
        const possibleValuesWithItalics = [...possibleValues.map(value => `${value} italic`), ...possibleValues];
        const lowerCaseFamily = family.toLowerCase();
        const tokens = [...lowerCaseFamily.split(" "), ...lowerCaseFamily.split("-"), ...lowerCaseFamily.split("_")];
        const foundToken = possibleValuesWithItalics.find(value => tokens.includes(value) || tokens.includes(value.replace(/\s+/g, "")));
        // Return found token with each letter capitalized
        if (foundToken)
            return foundToken.replace(/(^\w|\s\w)/g, char => char.toUpperCase());
        return "Regular";
    }
    createTypeface(family) {
        const existingTypeface = this.byFamily.get(family);
        if (existingTypeface)
            return existingTypeface;
        const typeface = {
            source: this.name,
            family,
            fonts: [],
        };
        this.addTypeface(typeface);
        return typeface;
    }
    addTypeface(typeface) {
        this.typefaces.push(typeface);
        this.byFamily.set(typeface.family, typeface);
    }
    parseSelector(selector) {
        if (!selector.startsWith(customFontSelectorPrefix))
            return null;
        const tokens = selector.split(customFontSelectorPrefix);
        if (tokens[1] === undefined)
            return null;
        const locator = { source: "custom", family: tokens[1] };
        return locator;
    }
    getFontBySelector(selector, createFont = true) {
        const locator = this.parseSelector(selector);
        if (!locator)
            return;
        if (!createFont && !this.byFamily.get(locator.family))
            return;
        return this.getTypefaceByFamily(locator.family).fonts[0];
    }
    getTypefaceByFamily(family) {
        const foundTypeface = this.byFamily.get(family);
        if (foundTypeface)
            return foundTypeface;
        const typeface = {
            source: "custom",
            family,
            fonts: [],
        };
        typeface.fonts.push({
            selector: `${customFontSelectorPrefix}${family}`,
            variant: this.inferVariantName(family),
            typeface,
        });
        return typeface;
    }
}
//# sourceMappingURL=CustomFontSource.js.map