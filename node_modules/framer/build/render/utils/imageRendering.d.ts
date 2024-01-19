import type { BackgroundImage } from "../types/BackgroundImage.js";
import type { Size } from "../types/Size.js";
/**
 * @internal
 */
export declare function minZoomForPixelatedImageRendering(image: BackgroundImage, containerSize: Size, devicePixelRatio?: number): number | undefined;
/**
 * @internal
 */
export declare function imageRenderingForZoom(zoom: number, minPixelatedZoom: number | undefined): "auto" | "pixelated";
//# sourceMappingURL=imageRendering.d.ts.map