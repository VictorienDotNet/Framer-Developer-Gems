import { warnOnce } from "./warnOnce.js";
export function deprecationWarning(removedItem, removalVersion, replacement) {
    const replacementText = replacement ? `, use ${replacement} instead` : "";
    const warningText = `Deprecation warning: ${removedItem} will be removed in version ${removalVersion}${replacementText}.`;
    warnOnce(warningText);
}
//# sourceMappingURL=deprecation.js.map