const key = "src";
/** @public */
export var BackgroundImage;
(function (BackgroundImage) {
    BackgroundImage.isImageObject = function (image) {
        if (!image || typeof image === "string")
            return false;
        return key in image;
    };
})(BackgroundImage || (BackgroundImage = {}));
//# sourceMappingURL=BackgroundImage.js.map