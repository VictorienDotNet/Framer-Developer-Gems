import type { FontshareStyle } from "./FontshareSource.js";
import type { FontVariant } from "./types.js";
/** @internal */
export declare function getFontVariants(currentVariant: string, variants: string[] | FontshareStyle[], parseVariant: (variant: string) => FontVariant | null): Partial<{
    variantBold: string;
    variantBoldItalic: string;
    variantItalic: string;
}>;
//# sourceMappingURL=getFontVariants.d.ts.map