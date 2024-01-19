import React, { useContext } from "react";
/**
 * @internal
 */
export const NavigationContainerContext = React.createContext(true);
/**
 * Used to know if a code component is a child of the current screen.
 * This can be useful for resetting timers or interactions that need to trigger on every navigation.
 * @public
 */
export function useIsInCurrentNavigationTarget() {
    // isInCurrentNavigationTarget is `true` if the NavigationContainerContext at the root of each screen is the current screen.
    const isInCurrentNavigationTarget = useContext(NavigationContainerContext);
    return isInCurrentNavigationTarget;
}
//# sourceMappingURL=NavigationContainerContext.js.map