interface DebouncedFunction<T extends any[]> {
    (...args: T): void;
    cancel: () => void;
}
/** @internal */
export declare function debounce<T extends any[]>(fn: (...args: T) => void, time: number): DebouncedFunction<T>;
export {};
//# sourceMappingURL=debounce.d.ts.map