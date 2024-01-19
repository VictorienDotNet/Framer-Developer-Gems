// Shallow type checkers
export function isFunction(value) {
    return typeof value === "function";
}
export function isBoolean(value) {
    return typeof value === "boolean";
}
export function isString(value) {
    return typeof value === "string";
}
export function isNumber(value) {
    return typeof value === "number" && Number.isFinite(value);
}
export function isArray(value) {
    return Array.isArray(value);
}
export function isObject(value) {
    return value !== null && typeof value === "object" && !isArray(value);
}
export function isUndefined(value) {
    return typeof value === "undefined";
}
export function isValidDate(value) {
    return value instanceof Date && !isNaN(value.getTime());
}
//# sourceMappingURL=utils.js.map