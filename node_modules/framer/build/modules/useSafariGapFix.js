import React from "react";
import { isSafari, safariVersion } from "../utils/environment.js";
function triggerStackReflow(element, display) {
    if (!element)
        return;
    element.style.display = "none";
    // trigger the browser to synchronously calculate the layout
    void element.offsetHeight;
    // Re-enable flexbox
    element.style.display = display;
}
const requiresPolyfill = Boolean(isSafari() && safariVersion() < 15.4);
/**
 * Until Safari 15.4, Webkit did not redraw the gaps correctly when the value
 * updated. A forced reflow is needed as a workaround.
 *
 * For layout transitions, we try to trigger the reflow in the
 * onBeforeMeasureLayout lifecycle, so that motion could capture the forced
 * layout change when it measures the new layout.
 *
 * We still need a layout effect to trigger the reflow, in case
 * onBeforeMeasureLayout isn't called (e.g. updating gap on the canvas).
 * https://bugs.webkit.org/show_bug.cgi?id=233252
 *
 * @internal
 */
export function useSafariGapFix(gap, ref, display) {
    // Safari Version cannot change between renders, so it is always safe to
    // early return without violating the rule of hooks.
    if (!requiresPolyfill)
        return undefined;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const isInitialRender = React.useRef(true);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const hasTriggeredReflow = React.useRef(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const prevGapValue = React.useRef(gap);
    hasTriggeredReflow.current = false;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useLayoutEffect(() => {
        prevGapValue.current = gap;
        if (isInitialRender.current) {
            isInitialRender.current = false;
            return;
        }
        if (!hasTriggeredReflow.current) {
            triggerStackReflow(ref.current, display);
            hasTriggeredReflow.current = true;
        }
    }, [gap, ref, prevGapValue, display]);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return React.useCallback(() => {
        // The workaround is only required if the layout change
        // is triggered by gap value changes
        if (prevGapValue.current === gap)
            return;
        if (!hasTriggeredReflow.current)
            triggerStackReflow(ref.current, display);
        hasTriggeredReflow.current = true;
    }, [gap, ref]);
}
//# sourceMappingURL=useSafariGapFix.js.map