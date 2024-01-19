const defaultCache = new Set();
let defaultSheet;
/**
 * Add CSS to the document.
 *
 * @param cssRule - CSS rule to add to the document
 */
export function injectCSSRule(cssRule, sheet, cache = defaultCache) {
    if (!cssRule || cache.has(cssRule) || typeof document === "undefined")
        return;
    cache.add(cssRule);
    if (!sheet) {
        if (!defaultSheet) {
            const styleElement = document.createElement("style");
            styleElement.setAttribute("type", "text/css");
            styleElement.setAttribute("data-framer-css", "true");
            // document.head technically may in fact be null:
            // https://html.spec.whatwg.org/multipage/dom.html#dom-document-head-dev
            if (!document.head) {
                // eslint-disable-next-line no-console
                console.warn("not injecting CSS: the document is missing a <head> element");
                return;
            }
            document.head.appendChild(styleElement);
            if (styleElement.sheet) {
                defaultSheet = styleElement.sheet;
            }
            else {
                // eslint-disable-next-line no-console
                console.warn("not injecting CSS: injected <style> element does not have a sheet", styleElement);
                return;
            }
        }
        sheet = defaultSheet;
    }
    try {
        sheet.insertRule(cssRule, sheet.cssRules.length);
    }
    catch {
        // Assume that errors are from malformed rules, or rules that are not
        // valid in the current browser, and swallow the error.
        //
        // For example, `input[type="range"]::-moz-range-thumb` will error in
        // Chrome, but not Firefox.
    }
}
//# sourceMappingURL=setDocumentStyles.js.map