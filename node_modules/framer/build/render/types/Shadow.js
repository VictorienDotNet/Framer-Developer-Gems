const shadowKeys = ["color", "x", "y", "blur"];
/** @public */
export const Shadow = {
    is: (shadow) => {
        return shadow && shadowKeys.every(key => key in shadow);
    },
};
const boxShadowKeys = ["x", "y", "color", "inset", "blur", "spread"];
/** @public */
export const BoxShadow = {
    is: (shadow) => {
        return shadow && boxShadowKeys.every(key => key in shadow);
    },
    toCSS: (shadow) => {
        const inset = shadow.inset ? "inset " : "";
        return `${inset}${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.spread}px ${shadow.color}`;
    },
};
//# sourceMappingURL=Shadow.js.map