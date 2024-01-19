export const clamp = (value, a, b) => {
    const min = Math.min(a, b);
    const max = Math.max(a, b);
    if (value < min) {
        value = min;
    }
    if (value > max) {
        value = max;
    }
    return value;
};
//# sourceMappingURL=math.js.map