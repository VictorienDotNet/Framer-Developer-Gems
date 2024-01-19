function isEmpty(obj) {
    return !obj || (!Object.keys(obj).length && obj.constructor === Object);
}
export function isReactElement(test) {
    return typeof test !== "string" && typeof test !== "number";
}
export function isReactChild(test) {
    return test !== null && typeof test !== "undefined" && typeof test !== "boolean" && !isEmpty(test);
}
//# sourceMappingURL=type-guards.js.map