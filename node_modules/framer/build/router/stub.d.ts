/**
 * @module
 * This module provides stubs for the Router API used in Handshake instead of the private Framer Router.
 * */
export type ActiveRoute = any;
export type Route = any;
export type Routes = any;
export type RouteComponent = any;
export type RouteId = string;
export type RouterAPI = any;
export type LocaleId = string;
export interface Locale {
    id: LocaleId;
    code: string;
    name: string;
    slug: string;
}
export interface LocalizationInfo {
    activeLocalization: Locale | null;
    localizations: Locale[];
    setLocalization(locale: Locale): void;
}
export declare function useLocalizationInfo(): LocalizationInfo;
export interface LocaleInfo {
    activeLocale: Locale | null;
    locales: Locale[];
    setLocale(locale: Locale): void;
}
export declare function useLocaleInfo(): LocaleInfo;
export declare function useLocaleCode(): string;
export declare function useLocale(): string;
export declare const ComponentWithPreload: any;
export declare const RoutesProvider: any;
export declare const Router: any;
export declare const RouterAPIProvider: any;
export declare function computeRelativePath(_from: string, _to: string): string;
export declare function isRoute(route: unknown): route is Route;
export declare function getPathForRoute(_route: Route | undefined, _options: any): string;
export declare function getRouteElementId(_route?: Route, _elementId?: string): any;
export declare function useCurrentRoute(): ActiveRoute | undefined;
export declare function useCurrentRouteId(): RouteId | undefined;
export declare function useCurrentPathVariables(): Record<string, unknown> | undefined;
export declare function useRouter(): any;
/**
 * @internal
 */
export declare function useRouteAnchor(_routeId: RouteId, _options?: {
    elementId?: string;
}): any;
/**
 * @internal
 */
export declare function useRouteHandler(_routeId: RouteId, _preload?: boolean, elementId?: string): () => void;
export declare function useRoutePreloader(_routeIds: RouteId[], _enabled?: boolean): void;
/**
 * @internal
 */
export declare function preloadComponent(_component: Route["page"]): void;
export declare function inferInitialRouteFromPath(routes: Routes, locationPath: string, fallback: boolean): undefined;
export declare class NotFoundError extends Error {
}
//# sourceMappingURL=stub.d.ts.map