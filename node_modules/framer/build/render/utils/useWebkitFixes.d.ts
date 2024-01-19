import type { MotionStyle } from "framer-motion";
import type { RefObject } from "react";
/**
 * Workarounds for WebKit bugs
 * Some styles have to be toggled to take effect in certain situations.
 * To use in a class, see Layer.tsx
 * @internal
 */
export declare function useWebkitFixes(elementRef: RefObject<HTMLElement>, style: MotionStyle): void;
/** @internal */
export declare function resetSetStyle(element: HTMLElement | SVGElement | null, key: string, toValue: any | null, microtask?: boolean): void;
//# sourceMappingURL=useWebkitFixes.d.ts.map