import React from "react";
/**
 * @internal
 */
export interface GetLayoutId {
    id?: string;
    name?: string;
    duplicatedFrom?: string[];
}
/**
 * @internal
 */
export declare const LayoutIdContext: React.Context<{
    getLayoutId: (args: GetLayoutId) => string | null;
    persistLayoutIdCache: () => void;
    /**
     * Sometimes we overwrite getLayoutId to always return null, to prevent
     * layoutId generation for descendents. If we want to re-enable that
     * layoutId generation later in the tree, we need a reference to the
     * original function to restore.
     */
    top: boolean;
    enabled?: boolean | undefined;
}>;
/**
 * @internal
 */
export declare function LayoutIdProvider({ children }: {
    children: React.ReactNode;
}): JSX.Element;
/**
 * Enable or disable the automatic generation of layout ids for canvas layers.
 * By default layout ids are generated for all layers created on the Framer
 * canvas. However, layout ids are not generated for any layer that is a
 * descendant of a code component. Sometimes you will want to enable layout id
 * generation for descendants of your code components when they use children,
 * slots, or import design components, and you want those layers to animate with
 * magic motion transitions.
 *
 * You can enable that behavior by wrapping your code component like this
 * ```typescript
 * <AutomaticLayoutIds enabled>
 *  <YourComponent/>
 * </AutomaticLayoutIds>
 * ```
 * @public
 */
export declare function AutomaticLayoutIds({ enabled, ...props }: React.PropsWithChildren<{
    enabled?: boolean;
}>): JSX.Element;
//# sourceMappingURL=LayoutIdContext.d.ts.map