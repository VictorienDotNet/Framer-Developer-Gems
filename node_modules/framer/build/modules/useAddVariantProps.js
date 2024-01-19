import React from "react";
/**
 * Returns combines React props from a hash map based on the active variants.
 *
 * @public
 */
export function useAddVariantProps(baseVariant, gestureVariant, variantProps) {
    return React.useCallback((id) => {
        if (!variantProps)
            return {};
        if (!baseVariant)
            return {};
        // Create an object with all valid props for the target node. Values
        // in higher priority variants override same values in lower
        // priority variants.
        if (gestureVariant) {
            return Object.assign({}, variantProps[baseVariant]?.[id], variantProps[gestureVariant]?.[id]);
        }
        return variantProps[baseVariant]?.[id] || {};
    }, [baseVariant, gestureVariant, variantProps]);
}
//# sourceMappingURL=useAddVariantProps.js.map