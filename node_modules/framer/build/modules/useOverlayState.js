import React from "react";
/**
 * When managing hiding/showing overlays, we want to prevent accidental body
 * scrolling beneath the overlay. This hook decorates a normal React useState
 * hook with solving this problem.
 *
 * @public
 */
export function useOverlayState({ blockDocumentScrolling = true } = {}) {
    const [showOverlay, setShowOverlay] = React.useState(false);
    const callback = React.useCallback((show) => {
        setShowOverlay(show);
        if (blockDocumentScrolling === false)
            return;
        if (show) {
            document.documentElement.style.setProperty("overflow", "hidden");
        }
        else {
            document.documentElement.style.removeProperty("overflow");
        }
    }, [blockDocumentScrolling]);
    // Ensure overflow is cleaned up when the hook is destroyed.
    React.useEffect(() => () => {
        if (blockDocumentScrolling === false)
            return;
        document.documentElement.style.removeProperty("overflow");
    }, [blockDocumentScrolling]);
    return [showOverlay, callback];
}
//# sourceMappingURL=useOverlayState.js.map