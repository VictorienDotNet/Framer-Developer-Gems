/// <reference types="react" />
import type { BackgroundImage } from "../types/BackgroundImage.js";
import type { Size } from "../types/Size.js";
export declare function cssImageRendering(image: BackgroundImage, containerSize?: Size): "auto" | "pixelated";
export interface ImageAltProps {
    /**
     * Previously, alt was set on the BackgroundImage object. This caused issues
     * where the entire object would need to be replaced in order to update the
     * alt attribute. Now we provide a specific prop for the alt attribute so it
     * can change even if the background object does not and vice versa. This
     * needs to be optional so that old sites and Smart Components generated
     * with alt in the BackgroundImage object do not error. Those sites and
     * Smart Components will correctly fallback to BackgroundImage.alt.
     */
    alt?: string;
}
interface InnerImageProps extends ImageAltProps {
    image: BackgroundImage;
    containerSize?: Size;
    nodeId?: string;
}
interface Props extends InnerImageProps {
    layoutId?: string;
}
export declare function BackgroundImageComponent({ layoutId, image, ...props }: Props): JSX.Element;
export {};
//# sourceMappingURL=BackgroundImageComponent.d.ts.map