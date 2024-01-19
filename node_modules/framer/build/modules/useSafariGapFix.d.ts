import type { Property } from "csstype";
import React from "react";
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
export declare function useSafariGapFix(gap: number, ref: React.MutableRefObject<HTMLElement | null>, display: Property.Display): (() => void) | undefined;
//# sourceMappingURL=useSafariGapFix.d.ts.map