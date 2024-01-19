/** @public */
export function addFonts(component, fonts) {
    Object.assign(component, { fonts });
}
/** @public */
export function getFonts(component) {
    const fonts = component.fonts;
    return fonts || [];
}
//# sourceMappingURL=addFonts.js.map