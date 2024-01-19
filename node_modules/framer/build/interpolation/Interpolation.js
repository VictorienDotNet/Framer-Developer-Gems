/**
 * @internal
 */
export function isInterpolatable(value) {
    return typeof value === "function" && value.interpolationFor && typeof value.interpolationFor === "function";
}
/**
 * @public
 */
export const Interpolation = {
    /**
     * @param from -
     * @param to -
     * @internal
     */
    handleUndefined: (from, to) => {
        if (from === undefined) {
            from = to;
        }
        if (to === undefined) {
            to = from;
        }
        return [from, to];
    },
};
//# sourceMappingURL=Interpolation.js.map