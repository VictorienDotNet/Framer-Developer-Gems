import type { Shadow } from "../types/Shadow.js";
/** @public */
export interface FilterNumberProperties {
    brightness: number;
    contrast: number;
    grayscale: number;
    hueRotate: number;
    invert: number;
    saturate: number;
    sepia: number;
    blur: number;
}
/** @public */
export interface FilterProperties extends FilterNumberProperties {
    dropShadows: Readonly<Shadow[]>;
}
//# sourceMappingURL=Filters.d.ts.map