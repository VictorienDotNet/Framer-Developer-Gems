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
export var RenderTarget;
(function (RenderTarget) {
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
    RenderTarget["canvas"] = "CANVAS";
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
    RenderTarget["export"] = "EXPORT";
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
    RenderTarget["thumbnail"] = "THUMBNAIL";
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
    RenderTarget["preview"] = "PREVIEW";
})(RenderTarget || (RenderTarget = {}));
/**
 * @internal
 */
export const RenderEnvironment = {
    imageBaseURL: "",
    target: RenderTarget.preview,
    zoom: 1,
};
/**
 * This is used to temporarily execute a task in a different render environment (for example during export)
 * @internal
 */
export function executeInRenderEnvironment(customEnvironment, task) {
    // Copy currentEnvironment
    const previousEnvironment = Object.assign({}, RenderEnvironment);
    // Set the customEnvironment to the current environment
    Object.assign(RenderEnvironment, customEnvironment);
    const result = task();
    // Reset the previous environment back on the currentEnvironment
    Object.assign(RenderEnvironment, previousEnvironment);
    return result;
}
/**
 * This function sets the global render environment Framer Core uses to render.
 * Because it sets global state, there should be only one thing responsable for calling it in every react app (e.g. Vekter and Preview)
 * @internal
 */
export function setGlobalRenderEnvironment(environment) {
    Object.assign(RenderEnvironment, environment);
}
/**
 * @internal
 */
export function useRenderEnvironment(target, imageBaseURL, zoom) {
    let willChangeElements = false;
    if (RenderEnvironment.imageBaseURL !== imageBaseURL) {
        RenderEnvironment.imageBaseURL = imageBaseURL;
        willChangeElements = true;
    }
    if (RenderEnvironment.target !== target) {
        RenderEnvironment.target = target;
        willChangeElements = true;
    }
    if (RenderEnvironment.zoom !== zoom) {
        RenderEnvironment.zoom = zoom;
    }
    return { willChangeElements };
}
/**
 * @privateRemarks
 * This is a read-only equivalent of RenderEnvironment.target that is exposed
 * to components for context-dependent rendering
 * @public
 */
(function (RenderTarget) {
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
    function current() {
        return RenderEnvironment.target;
    }
    RenderTarget.current = current;
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
    function hasRestrictions() {
        const target = RenderEnvironment.target;
        if (target === RenderTarget.canvas)
            return true;
        if (target === RenderTarget.export)
            return true;
        return false;
    }
    RenderTarget.hasRestrictions = hasRestrictions;
})(RenderTarget || (RenderTarget = {}));
//# sourceMappingURL=RenderEnvironment.js.map