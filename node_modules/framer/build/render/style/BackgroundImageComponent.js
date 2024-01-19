import { motion } from "framer-motion";
import React from "react";
import { useIsomorphicLayoutEffect } from "../../useIsomorphicLayoutEffect.js";
import { runtime } from "../../utils/runtimeInjection.js";
import { safeWindow } from "../../utils/safeWindow.js";
import { isString } from "../../utils/utils.js";
import { RenderEnvironment, RenderTarget } from "../types/RenderEnvironment.js";
import { imageRenderingForZoom, minZoomForPixelatedImageRendering } from "../utils/imageRendering.js";
const wrapperStyle = {
    position: "absolute",
    borderRadius: "inherit",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
};
const placeholderStyle = {
    backgroundSize: "16px 16px",
    backgroundImage: "repeating-linear-gradient(45deg, rgba(180, 180, 180, 0.8) 0, rgba(180, 180, 180, 0.8) 1px, rgba(255, 255, 255, 0.2) 0, rgba(255, 255, 255, 0.2) 50%)",
    border: "1px solid #c4c4c4",
};
function cssObjectFit(imageFit) {
    switch (imageFit) {
        case "fit":
            return "contain";
        case "stretch":
            return "fill";
        default:
            return "cover";
    }
}
export function cssImageRendering(image, containerSize) {
    if (!containerSize)
        return "auto";
    // Set appropriate image rendering for the current environment
    const devicePixelRatio = RenderTarget.current() === RenderTarget.canvas ? safeWindow.devicePixelRatio : 1;
    const minPixelatedZoom = minZoomForPixelatedImageRendering(image, containerSize, devicePixelRatio);
    if (RenderTarget.current() === RenderTarget.canvas) {
        // On the canvas we want to always keep image-rendering stable during
        // zoom (hence the zoom = 1) the canvas pixelates the images on zooming
        // in with a css rule.
        return imageRenderingForZoom(1, minPixelatedZoom);
    }
    else {
        // In the preview or with export we might require a higher zoom level
        // where images need to get pixelated if their frame is larger then
        // their intrinsic size.
        return imageRenderingForZoom(RenderEnvironment.zoom, minPixelatedZoom);
    }
}
function getImageStyle(image, containerSize) {
    return {
        display: "block",
        width: "100%",
        height: "100%",
        borderRadius: "inherit",
        objectPosition: "center",
        objectFit: cssObjectFit(image.fit),
        imageRendering: cssImageRendering(image, containerSize),
    };
}
function InnerImage({ image, containerSize, nodeId, alt }) {
    const wrapperRef = React.useRef(null);
    const source = runtime.useImageSource(image, containerSize, nodeId);
    const imageStyle = getImageStyle(image, containerSize);
    // These variables should never change for the lifetime of the component so it's fine to conditionally use hooks
    const isStaticRendering = RenderTarget.current() !== RenderTarget.canvas;
    if (isStaticRendering) {
        return (React.createElement("img", { src: source, alt: alt ?? image.alt, 
            // We don't need to resolve srcSet with useImageSource,
            // because these are currently only used in generated
            // components, where resolution happens during
            // code-generation.
            srcSet: image.srcSet, sizes: image.sizes, style: imageStyle, loading: image.loading }));
    }
    else {
        const imageElement = runtime.useImageElement(image, containerSize, nodeId);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useIsomorphicLayoutEffect(() => {
            const wrapper = wrapperRef.current;
            if (wrapper === null)
                return;
            wrapper.appendChild(imageElement);
            return () => {
                wrapper.removeChild(imageElement);
            };
        }, [imageElement]);
        Object.assign(imageElement.style, imageStyle);
        return React.createElement("div", { ref: wrapperRef, style: { display: "contents", borderRadius: "inherit" } });
    }
}
export function BackgroundImageComponent({ layoutId, image, ...props }) {
    if (layoutId) {
        layoutId = layoutId + "-background";
    }
    const hasImage = isString(image.src);
    const hasPlaceholder = !hasImage;
    return (React.createElement(motion.div, { layoutId: layoutId, style: hasPlaceholder ? { ...wrapperStyle, ...placeholderStyle } : wrapperStyle, "data-framer-background-image-wrapper": true }, hasImage && React.createElement(InnerImage, { image: image, ...props })));
}
//# sourceMappingURL=BackgroundImageComponent.js.map