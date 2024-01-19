import React from "react";
import { ActiveRoute, RouterAPI } from "../router/index.js";
interface LinkToWebPage {
    webPageId: string;
    hash?: string;
    pathVariables?: Record<string, string>;
    hashVariables?: Record<string, string>;
}
/**
 * Convert a framer page link string into the same shape as a ComplexLink from
 * Vekter.
 *
 * @internal
 */
export declare function linkFromFramerPageLink(link: string | undefined): LinkToWebPage | string | undefined;
export declare const pathVariablesRegExp: RegExp;
/** @internal */
export declare const PathVariablesContext: React.Context<Record<string, unknown> | undefined>;
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
export declare function useImplicitPathVariables(): Record<string, unknown> | undefined;
/**
 * @param route The current route to compare against.
 * @param link The link that may point at the current page.
 * @param implicitPathVariables Path variables that will be used by default if
 * not explicitly defined in the link.
 */
export declare function linkMatchesRoute(route: ActiveRoute, { webPageId, hash, pathVariables }: LinkToWebPage, implicitPathVariables?: Record<string, unknown>): boolean;
/**
 * @internal
 */
export declare function useLinkMatchesRoute(link: unknown): boolean;
export interface LinkProps {
    href: string | LinkToWebPage | undefined;
    /**
     * Which browsing context to display the linked URL. If not provided, the
     * Link component will only open the link in a new tab if the href is an
     * external URL.
     */
    openInNewTab?: boolean;
    smoothScroll?: boolean;
}
export interface PropsAddedByLink {
    href?: string;
    target?: string;
    rel?: string;
    onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
    "data-framer-page-link-current"?: true | undefined;
}
/** @internal */
export declare enum AnchorLinkTarget {
    _blank = "_blank",
    _self = "_self"
}
type LinkAttributes = Pick<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "rel" | "target">;
export declare function propsForLink(href: string, openInNewTab?: boolean | undefined): LinkAttributes;
type Props = React.PropsWithChildren<LinkProps> & React.RefAttributes<unknown>;
/** @public */
export declare const Link: React.ForwardRefExoticComponent<Pick<Props, "key" | "children" | keyof LinkProps> & React.RefAttributes<unknown>>;
/** @public */
export declare function resolveLink(href: LinkToWebPage | string | undefined, router: Partial<RouterAPI>, implicitPathVariables?: Record<string, unknown>): string | undefined;
/** @public */
export declare function resolvePageScope(pageLink: LinkToWebPage, router: Partial<RouterAPI>): string | undefined;
export {};
//# sourceMappingURL=Link.d.ts.map