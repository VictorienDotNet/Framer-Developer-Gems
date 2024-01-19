import { computeRelativePath, getRouteElementId, isRoute } from "../router/index.js";
import { isString } from "../utils/utils.js";
import { parseFramerPageLink } from "./framerPageLink.js";
import { linkFromFramerPageLink, linkMatchesRoute, pathVariablesRegExp } from "./Link.js";
const htmlRegExp = /[&<>'"]/g;
/**
 * Escape html characters that would result in invalid paths.
 * https://www.30secondsofcode.org/js/s/escape-html
 */
const escapeHTML = (str) => str.replace(htmlRegExp, tag => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
}[tag] || tag));
/** A regex that searches for html tags, and href values. */
const regex = /(<([a-z]+)(?:\s+(?!href[\s=])[^=\s]+=(?:'[^']*'|"[^"]*"))*)(?:(\s+href\s*=)(?:'([^']*)'|"([^"]*)"))?((?:\s+[^=\s]+=(?:'[^']*'|"[^"]*"))*>)/gi;
/**
 * @internal @deprecated
 */
export function replaceFramerPageLinks(rawHTML, getRoute, currentRoute, implicitPathVariables) {
    return rawHTML.replace(regex, (original, pre1, tag, pre2, value1, value2, post) => {
        if (tag.toLowerCase() !== "a")
            return original;
        const href = value1 || value2;
        const pageLink = parseFramerPageLink(href.replace(/&amp;/g, "&"));
        if (!pageLink || !pageLink.target)
            return original;
        const targetRoute = getRoute(pageLink.target);
        if (!isRoute(targetRoute) || !isRoute(currentRoute))
            return original;
        const targetPath = targetRoute.path;
        const currentPath = currentRoute.path;
        if (!targetPath || !currentPath)
            return original;
        let attributes = ` ${"data-framer-page-link-target" /* PageLinkAttribute.Page */}="${pageLink.target}"`;
        const elementId = getRouteElementId(targetRoute, pageLink.element ?? undefined);
        if (elementId) {
            attributes += ` ${"data-framer-page-link-element" /* PageLinkAttribute.Element */}="${pageLink.element}"`;
        }
        const link = linkFromFramerPageLink(href);
        if (!link || isString(link))
            return original;
        if (linkMatchesRoute(currentRoute, link, implicitPathVariables)) {
            attributes += ` ${"data-framer-page-link-current" /* PageLinkAttribute.Current */}`;
        }
        let relativePath = targetPath;
        const pathVariables = Object.assign({}, implicitPathVariables, pageLink.collectionItem?.pathVariables);
        if (Object.keys(pathVariables).length > 0) {
            relativePath = relativePath.replace(pathVariablesRegExp, (_, key) => "" + pathVariables[key]);
        }
        if (pageLink.collectionItem?.pathVariables) {
            // Since implicit path variables will be provided when
            // navigating this link, we don't want to use the merged path
            // variables.
            const params = new URLSearchParams(pageLink.collectionItem.pathVariables);
            attributes += ` ${"data-framer-page-link-path-variables" /* PageLinkAttribute.PathVariables */}="${params}"`;
        }
        // TODO: For complete correctness, currentPath should also have its path variables filled in.
        relativePath = computeRelativePath(currentPath, relativePath);
        return (pre1 + pre2 + `"${escapeHTML(relativePath + (elementId ? `#${elementId}` : ""))}"` + attributes + post);
    });
}
//# sourceMappingURL=replaceFramerPageLinks.js.map