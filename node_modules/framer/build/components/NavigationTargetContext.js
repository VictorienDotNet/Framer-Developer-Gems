import React, { createContext, useCallback, useContext, useEffect, useRef } from "react";
import { isFunction } from "../utils/utils.js";
import { useMap } from "./utils/useMap.js";
const NavigationTargetContext = /* @__PURE__ */ createContext({ register: () => { }, deregister: () => { } });
/**
 * @internal
 *
 * Run the registered callback when the current navigation target changes
 * @param isCurrent If the ground node is present as the current target in the preview
 */
export const NavigationTargetWrapper = ({ isCurrent, isOverlayed, children }) => {
    const callbacks = useMap();
    const register = useCallback((fn) => {
        if (callbacks.has(fn)) {
            // Should never happen
            // eslint-disable-next-line no-console
            console.warn("NavigationTargetWrapper: already registered");
            return;
        }
        callbacks.set(fn, undefined);
    }, [callbacks /* constant, so should never change */]);
    const deregister = useCallback((fn) => {
        // Cleanup before removing the callback
        const cleanup = callbacks.get(fn);
        cleanup?.();
        callbacks.delete(fn);
    }, [callbacks /* constant, so should never change */]);
    const value = useRef({ register, deregister }).current;
    useEffect(() => {
        callbacks.forEach((_, cb) => {
            const newCleanup = cb(isCurrent, isOverlayed);
            callbacks.set(cb, isFunction(newCleanup) ? newCleanup : undefined);
        });
        return () => {
            callbacks.forEach((cleanup, cb) => {
                if (!cleanup)
                    return;
                // Cleanup and remove cleanup callback so we never call it more than once
                cleanup();
                callbacks.set(cb, undefined);
            });
        };
    }, [isCurrent, isOverlayed, callbacks /* constant, so should never change */]);
    return React.createElement(NavigationTargetContext.Provider, { value: value }, children);
};
/**
 * @internal
 *
 * Register the callback on mount to the NavigationTargetWrapper, deregister it on unmount.
 * The callback will be fired when the current target changes. The callback allows a cleanup callback to be returned.
 * The cleanup will fire before the next update and on unmount.
 * @param callback A callback that receives the `isCurrent` state of the NavigateTargetWrapper
 * @param deps If present, callback will be renewed when the dependencies change.
 */
export function useOnCurrentTargetChange(callback, deps = []) {
    const { register, deregister } = useContext(NavigationTargetContext);
    useEffect(() => {
        if (!callback)
            return;
        register(callback);
        return () => deregister(callback);
        // callback should not change while previewing
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [register, deregister, ...deps]);
}
//# sourceMappingURL=NavigationTargetContext.js.map