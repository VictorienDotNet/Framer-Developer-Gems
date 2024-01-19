type Family = string;
type Style = string;
type Selector = string;
type Weight = number | undefined;
interface Font {
    selector: Selector;
    weight: Weight;
}
type TypefaceMembers = Record<Style, Font>;
type Typefaces = Record<Family, TypefaceMembers>;
export declare const typefaceAliases: {
    [key: string]: string;
};
export declare const typefaces: Typefaces;
export {};
//# sourceMappingURL=fonts.d.ts.map