export type FontLoadStatus = "loading" | "done" | "timeout";
/**
 * @internal
 * Hook to subscribe to font store and get the current font loading status.
 * */
export declare function useFontLoadStatus(fontSelectors?: string[], timeout?: number): FontLoadStatus;
//# sourceMappingURL=useFontLoadStatus.d.ts.map