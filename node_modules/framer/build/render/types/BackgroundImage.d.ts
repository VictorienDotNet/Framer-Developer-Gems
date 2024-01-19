/** @public */
export type ImageFit = "fill" | "fit" | "stretch";
/** @public */
export interface BackgroundImage {
    src: string | undefined;
    alt?: string;
    srcSet?: string;
    sizes?: string;
    pixelWidth?: number;
    pixelHeight?: number;
    intrinsicWidth?: number;
    intrinsicHeight?: number;
    fit?: ImageFit;
    loading?: "lazy" | "eager";
}
/** @public */
export declare namespace BackgroundImage {
    const isImageObject: (image: any) => image is object & BackgroundImage;
}
//# sourceMappingURL=BackgroundImage.d.ts.map