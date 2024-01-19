import { safeNavigator } from "../../utils/safeNavigator.js";
import { typefaceAliases, typefaces as systemTypefaces } from "./fonts.js";
import { TypefaceSourceNames } from "./types.js";
/** @internal */
export const systemTypefaceName = "System Default";
/** @internal */
export class LocalFontSource {
    name = TypefaceSourceNames.Local;
    typefaces = [];
    byFamily = new Map();
    typefaceAliasBySelector = new Map();
    typefaceAliases = new Map();
    getTypefaceByFamily(family) {
        return this.byFamily.get(family) ?? null;
    }
    // TODO: these are duplicated across implementations of FontSource
    // When adding a third source, we should abstract them
    createTypeface(family) {
        const typeface = { family: family, fonts: [], source: this.name };
        this.addTypeface(typeface);
        return typeface;
    }
    addTypeface(typeface) {
        this.typefaces.push(typeface);
        this.byFamily.set(typeface.family, typeface);
    }
    // end of duplication
    importFonts() {
        const fonts = [];
        for (const family of Object.keys(systemTypefaces)) {
            const members = systemTypefaces[family];
            if (!members)
                continue;
            const typeface = this.createTypeface(family);
            for (const variant of Object.keys(members)) {
                const member = members[variant];
                if (!member)
                    continue;
                const { selector, weight } = member;
                // font.style is never defined in local fonts, we always use a specific font family that already includes the style
                const font = {
                    variant,
                    selector,
                    weight,
                    typeface,
                    status: "loaded",
                };
                typeface.fonts.push(font);
            }
            fonts.push(...typeface.fonts);
        }
        for (const [key, value] of Object.entries(typefaceAliases)) {
            this.addTypefaceAlias(key, value);
        }
        const { typeface: systemTypeface, aliases } = this.getSystemTypeface();
        this.addTypeface(systemTypeface);
        for (const [key, value] of aliases) {
            this.addTypefaceAlias(key, value);
        }
        fonts.push(...systemTypeface.fonts);
        const interTypeface = this.importInterTypeface();
        fonts.push(...interTypeface.fonts);
        return fonts;
    }
    interTypefaceSelectors = new Set();
    importInterTypeface() {
        const inter = [
            {
                variant: "Regular",
                selector: "Inter",
                weight: 400,
                selectorBold: "Inter-Bold",
                selectorBoldItalic: "Inter-BoldItalic",
                selectorItalic: "Inter-Italic",
            },
            {
                variant: "Thin",
                selector: "Inter-Thin",
                weight: 100,
                selectorBold: "Inter",
                selectorBoldItalic: "Inter-Italic",
                selectorItalic: "Inter-ThinItalic",
            },
            {
                variant: "Extra Light",
                selector: "Inter-ExtraLight",
                weight: 200,
                selectorBold: "Inter",
                selectorBoldItalic: "Inter-Italic",
                selectorItalic: "Inter-ExtraLightItalic",
            },
            {
                variant: "Light",
                selector: "Inter-Light",
                weight: 300,
                selectorBold: "Inter",
                selectorBoldItalic: "Inter-Italic",
                selectorItalic: "Inter-LightItalic",
            },
            {
                variant: "Medium",
                selector: "Inter-Medium",
                weight: 500,
                selectorBold: "Inter-Bold",
                selectorBoldItalic: "Inter-BoldItalic",
                selectorItalic: "Inter-MediumItalic",
            },
            {
                variant: "Semibold",
                selector: "Inter-SemiBold",
                weight: 600,
                selectorBold: "Inter-Black",
                selectorBoldItalic: "Inter-BlackItalic",
                selectorItalic: "Inter-SemiBoldItalic",
            },
            {
                variant: "Bold",
                selector: "Inter-Bold",
                weight: 700,
                selectorBold: "Inter-Black",
                selectorBoldItalic: "Inter-BlackItalic",
                selectorItalic: "Inter-BoldItalic",
            },
            {
                variant: "Extra Bold",
                selector: "Inter-ExtraBold",
                weight: 800,
                selectorBold: "Inter-Black",
                selectorBoldItalic: "Inter-BlackItalic",
                selectorItalic: "Inter-ExtraBoldItalic",
            },
            {
                variant: "Black",
                selector: "Inter-Black",
                weight: 900,
                selectorBold: undefined,
                selectorBoldItalic: "Inter-BlackItalic",
                selectorItalic: undefined,
            },
            {
                variant: "Thin Italic",
                selector: "Inter-ThinItalic",
                weight: 100,
                selectorBold: "Inter-Italic",
                selectorBoldItalic: "Inter-Italic",
                selectorItalic: "Inter-ThinItalic",
            },
            {
                variant: "Extra Light Italic",
                selector: "Inter-ExtraLightItalic",
                weight: 200,
                selectorBold: "Inter-Italic",
                selectorBoldItalic: "Inter-Italic",
                selectorItalic: "Inter-ExtraLightItalic",
            },
            {
                variant: "Light Italic",
                selector: "Inter-LightItalic",
                weight: 300,
                selectorBold: "Inter-Italic",
                selectorBoldItalic: "Inter-Italic",
                selectorItalic: "Inter-LightItalic",
            },
            {
                variant: "Italic",
                selector: "Inter-Italic",
                weight: 400,
                selectorBold: "Inter-BoldItalic",
                selectorBoldItalic: "Inter-BoldItalic",
                selectorItalic: "Inter-Italic",
            },
            {
                variant: "Medium Italic",
                selector: "Inter-MediumItalic",
                weight: 500,
                selectorBold: "Inter-BoldItalic",
                selectorBoldItalic: "Inter-BoldItalic",
                selectorItalic: "Inter-MediumItalic",
            },
            {
                variant: "Semibold Italic",
                selector: "Inter-SemiBoldItalic",
                weight: 600,
                selectorBold: "Inter-BoldItalic",
                selectorBoldItalic: "Inter-BoldItalic",
                selectorItalic: "Inter-SemiBoldItalic",
            },
            {
                variant: "Bold Italic",
                selector: "Inter-BoldItalic",
                weight: 700,
                selectorBold: "Inter-BlackItalic",
                selectorBoldItalic: "Inter-BlackItalic",
                selectorItalic: "Inter-BoldItalic",
            },
            {
                variant: "Extra Bold Italic",
                selector: "Inter-ExtraBoldItalic",
                weight: 800,
                selectorBold: "Inter-BlackItalic",
                selectorBoldItalic: "Inter-BlackItalic",
                selectorItalic: "Inter-ExtraBoldItalic",
            },
            {
                variant: "Black Italic",
                selector: "Inter-BlackItalic",
                weight: 900,
                selectorBold: undefined,
                selectorBoldItalic: undefined,
                selectorItalic: "Inter-BlackItalic",
            },
        ];
        const typeface = this.createTypeface("Inter");
        for (const entry of inter) {
            const { variant, selector, weight, selectorBold, selectorBoldItalic, selectorItalic } = entry;
            const font = {
                variant,
                selector,
                selectorBold,
                selectorBoldItalic,
                selectorItalic,
                weight,
                typeface,
                style: /italic/i.test(selector) ? "italic" : "normal",
            };
            typeface.fonts.push(font);
        }
        typeface.fonts.forEach(t => this.interTypefaceSelectors.add(t.selector));
        return typeface;
    }
    addTypefaceAlias(key, value) {
        this.typefaceAliases.set(key, value);
        this.typefaceAliasBySelector.set(value, key);
    }
    getSystemTypeface() {
        const fontFamilies = this.workaroundChrome81and82(
        // System fonts - Taken from https://furbo.org/stuff/systemfonts-new.html - "All Platforms" section
        "system-ui|-apple-system|BlinkMacSystemFont|Segoe UI|Roboto|Oxygen|Ubuntu|Cantarell|Fira Sans|Droid Sans|Helvetica Neue|sans-serif");
        const typeface = { family: systemTypefaceName, fonts: [], source: this.name };
        const aliases = new Map();
        const weights = [400, 100, 200, 300, 500, 600, 700, 800, 900];
        const styles = ["normal", "italic"];
        for (const style of styles) {
            for (const weight of weights) {
                const variant = createVariantName(weight, style);
                const alias = `__SystemDefault-${weight}-${style}__`;
                const font = {
                    variant,
                    selector: alias,
                    style,
                    weight,
                    typeface,
                    status: "loaded",
                };
                typeface.fonts.push(font);
                aliases.set(alias, fontFamilies);
            }
        }
        return { typeface, aliases };
    }
    getTypefaceAliasBySelector(selector) {
        return this.typefaceAliasBySelector.get(selector) || null;
    }
    getTypefaceSelectorByAlias(alias) {
        return this.typefaceAliases.get(alias) || null;
    }
    /** Typeface aliases are in the format of `__Alias-Name__` */
    isTypefaceAlias(value) {
        if (value && value.match(/^__.*__$/))
            return true;
        return false;
    }
    /**
     * Use 'Inter' web font as System Default fonts on Mac with Chrome v81 v82
     * https://github.com/framer/company/issues/17277
     * https://bugs.chromium.org/p/chromium/issues/detail?id=1057654
     */
    workaroundChrome81and82(s) {
        if (safeNavigator) {
            const userAgent = safeNavigator.userAgent;
            if (!userAgent.includes("Mac OS X 10_15"))
                return s;
            if (!userAgent.includes("Chrome/81") && !userAgent.includes("Chrome/82"))
                return s;
        }
        return `Inter|${s}`;
    }
}
const fontWeightNames = {
    "100": "Thin",
    "200": "Extra Light",
    "300": "Light",
    "400": "Normal",
    "500": "Medium",
    "600": "Semi Bold",
    "700": "Bold",
    "800": "Extra Bold",
    "900": "Black",
};
function createVariantName(weight, style) {
    const friendlyStyle = style === "normal" ? "Regular" : "Italic";
    if (weight === 400) {
        return friendlyStyle;
    }
    if (style !== "normal") {
        return `${fontWeightNames[weight]} ${friendlyStyle}`;
    }
    return `${fontWeightNames[weight]}`;
}
//# sourceMappingURL=LocalFontSource.js.map