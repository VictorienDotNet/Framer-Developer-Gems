import type { RouterAPI } from "../router/index.js";
/**
 * @internal
 * @deprecated
 */
export interface FramerPageLinkCollectionItemAttribute {
    collection: string;
    collectionItemId: string;
    pathVariables: Record<string, string>;
}
/**
 * @internal
 * @deprecated
 */
export interface FramerPageLinkAttributes {
    element?: string | null;
    collectionItem?: FramerPageLinkCollectionItemAttribute;
}
declare const mediaType = "framer/page-link,";
/**
 * @internal
 * @deprecated
 */
export type FramerLink = `data:${typeof mediaType}${string}`;
/**
 * @internal
 * @deprecated
 */
export declare function isFramerPageLink(value: unknown): value is FramerLink;
/**
 * @internal
 * @deprecated
 */
export declare function createFramerPageLink(targetId?: string | null, options?: FramerPageLinkAttributes): string;
/**
 * @internal
 * @deprecated
 */
export interface PageLinkParsedResult {
    target: string | null;
    element: string | null | undefined;
    collectionItem: FramerPageLinkCollectionItemAttribute | undefined;
}
/**
 * @internal
 * @deprecated
 */
export declare function parseFramerPageLink(link: unknown): PageLinkParsedResult | undefined;
/**
 * @internal
 * @deprecated
 */
export declare function shouldOpenLinkInNewTab(link: unknown): boolean;
/**
 * @internal
 * @deprecated
 */
export declare const enum PageLinkAttribute {
    Page = "data-framer-page-link-target",
    Element = "data-framer-page-link-element",
    PathVariables = "data-framer-page-link-path-variables",
    Current = "data-framer-page-link-current"
}
/** @internal @deprecated */
export declare function navigateFromAttributes(navigate: RouterAPI["navigate"], element: HTMLAnchorElement, implicitPathVariables?: Record<string, unknown>): boolean;
export {};
//# sourceMappingURL=framerPageLink.d.ts.map