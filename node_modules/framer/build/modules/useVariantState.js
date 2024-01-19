import React from "react";
import { useConstant } from "../components/utils/useConstant.js";
import { assert } from "../utils/assert.js";
import { cx } from "./cx.js";
import { useAddVariantProps } from "./useAddVariantProps.js";
import { useForceUpdate } from "./useForceUpdate.js";
function createGestureVariant(variant, type) {
    return `${variant}-${type}`;
}
function nextVariant(allVariants, currentVariant) {
    const index = allVariants.indexOf(currentVariant);
    let nextIndex = index + 1;
    if (nextIndex >= allVariants.length) {
        nextIndex = 0;
    }
    // We ensure the index could not go out of bound with the code above, the
    // assert here is just to appease Typescript.
    const nextVariant = allVariants[nextIndex];
    assert(nextVariant !== undefined, "nextVariant should be defined");
    return nextVariant;
}
function activeTransition(transitions, variant) {
    if (!transitions)
        return undefined;
    if (variant) {
        const variantTransition = transitions[variant];
        if (variantTransition)
            return variantTransition;
    }
    return transitions.default;
}
function getGesture(enabledGestures, isHovered, isPressed) {
    const { hover, pressed } = enabledGestures || {};
    if (pressed && isPressed)
        return "pressed";
    if (hover && isHovered)
        return "hover";
}
function createVariantClassName(baseVariant, variantClassNames) {
    const mappedClassName = variantClassNames[baseVariant];
    if (mappedClassName)
        return mappedClassName;
    return `framer-${"v" /* VariantSelector.Variant */}-${baseVariant}`;
}
function safeBaseVariant(targetVariant, fallbackVariant, validBaseVariants) {
    if (!targetVariant)
        return fallbackVariant;
    if (validBaseVariants.has(targetVariant))
        return targetVariant;
    return fallbackVariant;
}
/**
 * Flag setVariantState as cycling variants.
 * @public
 */
export const CycleVariantState = /* @__PURE__ */ Symbol("cycle");
/**
 * Handle stateful logic in Framer Canvas Components.
 *
 * @public
 */
export function useVariantState({ variant, defaultVariant: externalDefaultVariant, transitions: externalTransitions, enabledGestures: externalEnabledGestures, cycleOrder: externalCycleOrder = [], variantProps = {}, variantClassNames = {}, }) {
    const forceUpdate = useForceUpdate();
    const validBaseVariants = useConstant(() => new Set(externalCycleOrder));
    const internalState = React.useRef({
        isHovered: false,
        isPressed: false,
        baseVariant: safeBaseVariant(variant, externalDefaultVariant, validBaseVariants),
        lastVariant: variant,
        gestureVariant: undefined,
        // When used in generated components, these are static values defined
        // outside of the component function that also need to not result in
        // memoized values being recalculated, so we dump them into the ref.
        defaultVariant: externalDefaultVariant,
        enabledGestures: externalEnabledGestures,
        cycleOrder: externalCycleOrder,
        transitions: externalTransitions,
    });
    const resolveNextVariant = React.useCallback((targetBaseVariant) => {
        const { isHovered, isPressed, enabledGestures, defaultVariant } = internalState.current;
        const nextBaseVariant = safeBaseVariant(targetBaseVariant, defaultVariant, validBaseVariants);
        const gesture = getGesture(enabledGestures?.[nextBaseVariant], isHovered, isPressed);
        const nextGestureVariant = gesture ? createGestureVariant(nextBaseVariant, gesture) : undefined;
        return [nextBaseVariant, nextGestureVariant];
    }, [validBaseVariants]);
    const setGestureState = React.useCallback(({ isHovered, isPressed }) => {
        if (isHovered !== undefined)
            internalState.current.isHovered = isHovered;
        if (isPressed !== undefined)
            internalState.current.isPressed = isPressed;
        const { baseVariant, gestureVariant, defaultVariant } = internalState.current;
        const [nextBase, nextGesture] = resolveNextVariant(baseVariant);
        // Only force a render if the new active variants have changed.
        if (nextBase !== baseVariant || nextGesture !== gestureVariant) {
            internalState.current.baseVariant = nextBase || defaultVariant;
            internalState.current.gestureVariant = nextGesture;
            forceUpdate();
        }
    }, [resolveNextVariant, forceUpdate]);
    const setVariant = React.useCallback((proposedVariant) => {
        const { defaultVariant, cycleOrder, baseVariant, gestureVariant } = internalState.current;
        const nextBaseVariant = proposedVariant === CycleVariantState
            ? nextVariant(cycleOrder || [], baseVariant || defaultVariant)
            : proposedVariant;
        const [nextBase, nextGesture] = resolveNextVariant(nextBaseVariant);
        // Only force a render if the new active variants have changed.
        if (nextBase !== baseVariant || nextGesture !== gestureVariant) {
            internalState.current.baseVariant = nextBase || defaultVariant;
            internalState.current.gestureVariant = nextGesture;
            forceUpdate();
        }
    }, [resolveNextVariant, forceUpdate]);
    if (variant !== internalState.current.lastVariant) {
        const [nextBase, nextGesture] = resolveNextVariant(variant);
        internalState.current.lastVariant = nextBase;
        if (nextBase !== internalState.current.baseVariant || nextGesture !== internalState.current.gestureVariant) {
            internalState.current.baseVariant = nextBase;
            internalState.current.gestureVariant = nextGesture;
        }
    }
    const { baseVariant, gestureVariant, defaultVariant, enabledGestures, isHovered, isPressed } = internalState.current;
    // Backwards compatibility for old components generated before
    // addVariantProps was extracted to it's own hook.
    const addVariantProps = useAddVariantProps(internalState.current.baseVariant, internalState.current.gestureVariant, variantProps);
    return React.useMemo(() => {
        const variants = [];
        if (baseVariant !== defaultVariant)
            variants.push(baseVariant);
        if (gestureVariant)
            variants.push(gestureVariant);
        return {
            variants,
            baseVariant,
            gestureVariant,
            transition: activeTransition(internalState.current.transitions, baseVariant),
            setVariant,
            setGestureState,
            addVariantProps,
            classNames: cx(createVariantClassName(baseVariant, variantClassNames), getGesture(enabledGestures?.[baseVariant], isHovered, isPressed)),
        };
    }, [
        baseVariant,
        gestureVariant,
        isHovered,
        isPressed,
        addVariantProps,
        setVariant,
        defaultVariant,
        enabledGestures,
        setGestureState,
        variantClassNames,
    ]);
}
//# sourceMappingURL=useVariantState.js.map