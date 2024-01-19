// rules-of-hooks is disabled for this file so that we avoid calling pointless
// useEffects on the framer canvas.
/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import { useOnCurrentTargetChange } from "../components/NavigationTargetContext.js";
import { useIsOnFramerCanvas } from "./useIsOnFramerCanvas.js";
function callbackForVariant(map, variant) {
    if (map[variant])
        return map[variant];
    if (variant in map)
        return undefined;
    return map.default;
}
/**
 * Executes a callback when the base variant changes. Events will not be
 * executed on the Framer canvas.
 *
 * @public
 */
export function useOnVariantChange(variant, callbackMap) {
    const isOnFramerCanvas = useIsOnFramerCanvas();
    if (isOnFramerCanvas)
        return;
    const isActiveScreenRef = React.useRef(true);
    // Prevent the callback map from unintentionally triggering useEffect calls.
    const callbackMapRef = React.useRef(callbackMap);
    useOnCurrentTargetChange((isCurrent, isOverlayed) => {
        const isActiveScreen = isCurrent && !isOverlayed;
        if (!isActiveScreenRef.current && isActiveScreen) {
            const callback = callbackForVariant(callbackMapRef.current, variant);
            if (callback)
                callback();
        }
        isActiveScreenRef.current = isActiveScreen;
    }, []);
    React.useEffect(() => {
        if (isActiveScreenRef.current) {
            const callback = callbackForVariant(callbackMapRef.current, variant);
            if (callback)
                callback();
        }
    }, [variant]);
}
/**
 * A simplified version of useOnVariantChange, that takes a single callback,
 * cancelling it only if the navigation target changes.
 *
 * @internal
 */
export function useOnAppear(callback) {
    useOnVariantChange("default", { default: callback });
}
//# sourceMappingURL=useOnVariantChange.js.map