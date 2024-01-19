/** @internal */
export function isShallowEqualArray(a, b) {
    return a.length === b.length && a.every((v, i) => v === b[i]);
}
//# sourceMappingURL=isShallowEqualArray.js.map