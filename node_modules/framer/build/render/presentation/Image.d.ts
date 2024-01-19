import type { BackgroundImage } from "../types/BackgroundImage.js";
import type { MotionDivProps } from "./Frame/types.js";
import React from "react";
import { ImageAltProps } from "../style/BackgroundImageComponent.js";
/** @public */
interface BackgroundImageProps extends ImageAltProps {
    background: BackgroundImage;
}
/** @public */
interface ImageProps extends MotionDivProps, BackgroundImageProps {
    as?: keyof HTMLElementTagNameMap;
}
/** @public */
export declare const Image: React.ForwardRefExoticComponent<Partial<ImageProps> & React.RefAttributes<HTMLDivElement>>;
export {};
//# sourceMappingURL=Image.d.ts.map