/**
 * The `RenderTarget` represents the current environment in which a component
 * is running. This is most commonly either the editor canvas in Framer or in
 * the generated preview window.
 *
 * @remarks
 * Code components can use the `RenderTarget.current()` method to check for
 * the environment within their components and vary rendering accordingly. The
 * most common case would be to improve performance while rendering in the
 * Framer canvas where components that take too long to render will be replaced
 * with a placeholder. The `RenderTarget.hasRestrictions()` method can be used
 * to check explicitly for this case.
 *
 * @public
 */
export declare enum RenderTarget {
    /**
     * The component is to be rendered for the Framer canvas.
     *
     * @remarks
     * ```jsx
     * function App() {
     *   if (RenderTarget.current() === RenderTarget.canvas) {
     *     return <CanvasComponent />
     *   }
     *   return <DefaultComponent />
     * }
     * ```
     */
    canvas = "CANVAS",
    /**
     * The component is to be rendered for export.
     *
     * @remarks
     * ```jsx
     * function App() {
     *   if (RenderTarget.current() === RenderTarget.export) {
     *     return <ExportComponent />
     *   }
     *   return <DefaultComponent />
     * }
     * ```
     */
    export = "EXPORT",
    /**
     * The component is to be rendered as a preview thumbnail, for example in the
     * component panel.
     *
     * @remarks
     * ```jsx
     * function App() {
     *   if (RenderTarget.current() === RenderTarget.thumbnail) {
     *     return <Thumbnail />
     *   }
     *   return <DefaultComponent />
     * }
     * ```
     */
    thumbnail = "THUMBNAIL",
    /**
     * The component is being rendered in the preview window.
     *
     * @remarks
     * ```jsx
     * function App() {
     *   React.useEffect(() => {
     *     if (RenderTarget.current() === RenderTarget.preview) {
     *       // Do something in preview.
     *     }
     *   })
     *   return <DefaultComponent />
     * }
     * ```
     */
    preview = "PREVIEW"
}
/**
 * @internal
 */
export interface RenderEnvironment {
    imageBaseURL: string;
    target: RenderTarget;
    zoom: number;
}
/**
 * @internal
 */
export declare const RenderEnvironment: RenderEnvironment;
/**
 * This is used to temporarily execute a task in a different render environment (for example during export)
 * @internal
 */
export declare function executeInRenderEnvironment<T>(customEnvironment: Partial<RenderEnvironment>, task: () => T): T;
/**
 * This function sets the global render environment Framer Core uses to render.
 * Because it sets global state, there should be only one thing responsable for calling it in every react app (e.g. Vekter and Preview)
 * @internal
 */
export declare function setGlobalRenderEnvironment(environment: Partial<RenderEnvironment>): void;
/**
 * @internal
 */
export declare function useRenderEnvironment(target: RenderTarget, imageBaseURL: string, zoom: number): {
    willChangeElements: boolean;
};
/**
 * @privateRemarks
 * This is a read-only equivalent of RenderEnvironment.target that is exposed
 * to components for context-dependent rendering
 * @public
 */
export declare namespace RenderTarget {
    /**
     * Returns the current `RenderTarget` allowing components to apply
     * different behaviors depending on the environment.
     *
     * @remarks
     * ```jsx
     * function App() {
     *   if (RenderTarget.current() === RenderTarget.thumbnail) {
     *     return <PreviewIcon />
     *   }
     *   return <Frame>...</Frame>
     * }
     * ```
     */
    function current(): RenderTarget;
    /**
     * Returns true if the current `RenderTarget` has performance restrictions.
     * Use this to avoid doing heavy work in these contexts because they may
     * bail on the rendering if the component takes too long.
     *
     * @remarks
     * ```jsx
     * function App() {
     *   if (RenderTarget.hasRestrictions()) {
     *     return <SomePlaceholder />
     *   }
     *   return <RichPreviewContent />
     * }
     * ```
     */
    function hasRestrictions(): boolean;
}
//# sourceMappingURL=RenderEnvironment.d.ts.map