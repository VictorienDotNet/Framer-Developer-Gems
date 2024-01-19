/**
 * Combine values and create a className string. Falsy values are not included.
 *
 * This helper is commonly exported by css-in-js libraries like Linaria, or
 * Emotion as cx. This is the implementation from Linaria:
 * https://github.com/callstack/linaria/blob/master/packages/core/src/cx.ts.
 *
 * We need it here so we can use it in es-modules.
 *
 * @public
 */
export function cx(...classNames) {
    return classNames.filter(Boolean).join(" ");
}
//# sourceMappingURL=cx.js.map