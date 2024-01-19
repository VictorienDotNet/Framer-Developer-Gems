import { isString } from "../utils/utils.js";
const elementKey = "element";
const collectionKey = "collection";
const collectionItemIdKey = "collectionItemId";
const pathVariablesKey = "pathVariables";
// This includes the comma that separates the media type from the data.
const mediaType = "framer/page-link,";
/**
 * @internal
 * @deprecated
 */
export function isFramerPageLink(value) {
    return isString(value) && value.startsWith(`data:${mediaType}`);
}
/**
 * @internal
 * @deprecated
 */
export function createFramerPageLink(targetId = null, options = {}) {
    const target = targetId ? targetId : "none";
    const link = new URL(`data:${mediaType}${target}`);
    if (options.element) {
        link.searchParams.append(elementKey, options.element);
    }
    if (options.collectionItem) {
        link.searchParams.append(collectionKey, options.collectionItem.collection);
        link.searchParams.append(collectionItemIdKey, options.collectionItem.collectionItemId);
        link.searchParams.append(pathVariablesKey, new URLSearchParams(options.collectionItem.pathVariables).toString());
    }
    return link.href;
}
/**
 * @internal
 * @deprecated
 */
export function parseFramerPageLink(link) {
    if (!isFramerPageLink(link))
        return;
    try {
        const url = new URL(link);
        const target = url.pathname.substring(mediaType.length);
        const searchParams = url.searchParams;
        const element = searchParams.has(elementKey) ? searchParams.get(elementKey) : undefined;
        let collectionItem;
        const collection = searchParams.get(collectionKey);
        const collectionItemId = searchParams.get(collectionItemIdKey);
        const pathVariablesValue = searchParams.get(pathVariablesKey);
        if (collection && collectionItemId && pathVariablesValue) {
            const pathVariables = Object.fromEntries(new URLSearchParams(pathVariablesValue).entries());
            collectionItem = {
                collection,
                collectionItemId,
                pathVariables,
            };
        }
        return {
            target: target === "none" ? null : target,
            /**
             * For historical reason we used to set "element=none" into the
             * datalink, we no longer do that today, but we still keep this code
             * so we could parse legacy links correctly.
             */
            element: element === "none" ? undefined : element,
            collectionItem,
        };
    }
    catch {
        return;
    }
}
/**
 * @internal
 * @deprecated
 */
export function shouldOpenLinkInNewTab(link) {
    return !isFramerPageLink(link);
}
/** @internal @deprecated */
export function navigateFromAttributes(navigate, element, implicitPathVariables) {
    // These attributes are set by `replaceFramerPageLinks`.
    let routeId = element.getAttribute("data-framer-page-link-target" /* PageLinkAttribute.Page */);
    let elementId;
    let pathVariables;
    if (routeId) {
        elementId = element.getAttribute("data-framer-page-link-element" /* PageLinkAttribute.Element */) ?? undefined;
        const pathVariablesRaw = element.getAttribute("data-framer-page-link-path-variables" /* PageLinkAttribute.PathVariables */);
        if (pathVariablesRaw) {
            pathVariables = Object.fromEntries(new URLSearchParams(pathVariablesRaw).entries());
        }
    }
    else {
        // Just in case for some reason the link on the element wasn't resolved, try to parse it.
        const href = element.getAttribute("href");
        if (!href)
            return false;
        const link = parseFramerPageLink(href);
        if (!link || !link.target)
            return false;
        routeId = link.target;
        elementId = link.element ?? undefined;
        pathVariables = link.collectionItem?.pathVariables;
    }
    const smoothScroll = elementId ? element.dataset.framerSmoothScroll !== undefined : undefined;
    navigate(routeId, elementId, Object.assign({}, implicitPathVariables, pathVariables), smoothScroll);
    return true;
}
//# sourceMappingURL=framerPageLink.js.map