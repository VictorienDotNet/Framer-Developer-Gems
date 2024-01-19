/**
 * Create callbacks that can be cancelled if the component is unmounted, the
 * active variant changes, or the component moves out of the target screen in a
 * Framer prototype.
 *
 * @public
 */
export declare function useActiveVariantCallback(baseVariant: string | undefined): {
    /**
     * Create a callback that can be cancelled if the base variant changes.
     */
    activeVariantCallback: (callback: (...args: any[]) => Promise<boolean | void>) => (...args: any[]) => Promise<unknown>;
    /**
     * Execute a callback after a defined period of time. The callback will not
     * be called if pending events are cancelled because the timeout will be
     * cancelled.
     */
    delay: (callback: () => void, msDelay: number) => Promise<void>;
};
/**
 * Create callbacks that can be cancelled if the component is unmounted, or the
 * component moves out of the target screen in a Framer prototype.
 *
 * @internal
 */
export declare function useActiveTargetCallback(): {
    activeTargetCallback: (callback: (...args: any[]) => Promise<boolean | void>) => (...args: any[]) => Promise<unknown>;
    delay: (callback: () => void, msDelay: number) => Promise<void>;
};
//# sourceMappingURL=useActiveVariantCallback.d.ts.map