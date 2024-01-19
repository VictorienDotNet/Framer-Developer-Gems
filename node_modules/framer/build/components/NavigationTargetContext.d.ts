import React from "react";
type Cleanup = () => void;
type IsCurrentCallback = (isCurrent: boolean, isOverlayed: boolean) => void | Cleanup;
type Props = React.PropsWithChildren<{
    isCurrent: boolean;
    isOverlayed: boolean;
}>;
/**
 * @internal
 *
 * Run the registered callback when the current navigation target changes
 * @param isCurrent If the ground node is present as the current target in the preview
 */
export declare const NavigationTargetWrapper: ({ isCurrent, isOverlayed, children }: Props) => JSX.Element;
/**
 * @internal
 *
 * Register the callback on mount to the NavigationTargetWrapper, deregister it on unmount.
 * The callback will be fired when the current target changes. The callback allows a cleanup callback to be returned.
 * The cleanup will fire before the next update and on unmount.
 * @param callback A callback that receives the `isCurrent` state of the NavigateTargetWrapper
 * @param deps If present, callback will be renewed when the dependencies change.
 */
export declare function useOnCurrentTargetChange(callback: IsCurrentCallback, deps?: React.DependencyList): void;
export {};
//# sourceMappingURL=NavigationTargetContext.d.ts.map