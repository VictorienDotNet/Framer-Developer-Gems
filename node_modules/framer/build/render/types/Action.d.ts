import type { BooleanControlDescription, ColorControlDescription, ComponentInstanceDescription, EnumControlDescription, FileControlDescription, FusedNumberControlDescription, ImageControlDescription, NumberControlDescription, ResponsiveImageControlDescription, RichTextControlDescription, SegmentedEnumControlDescription, StringControlDescription, TransitionControlDescription } from "./PropertyControls.js";
/** @internal */
export type ActionControlDescription<P = any> = NumberControlDescription<P> | EnumControlDescription<P> | BooleanControlDescription<P> | StringControlDescription<P> | RichTextControlDescription<P> | ColorControlDescription<P> | FusedNumberControlDescription<P> | SegmentedEnumControlDescription<P> | ImageControlDescription<P> | ResponsiveImageControlDescription<P> | FileControlDescription<P> | ComponentInstanceDescription<P> | TransitionControlDescription<P>;
/** @internal */
export type ActionControls<ActionProps = any> = {
    [K in keyof ActionProps]?: ActionControlDescription<Partial<ActionProps>>;
};
/** @internal */
export type ActionHandler = (...args: any[]) => void;
/**
 * Action hooks are picked up by Framer
 * @param options - object containing action options
 * @returns event handler
 * @internal
 */
export type Action<Options extends {
    [key: string]: any;
} = {}> = (options: Options) => ActionHandler;
//# sourceMappingURL=Action.d.ts.map