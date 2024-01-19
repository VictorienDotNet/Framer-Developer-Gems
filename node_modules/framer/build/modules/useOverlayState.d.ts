/**
 * When managing hiding/showing overlays, we want to prevent accidental body
 * scrolling beneath the overlay. This hook decorates a normal React useState
 * hook with solving this problem.
 *
 * @public
 */
export declare function useOverlayState({ blockDocumentScrolling }?: {
    blockDocumentScrolling?: boolean;
}): readonly [boolean, (show: boolean) => void];
//# sourceMappingURL=useOverlayState.d.ts.map