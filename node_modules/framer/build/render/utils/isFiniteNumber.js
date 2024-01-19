/** @internal */
export function isFiniteNumber(value) {
    return typeof value === "number" && isFinite(value);
}
/** @internal */
export function finiteNumber(value) {
    return isFiniteNumber(value) ? value : undefined;
}
//# sourceMappingURL=isFiniteNumber.js.map