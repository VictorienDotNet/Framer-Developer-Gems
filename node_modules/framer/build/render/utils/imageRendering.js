/**
 * @internal
 */
export function minZoomForPixelatedImageRendering(image, containerSize, devicePixelRatio = 1) {
    let { width: frameWidth, height: frameHeight } = containerSize;
    const imageWidth = image.pixelWidth ?? image.intrinsicWidth ?? 0;
    const imageHeight = image.pixelHeight ?? image.intrinsicHeight ?? 0;
    // Don't pixelate for nonsensical frames or images
    if (frameWidth < 1 || frameHeight < 1 || imageWidth < 1 || imageHeight < 1) {
        return undefined;
    }
    // Account for device pixel density
    frameWidth *= devicePixelRatio;
    frameHeight *= devicePixelRatio;
    // At what zoom level do the image's pixels match 1:1 with a render of the image within the frame?
    const frameAspectRatio = frameWidth / frameHeight;
    const imageAspectRatio = imageWidth / imageHeight;
    switch (image.fit) {
        case "fill":
            if (imageAspectRatio > frameAspectRatio) {
                // Width will be cut off, height determines pixelation
                return imageHeight / frameHeight;
            }
            else {
                // Height will be cut off, width determines pixelation
                return imageWidth / frameWidth;
            }
        case "fit":
        case "stretch":
            // Pixelate once both image dimensions exceed frame size
            return Math.max(imageWidth / frameWidth, imageHeight / frameHeight);
    }
}
/**
 * @internal
 */
export function imageRenderingForZoom(zoom, minPixelatedZoom) {
    if (minPixelatedZoom && Math.max(1, zoom) > minPixelatedZoom) {
        return "pixelated";
    }
    return "auto";
}
//# sourceMappingURL=imageRendering.js.map