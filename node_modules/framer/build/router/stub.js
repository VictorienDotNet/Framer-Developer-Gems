/* eslint-disable no-console */
/**
 * @module
 * This module provides stubs for the Router API used in Handshake instead of the private Framer Router.
 * */
import React from "react";
export function useLocalizationInfo() {
    return { activeLocalization: null, localizations: [], setLocalization: () => { } };
}
export function useLocaleInfo() {
    return { activeLocale: null, locales: [], setLocale: () => { } };
}
export function useLocaleCode() {
    return "en-US";
}
export function useLocale() {
    return useLocaleCode();
}
export const ComponentWithPreload = stubbedComponent("ComponentWithPreload");
export const RoutesProvider = stubbedComponent("RoutesProvider");
export const Router = stubbedComponent("Router");
export const RouterAPIProvider = stubbedComponent("RouterAPIProvider");
export function computeRelativePath(_from, _to) {
    return "";
}
export function isRoute(route) {
    return false;
}
export function getPathForRoute(_route, _options) {
    return "/";
}
export function getRouteElementId(_route, _elementId) {
    return undefined;
}
export function useCurrentRoute() {
    return undefined;
}
export function useCurrentRouteId() {
    return undefined;
}
export function useCurrentPathVariables() {
    return undefined;
}
export function useRouter() {
    return {
        navigate(_routeId, _elementId, _pathVariables) { },
        getRoute(_routeId) {
            return undefined;
        },
        currentRouteId: "",
    };
}
/**
 * @internal
 */
export function useRouteAnchor(_routeId, _options = {}) {
    return { onClick: () => { }, href: "#" };
}
/**
 * @internal
 */
export function useRouteHandler(_routeId, _preload = false, elementId) {
    return () => { };
}
export function useRoutePreloader(_routeIds, _enabled = true) {
    return;
}
/**
 * @internal
 */
export function preloadComponent(_component) {
    return;
}
export function inferInitialRouteFromPath(routes, locationPath, fallback) {
    return undefined;
}
function stubbedComponent(componentName) {
    return ({ children }) => {
        console.warn(`Using stubbed \`${componentName}\``);
        return React.createElement(React.Fragment, null, children);
    };
}
export class NotFoundError extends Error {
}
//# sourceMappingURL=stub.js.map