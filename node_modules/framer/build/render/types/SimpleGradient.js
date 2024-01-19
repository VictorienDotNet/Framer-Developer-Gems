const simpleGradientKeys = ["start", "end"];
export function isSimpleGradient(value) {
    return value && simpleGradientKeys.every(key => key in value);
}
//# sourceMappingURL=SimpleGradient.js.map