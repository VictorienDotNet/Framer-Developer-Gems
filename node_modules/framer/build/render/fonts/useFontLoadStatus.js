import React from "react";
import { fontStore } from "./fontStore.js";
/**
 * @internal
 * Hook to subscribe to font store and get the current font loading status.
 * */
export function useFontLoadStatus(fontSelectors = [], timeout = 5000) {
    const missingFontSelectors = fontSelectors.filter(s => !fontStore.isSelectorLoaded(s));
    const [fontLoadStatus, setFontLoadStatus] = React.useState(missingFontSelectors.length ? "loading" : "done");
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
        if (!missingFontSelectors.length)
            return;
        setFontLoadStatus("loading");
        const timer = setTimeout(() => {
            setFontLoadStatus("timeout");
        }, timeout);
        fontStore.loadWebFontsFromSelectors(missingFontSelectors).then(() => {
            clearTimeout(timer);
            setFontLoadStatus("done");
        });
        // This is a poor mans version of shallow equal both arrays
        // We need both the used and the missing font selectors
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fontSelectors.join(", "), missingFontSelectors.join(", ")]);
    return fontLoadStatus;
}
//# sourceMappingURL=useFontLoadStatus.js.map