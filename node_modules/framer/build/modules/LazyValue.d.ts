/**
 * LazyValue can be used with dynamic imports to load a value asynchronously
 * with Suspense and render it when it's ready.
 */
export declare class LazyValue<Value> {
    private readonly resolver;
    static is<Value>(value: unknown): value is LazyValue<Value>;
    private status?;
    constructor(resolver: () => Promise<Value>);
    /** Preload the value so it can be read() later. */
    preload(): Promise<void> | undefined;
    /** Synchronously read the value after calling preload() before. */
    read(): Value;
}
//# sourceMappingURL=LazyValue.d.ts.map