import React from "react";
import { StyleSheetContext } from "../render/StyleSheetContext.js";
import * as CSS from "../render/utils/setDocumentStyles.js";
import { isBrowser } from "../utils/environment.js";
if (isBrowser()) {
    // FIXME: this is mostly unnecessary as of https://github.com/framer/FramerStudio/pull/10631
    // because the minification process during SSG will move all the CSS into the <head>.
    // It still matters for a rare occassion when a site failed to be optimized (eg due to SSG errors).
    // Move the SSR-injected <style> tags to <head> to avoid React hydration errors.
    for (const node of document.querySelectorAll("style[data-framer-css-ssr]")) {
        document.head.appendChild(node);
    }
}
// Figure out which elements had their styles server-rendered – and avoid injecting their styles again.
// We’re doing this for a) performance, b) DX (this reduces the number of duplicated styles in DevTools).
// (Using /* #__PURE__ */ to make sure this gets removed from the bundle when `withCSS` is tree-shaken away: https://paper.dropbox.com/doc/Preventing-side-effects-in-library-modules-tree-shaking--BxcI9HHYeVPCEpLgMyyfm40nAg-0nsRQl6w28wgW6KTTX7Tm.)
const componentsWithServerRenderedStyles = /* #__PURE__ */ (() => {
    if (!isBrowser())
        return new Set();
    const componentsWithSSRStylesAttr = document
        .querySelector("style[data-framer-css-ssr-minified]")
        ?.getAttribute("data-framer-components");
    if (!componentsWithSSRStylesAttr)
        return new Set();
    return new Set(componentsWithSSRStylesAttr.split(" "));
})();
export const styleTagSSRMarker = { "data-framer-css-ssr": true };
/**
 * Render a React component with css that will be injected into the document's
 * head when the component is first rendered. The escapedCSS argument can either
 * be a string where each line is a css rule, or an array of css rule strings.
 *
 * @public
 */
export const withCSS = (Component, escapedCSS, 
// This might be `undefined` in older components that got published before https://github.com/framer/FramerStudio/pull/13459
componentSerializationId) => React.forwardRef((props, ref) => {
    const { sheet, cache } = React.useContext(StyleSheetContext) ?? {};
    if (!isBrowser()) {
        const concatenatedCSS = Array.isArray(escapedCSS) ? escapedCSS.join("\n") : escapedCSS;
        return (React.createElement(React.Fragment, null,
            React.createElement("style", { ...styleTagSSRMarker, "data-framer-component": componentSerializationId, dangerouslySetInnerHTML: { __html: concatenatedCSS } }),
            React.createElement(Component, { ...props, ref: ref })));
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useInsertionEffect(() => {
        // If the styles already exist in the head due to SSG, avoid
        // re-adding them to improve hydration performance.
        if (componentSerializationId && componentsWithServerRenderedStyles.has(componentSerializationId))
            return;
        const css = Array.isArray(escapedCSS) ? escapedCSS : escapedCSS.split("\n");
        css.forEach(rule => rule && CSS.injectCSSRule(rule, sheet, cache));
    }, []);
    return React.createElement(Component, { ...props, ref: ref });
});
//# sourceMappingURL=withCSS.js.map