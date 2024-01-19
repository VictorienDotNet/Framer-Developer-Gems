type CallbackMap = Record<string, (() => void) | undefined>;
/**
 * Executes a callback when the base variant changes. Events will not be
 * executed on the Framer canvas.
 *
 * @public
 */
export declare function useOnVariantChange(variant: string, callbackMap: CallbackMap): void;
/**
 * A simplified version of useOnVariantChange, that takes a single callback,
 * cancelling it only if the navigation target changes.
 *
 * @internal
 */
export declare function useOnAppear(callback: () => void): void;
export {};
//# sourceMappingURL=useOnVariantChange.d.ts.map