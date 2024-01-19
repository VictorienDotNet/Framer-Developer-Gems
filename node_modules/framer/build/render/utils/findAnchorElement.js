/**
 * Search the closest anchor element ancestor of the given target.
 * @param target The starting element.
 * @param withinElement If an element is given, the search will stop when it
 * hits the element. Otherwise, it will try to get the closest anchor element.
 */
export function findAnchorElement(target, withinElement) {
    if (target instanceof HTMLAnchorElement) {
        return target;
    }
    if (target instanceof Element) {
        if (target === withinElement) {
            return null;
        }
        return findAnchorElement(target.parentElement, withinElement);
    }
    return null;
}
//# sourceMappingURL=findAnchorElement.js.map