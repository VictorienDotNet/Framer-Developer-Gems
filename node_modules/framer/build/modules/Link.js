import React from "react";
import { findAnchorElement } from "../render/utils/findAnchorElement.js";
import { getPathForRoute, inferInitialRouteFromPath, preloadComponent, useCurrentRoute, useRouter, } from "../router/index.js";
import { assert } from "../utils/assert.js";
import { isString } from "../utils/utils.js";
import { isFramerPageLink, parseFramerPageLink } from "./framerPageLink.js";
const linkKey = "webPageId";
function isLinkToWebPage(link) {
    return Boolean(link && typeof link === "object" && linkKey in link);
}
function createVariablesFromPageLinkCollectionItem(collectionItem) {
    if (!collectionItem)
        return undefined;
    const variables = {};
    for (const pathVariablesKey in collectionItem.pathVariables) {
        const value = collectionItem.pathVariables[pathVariablesKey];
        if (value)
            variables[pathVariablesKey] = value;
    }
    return variables;
}
/**
 * Convert a framer page link string into the same shape as a ComplexLink from
 * Vekter.
 *
 * @internal
 */
export function linkFromFramerPageLink(link) {
    if (!isFramerPageLink(link))
        return link;
    const parsed = parseFramerPageLink(link);
    if (!parsed)
        return undefined;
    const { target, element, collectionItem } = parsed;
    if (!target)
        return undefined;
    return {
        webPageId: target,
        hash: element ?? undefined,
        pathVariables: createVariablesFromPageLinkCollectionItem(collectionItem),
    };
}
// Note: This regular expression should match all other places in our code base.
export const pathVariablesRegExp = /:([a-zA-Z][a-zA-Z0-9_]*)/g;
/** @internal */
export const PathVariablesContext = React.createContext(undefined);
/**
 * Implicit path variables (defaults to use for links) are provided…
 *
 * - via the PathVariablesContext, for use with repeaters
 *
 *   e.g. a link to /blog/:slug, repeated multiple times with different :slug
 *   variables
 *
 * - via the current dynamic page
 *
 *   e.g. a page links to itself (permalink? scroll target?)
 *
 * XXX: You never know which route these path variables are intended for, so
 * it's possible to have a mismatch. Should this hook accept a route ID?
 *
 * @internal
 */
export function useImplicitPathVariables() {
    const contextPathVariables = React.useContext(PathVariablesContext);
    const currentPathVariables = useCurrentRoute()?.pathVariables;
    const pathVariables = contextPathVariables || currentPathVariables;
    return pathVariables;
}
/**
 * @param route The current route to compare against.
 * @param link The link that may point at the current page.
 * @param implicitPathVariables Path variables that will be used by default if
 * not explicitly defined in the link.
 */
export function linkMatchesRoute(route, { webPageId, hash, pathVariables }, implicitPathVariables) {
    if (webPageId !== route.id)
        return false;
    // If we allowed page links to be active when they had an element, all page
    // links that were to an element on the current page would always be active.
    // We don't want that, so for now, we ignore links with elements. In future,
    // maybe we can build a feature so that links to an element on the current
    // page are only active when the element is in view.
    if (hash)
        return false;
    // If there's path variables provided via a context, we should only return
    // true when the context matches the path variable in the current route.
    if (route.path && route.pathVariables) {
        const combinedPathVariable = Object.assign({}, implicitPathVariables, pathVariables);
        for (const [, key] of route.path.matchAll(pathVariablesRegExp)) {
            if (!key)
                return false;
            if (route.pathVariables[key] !== combinedPathVariable[key]) {
                return false;
            }
        }
    }
    return true;
}
/**
 * @internal
 */
