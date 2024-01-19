export function modulate(value, rangeA, rangeB, limit = false) {
    const [fromLow, fromHigh] = rangeA;
    const [toLow, toHigh] = rangeB;
    const fromDelta = fromHigh - fromLow;
    if (fromDelta === 0)
        return (toHigh + toLow) / 2;
    const toDelta = toHigh - toLow;
    if (toDelta === 0)
        return toLow;
    const result = toLow + ((value - fromLow) / fromDelta) * toDelta;
    if (limit === true) {
        if (toLow < toHigh) {
            if (result < toLow) {
                return toLow;
            }
            if (result > toHigh) {
                return toHigh;
            }
        }
        else {
            if (result > toLow) {
                return toLow;
            }
            if (result < toHigh) {
                return toHigh;
            }
        }
    }
    return result;
}
export function isNumeric(value) {
    return !isNaN(value) && isFinite(value);
}
export function percentToFraction(val) {
    const digits = numberFromString(val);
    if (digits !== undefined) {
        if (val.includes("%")) {
            return digits / 100;
        }
        return digits;
    }
    return 0;
}
export function numberFromString(input) {
    const match = input.match(/\d?\.?\d+/);
    return match ? Number(match[0]) : undefined;
}
//# sourceMappingURL=Utils.js.map