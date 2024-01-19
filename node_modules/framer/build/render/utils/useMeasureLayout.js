import { useContext } from "react";
import { useIsomorphicLayoutEffect } from "../../useIsomorphicLayoutEffect.js";
import { runtime } from "../../utils/runtimeInjection.js";
import { ComponentContainerContext } from "../presentation/ComponentContainerContext.js";
import { RenderTarget } from "../types/RenderEnvironment.js";
import { getMeasurableCodeComponentChildren } from "./getMeasurableCodeComponentChildren.js";
import { nodeIdFromString } from "./nodeIdFromString.js";
/**
 * Adds the element and its children to the layout measure queue
 *
 * @internal
 */
export function useMeasureLayout(props, ref, getChildren = () => [], options = {}) {
    const { id, visible, _needsMeasure } = props;
    const { skipHook = false } = options;
    const inCodeComponent = Boolean(useContext(ComponentContainerContext));
    const onCanvas = RenderTarget.current() === RenderTarget.canvas;
    useIsomorphicLayoutEffect(() => {
        // must be on the canvas, not in a code component, and must not be
        // explicitly skipped through skipHook
        if (!onCanvas || inCodeComponent || skipHook) {
            return;
        }
        // must have a valid ref, id, be visible and need measure
        if (!(ref.current && id && visible && _needsMeasure)) {
            return;
        }
        runtime.queueMeasureRequest(nodeIdFromString(id), ref.current, getChildren(ref.current));
    });
}
/**
 * Attempts to find the closest component container ancestor to a reference
 * element, and add a layout measure request for it. Used when an element inside
 * a code component has caused a layout shift outside of the normal render loop
 * (such as when fonts load), and needs to trigger a re-measure of its container.
 *
 * @param element
 * @internal
 */
export function measureClosestComponentContainer(element) {
    const container = element.closest("[data-framer-component-container]");
    if (!container)
        return;
    runtime.queueMeasureRequest(nodeIdFromString(container.id), container, getMeasurableCodeComponentChildren(container));
}
//# sourceMappingURL=useMeasureLayout.js.map