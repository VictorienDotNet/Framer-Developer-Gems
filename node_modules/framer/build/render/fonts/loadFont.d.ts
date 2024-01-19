export declare class FontLoadingError extends Error {
    constructor(message: string);
}
interface FontFaceData {
    family: string;
    url: string;
    weight?: number | string;
    style?: string;
    stretch?: string;
    unicodeRange?: string;
}
/** @internal  */
export declare const loadFont: (data: FontFaceData, doc: Document) => Promise<void>;
/** @internal  */
export declare function isFontReady(family: string, style: string | undefined, weight: number | string | undefined): Promise<void>;
/**
 * @internal
 * Util function for use in tests to clear state between test cases
 * */
export declare function _clearCache(): void;
export {};
//# sourceMappingURL=loadFont.d.ts.map