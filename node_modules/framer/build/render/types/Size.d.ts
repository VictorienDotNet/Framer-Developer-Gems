/**
 * @public
 */
export interface Size {
    width: number;
    height: number;
}
export declare const Size: {
    (width: number, height: number): Size;
    /**
     * @param sizeA -
     * @param sizeB -
     * @internal
     */
    equals(sizeA: Size | null, sizeB: Size | null): boolean;
    /**
     *
     * @param fromSize - The initial size
     * @param toSize - The size to update to
     * @param keepAspectRatio - If the updating should preserve the aspect ratio
     * @remarks
     * keepAspectRatio only works if passing a toSize with only a width or height
     * @internal
     */
    update(fromSize: Size, toSize: Partial<Size>, keepAspectRatio?: boolean): {
        width: number;
        height: number;
    };
    /**
     *
     * @param sizeA -
     * @param sizeB -
     * @internal
     */
    subtract(sizeA: Size, sizeB: Size): {
        width: number;
        height: number;
    };
    /**
     * @public
     */
    zero: Size;
    /**
     * Checks if the size has a zero width and zero height
     * @param size - size to check
     * @public
     */
    isZero(size: Size): boolean;
    /**
     * @param width -
     * @param height -
     * @param size -
     * @internal
     */
    defaultIfZero(width: number, height: number, size: Size): Size;
};
//# sourceMappingURL=Size.d.ts.map