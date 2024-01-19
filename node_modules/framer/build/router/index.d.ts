/**
 * @module
 * This module is meant to be used as the entrypoint to import everything `framer` needs from `@framerjs/router`.
 * We need it so we can easily swap private`@framerjs/router` with a stub for Handshake.
 *
 * NOTE: If you re-export some additional API in this file,
 *       please make sure you added a stub version of that API to `./stub.tsx`.
 */
export { ComponentWithPreload, computeRelativePath, getPathForRoute, getRouteElementId, inferInitialRouteFromPath, isRoute, NotFoundError, preloadComponent, Route, RouteId, Router, RouterAPIProvider, RoutesProvider, useCurrentPathVariables, useCurrentRoute, useCurrentRouteId, useLocale, useLocaleCode, useLocaleInfo, useLocalizationInfo, useRouteAnchor, useRouteHandler, useRoutePreloader, useRouter, } from "./stub.js";
export type { ActiveRoute, Locale, LocaleId, LocaleInfo, RouteComponent, RouterAPI, Routes } from "./stub.js";
//# sourceMappingURL=index.d.ts.map