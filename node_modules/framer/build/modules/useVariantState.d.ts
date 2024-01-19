import type { Transition } from "framer-motion";
import { VariantProps } from "./useAddVariantProps.js";
type GestureState = Partial<{
    isHovered: boolean;
    isPressed: boolean;
}>;
interface EnabledGestures {
    hover: boolean;
    pressed: boolean;
}
type EnabledVariantGestures = Record<string, EnabledGestures>;
type VariantNames = string[];
interface VariantState {
    variants: VariantNames;
    baseVariant: string | undefined;
    gestureVariant: string | undefined;
    classNames: string;
    transition: Partial<Transition> | undefined;
    setVariant: (variant: string | typeof CycleVariantState) => void;
    setGestureState: (gestureState: GestureState) => void;
    addVariantProps?: (id: string) => Record<string, unknown>;
}
/**
 * @internal
 */
export declare const enum VariantSelector {
    Variant = "v"
}
/**
 * Flag setVariantState as cycling variants.
 * @public
 */
export declare const CycleVariantState: unique symbol;
/**
 * Handle stateful logic in Framer Canvas Components.
 *
 * @public
 */
export declare function useVariantState({ variant, defaultVariant: externalDefaultVariant, transitions: externalTransitions, enabledGestures: externalEnabledGestures, cycleOrder: externalCycleOrder, variantProps, variantClassNames, }: {
    defaultVariant: string;
    cycleOrder: string[];
    variant?: string;
    transitions?: Record<string, Partial<Transition>>;
    enabledGestures?: EnabledVariantGestures;
    variantProps?: VariantProps;
    variantClassNames?: Record<string, string>;
}): VariantState;
export {};
//# sourceMappingURL=useVariantState.d.ts.map