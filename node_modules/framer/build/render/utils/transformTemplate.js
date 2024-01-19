/** @public */
export function transformTemplate(center) {
    return (_, generated) => {
        if (center === true) {
            return `translate(-50%, -50%) ${generated}`;
        }
        else {
            if (center === "x") {
                return `translateX(-50%) ${generated}`;
            }
            else if (center === "y") {
                return `translateY(-50%) ${generated}`;
            }
        }
        return generated || "none";
    };
}
//# sourceMappingURL=transformTemplate.js.map