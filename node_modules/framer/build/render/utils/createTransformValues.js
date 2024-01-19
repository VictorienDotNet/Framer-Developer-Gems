function createTransformValues(baseTransform, mode) {
    let { x, y } = baseTransform;
    const { width, height, rotation } = baseTransform;
    if (mode === "resetXYKeepFraction") {
        x = x - Math.floor(x);
        y = y - Math.floor(y);
    }
    else if (mode === "resetXY") {
        x = 0;
        y = 0;
    }
    return { x, y, width, height, rotation };
}
function getTransformMode(isRootVectorNode, includeTransform) {
    if (includeTransform !== undefined) {
        if (includeTransform) {
            return "asIs";
        }
    }
    else {
        if (!isRootVectorNode) {
            return "asIs";
        }
    }
    if (isRootVectorNode) {
        // top level shape
        return "resetXYKeepFraction";
    }
    else {
        return "resetXY";
    }
}
export function transformValues(rect, rotation, isRootVectorNode, includeTransform) {
    const transformMode = getTransformMode(isRootVectorNode, includeTransform);
    const baseTransform = { ...rect, rotation };
    const transform = createTransformValues(baseTransform, transformMode);
    return transform;
}
//# sourceMappingURL=createTransformValues.js.map