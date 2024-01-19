/** @internal */
export function collectBlendingFromProps(node, style) {
    if (!node.blendingMode || node.blendingMode === "normal")
        return;
    style.mixBlendMode = node.blendingMode;
}
//# sourceMappingURL=Blending.js.map