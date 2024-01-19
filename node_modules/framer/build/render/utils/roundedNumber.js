/** @internal */
export function roundedNumber(value, decimals) {
    const d = Math.round(Math.abs(decimals));
    const multiplier = Math.pow(10, d);
    return Math.round(value * multiplier) / multiplier;
}
/** @internal */
export function roundedNumberString(value, decimals) {
    const result = value.toFixed(decimals);
    if (decimals === 0) {
        return result;
    }
    return result.replace(/\.?0+$/, "");
}
/** @internal */
export function roundWithOffset(value, offset) {
    if (offset === 0) {
        return Math.round(value);
    }
    offset -= offset | 0; // Remove everything before the comma
    if (offset < 0) {
        offset = 1 - offset;
    }
    return Math.round(value - offset) + offset;
    // }
}
//# sourceMappingURL=roundedNumber.js.map