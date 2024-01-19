import { SIZE_COMPATIBILITY_WRAPPER_ATTRIBUTE } from "../../components/hoc/withMeasuredSize.js";
/**
 * @internal
 *
 * Returns a plain array of references to all children, which should be
 * considered for content size calculations on this node (e.g. when running "Fit
 * Content" on it)
 *
 * @param element the element of the component container
 */
export function getMeasurableCodeComponentChildren(element) {
    // Skip over withMeasuredSize compatibility wrapper
    const childrenCollection = element.firstElementChild && element.firstElementChild.hasAttribute(SIZE_COMPATIBILITY_WRAPPER_ATTRIBUTE)
        ? element.firstElementChild.children
        : element.children;
    return [...childrenCollection].filter(isMeasurable).map(unwrapInlinedDisplayContents);
}
/**
 * Rough check if an element of a HTMLCollection has measurable layout (can be
 * rendered as anything other than "display: none") _without_ querying its
 * computed styles, because we want to avoid a style recalculation penalty.
 *
 * @param element an HTMLCollection node
 */
function isMeasurable(element) {
    // Filter out certain HTMLElement subclasses that don't represent measurable elements
    if (element instanceof HTMLBaseElement ||
        element instanceof HTMLHeadElement ||
        element instanceof HTMLLinkElement ||
        element instanceof HTMLMetaElement ||
        element instanceof HTMLScriptElement ||
        element instanceof HTMLStyleElement ||
        element instanceof HTMLTitleElement) {
        return false;
    }
    return element instanceof HTMLElement || element instanceof SVGElement;
}
/**
 * Checks if an element has "display: contents" in its inline styles, and if
 * yes, returns the first measurable descendant. We intentionally _only_ check
 * the inlined display style, because reading it should not cause a style recalc
 * and it covers the use cases we have right now - wrapper divs around smart
 * components.
 *
 * @param element
 * @returns
 */
function unwrapInlinedDisplayContents(element) {
    if (!(element instanceof HTMLElement))
        return element;
    if (element.children.length === 0)
        return element;
    if (element.style.display !== "contents")
        return element;
    const firstMeasurableChild = [...element.children].find(isMeasurable);
    if (firstMeasurableChild) {
        return unwrapInlinedDisplayContents(firstMeasurableChild);
    }
    return element;
}
//# sourceMappingURL=getMeasurableCodeComponentChildren.js.map