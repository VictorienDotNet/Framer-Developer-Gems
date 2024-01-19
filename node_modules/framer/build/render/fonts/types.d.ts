/** @internal */
interface FontMetaData {
    fontFamily: string;
    fontSubFamily: string;
    postscriptName: string;
    preferredFamily: string;
    preferredSubFamily: string;
}
/** @internal */
interface AssetProperties {
    kind: string;
    font: FontMetaData;
}
/**
 * @internal
 * The Asset related types are defined in src/app/assets.
 * To avoid a dependency on that module, this module only defines
 * interfaces that only contain relevant properties for fonts
 * */
export interface Asset {
    key: string;
    name: string;
    filename: string;
    ownerType: string;
    mimeType: string;
    url: string;
    properties?: AssetProperties;
}
/** @internal */
export type TypefaceSourceName = "local" | "google" | "fontshare" | "custom";
/** @internal */
export type TypefaceSelector = string;
/** @internal */
export declare enum TypefaceSourceNames {
    Google = "google",
    Fontshare = "fontshare",
    Local = "local",
    Custom = "custom"
}
/** @internal */
export interface FontSource {
    readonly name: TypefaceSourceName;
    getTypefaceByFamily: (family: string) => ReadonlyTypeface | null;
}
/** @internal */
export interface Typeface {
    source: TypefaceSourceName;
    family: string;
    fonts: Font[];
    owner?: "team" | "project";
}
/** @internal */
export declare const knownGoogleFontCategories: readonly ["sans-serif", "serif", "monospace", "display", "handwriting"];
/** @internal */
export type GoogleFontCategory = (typeof knownGoogleFontCategories)[number];
/** @internal */
export interface Font {
    typeface: Typeface;
    variant: string;
    selectorBold?: string;
    selectorBoldItalic?: string;
    selectorItalic?: string;
    /**
     * normal / italic / oblique
     * The font-style of the font
     * Can be parsed from the variant when using google fonts
     */
    style?: string;
    /**
     * 100-800
     * The font-weight of the font
     * Can be parsed from the variant when using google fonts
     */
    weight?: number;
    /**
     * sans-serif / serif / monospace / display / handwriting
     * The category of a font, as defined by Google Fonts
     */
    category?: GoogleFontCategory;
    selector: TypefaceSelector;
    status?: "loaded";
    postscriptName?: string;
    file?: string;
}
/**
 * The data required to locate a typeface
 *
 * @internal
 */
export interface TypefaceLocator {
    source: TypefaceSourceName;
    family: string;
}
/**
 * The data required to locate a font
 *
 * @internal
 */
export interface WebFontLocator extends TypefaceLocator {
    variant: string;
    file?: string;
}
/**
 * Specific set of properties required by draft to render a font
 * @internal
 */
export interface DraftFontProperties {
    style: string | undefined;
    weight: number | undefined;
    variant: string | undefined;
    family: string;
    source: TypefaceSourceName;
    category: GoogleFontCategory | undefined;
}
/**
 * Information about the various characteristics of a font
 * */
export interface FontVariant {
    /** "normal" | "italic" | "oblique" */
    style: string;
    /** 100 / 200 / 300 / 400 / 500 / 600 / 700 / 800 */
    weight: number;
}
/**
 * A mapped type that deeply changes all properties into readonly
 * all arrays into ReadonlyArray<T>
 * all maps into ReadonlyMap<T>
 */
type DeepReadonly<T> = {
    readonly [P in keyof T]: T[P] extends Map<infer K, infer V> ? ReadonlyMap<K, V> : T[P] extends (infer X)[] ? readonly X[] : DeepReadonly<T[P]>;
};
/** @internal */
export type ReadonlyFont = DeepReadonly<Font>;
/** @internal */
export type ReadonlyTypeface = DeepReadonly<Typeface>;
export {};
//# sourceMappingURL=types.d.ts.map