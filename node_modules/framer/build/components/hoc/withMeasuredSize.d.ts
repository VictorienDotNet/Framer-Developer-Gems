import React from "react";
export declare function useRerenderOnResize(ref: React.RefObject<Element> | undefined): void;
/**
 * @internal
 */
export declare const SIZE_COMPATIBILITY_WRAPPER_ATTRIBUTE = "data-framer-size-compatibility-wrapper";
interface OptionalSizeProps {
    width?: number | string;
    height?: number | string;
}
/**
 * A HoC to enhance code components that depend on being rendered with exact
 * width and height props with width and height props determined via a shared
 * ResizeObserver.
 *
 * @FIXME Do not depend on this HoC. The current plan is to turn it into a no-op
 * after a deprecation period. If we need to provide this functionality to
 * customers after we migrate to a modules-first ecosystem, then we can provide
 * a new copy of this HoC or the `useMeasuredSize` hook, and recommend use
 * without a module version, allowing everyone to share the same ResizeObserver
 * on a single canvas.
 *
 * @internal
 */
export declare const withMeasuredSize: <T extends OptionalSizeProps>(Component: React.ComponentType<T>) => (props: T) => JSX.Element;
export {};
//# sourceMappingURL=withMeasuredSize.d.ts.map