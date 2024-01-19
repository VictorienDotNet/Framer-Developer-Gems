export const Size = /* @__PURE__ */ (() => {
    /**
     * @public
     */
    function Size(width, height) {
        return { width, height };
    }
    /**
     * @param sizeA -
     * @param sizeB -
     * @internal
     */
    Size.equals = (sizeA, sizeB) => {
        if (sizeA === sizeB)
            return true;
        if (!sizeA || !sizeB)
            return false;
        return sizeA.width === sizeB.width && sizeA.height === sizeB.height;
    };
    /**
     *
     * @param fromSize - The initial size
     * @param toSize - The size to update to
     * @param keepAspectRatio - If the updating should preserve the aspect ratio
     * @remarks
     * keepAspectRatio only works if passing a toSize with only a width or height
     * @internal
     */
    Size.update = (fromSize, toSize, keepAspectRatio = false) => {
        let { width, height } = fromSize;
        const sizeRatio = width / height;
        // Update from partial
        width = toSize.width !== undefined ? toSize.width : width;
        height = toSize.height !== undefined ? toSize.height : height;
        // Overwrite if we want and can keep the aspect ratio
        if (keepAspectRatio) {
            if (toSize.width === undefined && toSize.height !== undefined) {
                width = toSize.height * sizeRatio;
            }
            if (toSize.width !== undefined && toSize.height === undefined && sizeRatio !== 0) {
                height = toSize.width / sizeRatio;
            }
        }
        return { width, height };
    };
    /**
     *
     * @param sizeA -
     * @param sizeB -
     * @internal
     */
    Size.subtract = (sizeA, sizeB) => {
        return {
            width: Math.max(0, sizeA.width - sizeB.width),
            height: Math.max(0, sizeA.height - sizeB.height),
        };
    };
    /**
     * @public
     */
    Size.zero = Size(0, 0);
    /**
     * Checks if the size has a zero width and zero height
     * @param size - size to check
     * @public
     */
    Size.isZero = function (size) {
        return size === Size.zero || (size.width === 0 && size.height === 0);
    };
    /**
     * @param width -
     * @param height -
     * @param size -
     * @internal
     */
    Size.defaultIfZero = function (width, height, size) {
        if (Size.isZero(size)) {
            return Size(width, height);
        } // else
        return size;
    };
    return Size;
})();
//# sourceMappingURL=Size.js.map