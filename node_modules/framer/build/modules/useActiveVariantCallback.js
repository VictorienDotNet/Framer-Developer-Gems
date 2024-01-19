import React from "react";
import { useOnCurrentTargetChange } from "../components/NavigationTargetContext.js";
import { useConstant } from "../components/utils/useConstant.js";
function rejectPending(pendingTimers, pendingPromises) {
    pendingTimers.forEach(t => clearTimeout(t));
    pendingTimers.clear();
    pendingPromises.forEach(reject => reject && reject("Callback cancelled by variant change"));
    pendingPromises.clear();
}
function createSet() {
    return new Set();
}
/**
 * Create callbacks that can be cancelled if the component is unmounted, the
 * active variant changes, or the component moves out of the target screen in a
 * Framer prototype.
 *
 * @public
 */
export function useActiveVariantCallback(baseVariant) {
    const pendingPromises = useConstant(createSet);
    const pendingTimers = useConstant(createSet);
    // If the component moves out of the current screen in a Framer prototype,
    // or the current screen is being unmounted via an AnimatePresence animation
    // cancel all pending events.
    useOnCurrentTargetChange(() => {
        return () => rejectPending(pendingTimers, pendingPromises);
    });
    // If the component is unmounted, cancel all pending events.
    React.useEffect(() => {
        return () => rejectPending(pendingTimers, pendingPromises);
    }, [pendingPromises, pendingTimers]);
    // If the base variant of the component changes, cancel all pending events.
    React.useEffect(() => {
        rejectPending(pendingTimers, pendingPromises);
    }, [baseVariant, pendingPromises, pendingTimers]);
    return React.useRef({
        /**
         * Create a callback that can be cancelled if the base variant changes.
         */
        activeVariantCallback: (callback) => (...args) => {
            return new Promise((resolve, reject) => {
                pendingPromises.add(reject);
                return callback(...args).then(resolve);
            }).catch(() => {
                // Swallow errors caused by rejecting this promise.
            });
        },
        /**
         * Execute a callback after a defined period of time. The callback will not
         * be called if pending events are cancelled because the timeout will be
         * cancelled.
         */
        delay: async (callback, msDelay) => {
            await new Promise(resolve => pendingTimers.add(globalThis.setTimeout(() => resolve(true), msDelay)));
            callback();
        },
    }).current;
}
/**
 * Create callbacks that can be cancelled if the component is unmounted, or the
 * component moves out of the target screen in a Framer prototype.
 *
 * @internal
 */
export function useActiveTargetCallback() {
    const value = useActiveVariantCallback(undefined);
    return React.useRef({
        activeTargetCallback: value.activeVariantCallback,
        delay: value.delay,
    }).current;
}
//# sourceMappingURL=useActiveVariantCallback.js.map