import { useEffect, useLayoutEffect } from "react";
/**
 * Swaps `useLayoutEffect` for `useEffect` on the server to avoid React warnings.
 * NOTE! The effect won't run on the server.
 */
export const useIsomorphicLayoutEffect = typeof document !== "undefined" ? useLayoutEffect : useEffect;
//# sourceMappingURL=useIsomorphicLayoutEffect.js.map