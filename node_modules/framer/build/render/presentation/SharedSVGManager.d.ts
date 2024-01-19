declare class SharedSVGEntry {
    id: string;
    svg: string;
    innerHTML: string;
    viewBox: string | undefined;
    count: number;
    constructor(id: string, svg: string, innerHTML: string, viewBox: string | undefined, count?: number);
}
/** Complex SVGs are placed once in an invisible div and used as a template for all instances.
 * Notice the manager uses the svg string itself as the key to manage global instances with. */
declare class SharedSVGManager {
    private entries;
    debugGetEntries(): Map<string, SharedSVGEntry>;
    /** Request to render a svg, this will ensure there is a global instance and will return a
     * template referencing the image. Must be balanced with `unsubscribe()` calls using the same
     * svg. If called multiple times while the shared SVG exists, the generateUniqueIds and
     * contentId parameters are ignored. */
    subscribe(svg: string, generateUniqueIds: boolean, contentId: string | null): string;
    /** Returns the viewBox for the svg, or undefined if there is no viewBox. */
    getViewBox(svg: string): string | undefined;
    /** When no longer rendering an svg it must be unsubscribed from so resources can be cleaned up.
     * Pass in the same svg as used with `subscribe()`. */
    unsubscribe(svg: string): void;
    private maybeRemoveEntry;
    private removeDOMElement;
    private createDOMElementFor;
    clear(): void;
    /** Returns a string containing a div#svg-templates and all the current svg templates. Can be
     * used after running `ReactDOMServer.renderToString()` */
    generateTemplates(): string;
}
/**
 * @internal
 */
export declare const sharedSVGManager: SharedSVGManager;
export declare function parseSVG(svg: string): SVGSVGElement | undefined;
export declare function prefixIdsInSVG(svg: SVGSVGElement, prefix: string): void;
/** Tries to return something sensible from the <svg width="X" height="X"> attributes. We use that
 * to give the outer svg a matching viewbox.
 *
 * Note, this is not a perfect solution. Ideally we know our SVGs better and we only use viewBoxes,
 * removed any percentage based sizes, etc. But at least we should be consistent between how canvas,
 * preview, and publish render.
 * */
export declare function getSVGSize(svg: SVGSVGElement): {
    width: number;
    height: number;
} | undefined;
export {};
//# sourceMappingURL=SharedSVGManager.d.ts.map