export function useLinkMatchesRoute(link) {
    const route = useCurrentRoute();
    const contextPathVariables = React.useContext(PathVariablesContext);
    if (!route)
        return false;
    const pageLink = isString(link) ? linkFromFramerPageLink(link) : link;
    return isLinkToWebPage(pageLink) ? linkMatchesRoute(route, pageLink, contextPathVariables) : false;
}
function isInternalURL(href) {
    if (href === undefined)
        return false;
    if (href.startsWith("#") || href.startsWith("/") || href.startsWith("."))
        return true;
    return false;
}
function isValidURL(href, isInternal) {
    try {
        const url = new URL(href);
        return Boolean(url.protocol); // in theory this should always be true, but just in case?
    }
    catch {
        // Ignore thrown errors.
    }
    return isInternal;
}
/** @internal */
export var AnchorLinkTarget;
(function (AnchorLinkTarget) {
    AnchorLinkTarget["_blank"] = "_blank";
    AnchorLinkTarget["_self"] = "_self";
})(AnchorLinkTarget || (AnchorLinkTarget = {}));
function getTargetAttrValue(openInNewTab, isInternal) {
    if (openInNewTab !== undefined) {
        // `_self` is the browser default, we can just omit the attribute
        return openInNewTab ? AnchorLinkTarget._blank : undefined;
    }
    // If the target prop is not set, fallback to the default behavior based on the link
    return isInternal ? undefined : AnchorLinkTarget._blank;
}
export function propsForLink(href, openInNewTab = undefined) {
    const isInternal = isInternalURL(href);
    const anchorTarget = getTargetAttrValue(openInNewTab, isInternal);
    return {
        href: isValidURL(href, isInternal) ? href : `https://${href}`,
        target: anchorTarget,
        rel: !isInternal ? "noopener" : undefined,
    };
}
function createOnClickLinkHandler(router, routeId, elementId, combinedPathVariables, smoothScroll) {
    return (event) => {
        // If command is pressed when clicking a link we want to open a new tab instead
        if (event.metaKey)
            return;
        /**
         * Note: in the preview iframe we hijack all anchor link
         * clicks and modify the target based on the href, so that
         * we won't try to open an external links in the preview
         * iframe, for example. (see PreviewRenderer.tsx)
         */
        // We don't need SPA routing when opening links in a new tab
        const anchorElement = findAnchorElement(event.target);
        if (!anchorElement || anchorElement.getAttribute("target") === AnchorLinkTarget._blank)
            return;
        event.preventDefault();
        router.navigate?.(routeId, elementId, combinedPathVariables, smoothScroll);
    };
}
function propsForRoutePath(href, openInNewTab, router, currentRoute, implicitPathVariables, smoothScroll) {
    const isInternal = isInternalURL(href);
    if (!router.routes || !router.getRoute || !currentRoute || !isInternal) {
        return propsForLink(href, openInNewTab);
    }
    try {
        const [pathname, hash] = href.split("#", 2);
        assert(pathname !== undefined, "A href must have a defined pathname.");
        const { routeId, pathVariables } = inferInitialRouteFromPath(router.routes, pathname);
        const route = router.getRoute(routeId);
        if (route) {
            preloadComponent(route.page);
            const combinedPathVariables = Object.assign({}, implicitPathVariables, pathVariables);
            // Make the link relative to the current path if we can.
            const path = getPathForRoute(route, {
                currentRoutePath: currentRoute.path,
                // The hash value is already fully resolved so we don't need to
                // provide any hashVariables.
                hash: hash || undefined,
                pathVariables: combinedPathVariables,
            });
            const anchorTarget = getTargetAttrValue(openInNewTab, true);
            return {
                href: path,
                target: anchorTarget,
                onClick: createOnClickLinkHandler(router, routeId, hash || undefined, combinedPathVariables, smoothScroll),
            };
        }
    }
    catch {
        // Fall through, we could not match the path to a path defined in our
        // routes. We will assume the href is an external link.
    }
    return propsForLink(href, openInNewTab);
}
/** @public */
export const Link = /* @__PURE__ */ React.forwardRef(({ children, href, openInNewTab, smoothScroll, ...restProps }, forwardedRef) => {
    const router = useRouter();
    const currentRoute = useCurrentRoute();
    const implicitPathVariables = useImplicitPathVariables();
    const props = React.useMemo(() => {
        if (!href)
            return {};
        const pageLink = isLinkToWebPage(href) ? href : linkFromFramerPageLink(href);
        if (!pageLink)
            return {};
        if (isString(pageLink)) {
            return propsForRoutePath(pageLink, openInNewTab, router, currentRoute, implicitPathVariables, smoothScroll);
        }
        const { webPageId, hash, pathVariables, hashVariables } = pageLink;
        const route = router.getRoute?.(webPageId);
        if (route)
            preloadComponent(route.page);
        const combinedPathVariable = Object.assign({}, implicitPathVariables, pathVariables);
        const combinedHashVariable = Object.assign({}, implicitPathVariables, hashVariables);
        const anchorTarget = getTargetAttrValue(openInNewTab, true);
        const resolvedHref = getPathForRoute(route, {
            currentRoutePath: currentRoute?.path,
            hash,
            pathVariables: combinedPathVariable,
            hashVariables: combinedHashVariable,
        });
        const resolvedHash = resolvedHref.split("#", 2)[1];
        return {
            href: resolvedHref,
            target: anchorTarget,
            onClick: createOnClickLinkHandler(router, webPageId, resolvedHash, combinedPathVariable, smoothScroll),
            "data-framer-page-link-current": (currentRoute && linkMatchesRoute(currentRoute, pageLink, implicitPathVariables)) || undefined,
        };
    }, [currentRoute, href, openInNewTab, implicitPathVariables, router, smoothScroll]);
    if (!children)
        return null;
    const child = React.Children.only(children);
    if (!React.isValidElement(child))
        return null;
    // Ensure that we only overwrite a child's ref if we are specifically
    // forwarding a provided ref. A forwardedRef can be provided if a
    // CodeComponent with slots that are links tries to provide refs.
    return React.cloneElement(child, { ...restProps, ...props, ref: forwardedRef ?? restProps.ref });
});
/** @public */
export function resolveLink(href, router, implicitPathVariables) {
    // Parsing framer page links means this function is stuck in library.
    const pageLink = isLinkToWebPage(href) ? href : linkFromFramerPageLink(href);
    if (!isLinkToWebPage(pageLink))
        return isString(href) ? propsForLink(href).href : undefined;
    // Bail out, we can't convert an object to a string path.
    if (!router.getRoute || !router.currentRouteId)
        return undefined;
    const currentRoute = router.getRoute(router.currentRouteId);
    const { webPageId, hash, pathVariables, hashVariables } = pageLink;
    const route = router.getRoute(webPageId);
    const combinedPathVariables = Object.assign({}, router.currentPathVariables, implicitPathVariables, pathVariables);
    const combinedHashVariables = Object.assign({}, router.currentPathVariables, implicitPathVariables, hashVariables);
    return getPathForRoute(route, {
        currentRoutePath: currentRoute?.path,
        hash,
        pathVariables: combinedPathVariables,
        hashVariables: combinedHashVariables,
        relative: false,
    });
}
/** @public */
export function resolvePageScope(pageLink, router) {
    // Bail out, we can't convert an object to a string path.
    if (!router.getRoute || !router.currentRouteId)
        return undefined;
    const currentRoute = router.getRoute(router.currentRouteId);
    const { webPageId } = pageLink;
    const route = router.getRoute(webPageId);
    return getPathForRoute(route, {
        currentRoutePath: currentRoute?.path,
        relative: false,
    });
}
//# sourceMappingURL=Link.js.map