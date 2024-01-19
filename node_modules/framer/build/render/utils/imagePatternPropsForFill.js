import { Animatable } from "../../animation/Animatable/Animatable.js";
import { BackgroundImage } from "../types/BackgroundImage.js";
/** @internal */
export function imagePatternPropsForFill(fill, frame, id) {
    fill = Animatable.get(fill, "#09F");
    if (!BackgroundImage.isImageObject(fill))
        return undefined;
    if (!fill.pixelWidth || !fill.pixelHeight)
        return undefined;
    const imageWidth = fill.pixelWidth;
    const imageHeight = fill.pixelHeight;
    let transform;
    const { fit } = fill;
    if (fit === "fill" || fit === "fit" || !fit) {
        let scaleX = 1;
        let scaleY = 1;
        let offsetX = 0;
        let offsetY = 0;
        const imageRatio = imageWidth / imageHeight;
        const realWidth = frame.height * imageRatio;
        const realHeight = frame.width / imageRatio;
        const validScaleX = realWidth / frame.width;
        const validScaleY = realHeight / frame.height;
        if (fit === "fill" || !fit ? validScaleY > validScaleX : validScaleY < validScaleX) {
            scaleY = validScaleY;
            offsetY = (1 - validScaleY) / 2;
        }
        else {
            scaleX = validScaleX;
            offsetX = (1 - validScaleX) / 2;
        }
        transform = `translate(${offsetX}, ${offsetY}) scale(${scaleX}, ${scaleY})`;
    }
    const imageId = `id${id}g${"-fillImage"}`;
    return { id: imageId, path: fill.src ?? "", transform };
}
//# sourceMappingURL=imagePatternPropsForFill.js.map