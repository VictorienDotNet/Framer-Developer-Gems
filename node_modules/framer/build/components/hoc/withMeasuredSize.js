import { ResizeObserver as ResizeObserverPolyfill } from "@juggle/resize-observer";
import React, { useEffect } from "react";
import { useForceUpdate } from "../../modules/useForceUpdate.js";
import { useIsomorphicLayoutEffect } from "../../useIsomorphicLayoutEffect.js";
import { isBrowser } from "../../utils/environment.js";
import { safeWindow } from "../../utils/safeWindow.js";
const DEFAULT_SIZE = 200;
class SharedObserver {
    #sharedResizeObserver;
    #callbacks = new WeakMap();
    constructor() {
        const ResizeObserver = safeWindow.ResizeObserver ?? ResizeObserverPolyfill;
        this.#sharedResizeObserver = new ResizeObserver(this.updateResizedElements.bind(this));
    }
    updateResizedElements(entries) {
        for (const entry of entries) {
            const callbackForElement = this.#callbacks.get(entry.target);
            if (callbackForElement)
                callbackForElement(entry.contentRect);
        }
    }
    observeElementWithCallback(element, callback) {
        this.#sharedResizeObserver.observe(element);
        this.#callbacks.set(element, callback);
    }
    unobserve(element) {
        this.#sharedResizeObserver.unobserve(element);
        this.#callbacks.delete(element);
    }
}
const sharedResizeObserver = isBrowser() ? new SharedObserver() : undefined;
export function useRerenderOnResize(ref) {
    const update = useForceUpdate();
    useEffect(() => {
        const element = ref?.current;
        if (!element)
            return;
        sharedResizeObserver?.observeElementWithCallback(ref.current, update);
        return () => {
            sharedResizeObserver?.unobserve(element);
        };
    }, [ref, update]);
}
/**
 * Uses a globally shared resize observer, and returns an updated
 * size object when the element's size changes. This is the recommended way to
 * use a Resize Observer: https://github.com/WICG/resize-observer/issues/59.
 */
function useMeasuredSize(ref) {
    const forceUpdate = useForceUpdate();
    const size = React.useRef(null);
    function updateSize(newSize) {
        // Ignore 0 entries, usually indicative of an element that is hidden, or
        // nested inside a hidden element. This is common on the canvas where
        // elements out of the viewport will be contained in an element with
        // `display: none`. We could technically check the bounding client rect
        // to make sure the element isn't visible, but that would force a style
        // recalc and negate any performance benefits of skipping the update
        if (newSize.width === 0 && newSize.height === 0)
            return;
        if (!size.current || newSize.height !== size.current.height || newSize.width !== size.current.width) {
            size.current = { width: newSize.width, height: newSize.height };
            forceUpdate();
        }
    }
    // On mount, immediately measure and set a size. This will defer paint until
    // no more updates are scheduled. Additionally add our element to the shared
    // ResizeObserver with a callback to perform when the element resizes.
    // Finally, remove the element from the observer when the component is unmounted.
    useIsomorphicLayoutEffect(() => {
        if (!ref.current)
            return;
        const { offsetWidth, offsetHeight } = ref.current;
        // Defer paint until initial size is added.
        updateSize({
            width: offsetWidth,
            height: offsetHeight,
        });
        // Resize observer will race to add the initial size, but since the size
        // is set above, it won't trigger a render on mount since it should
        // match the measured size. Future executions of the callback will
        // trigger renders if the size changes.
        sharedResizeObserver.observeElementWithCallback(ref.current, updateSize);
        return () => {
            if (!ref.current)
                return;
            sharedResizeObserver.unobserve(ref.current);
        };
    }, []);
    return size.current;
}
/**
 * @internal
 */
export const SIZE_COMPATIBILITY_WRAPPER_ATTRIBUTE = "data-framer-size-compatibility-wrapper";
/**
 * A HoC to enhance code components that depend on being rendered with exact
 * width and height props with width and height props determined via a shared
 * ResizeObserver.
 *
 * @FIXME Do not depend on this HoC. The current plan is to turn it into a no-op
 * after a deprecation period. If we need to provide this functionality to
 * customers after we migrate to a modules-first ecosystem, then we can provide
 * a new copy of this HoC or the `useMeasuredSize` hook, and recommend use
 * without a module version, allowing everyone to share the same ResizeObserver
 * on a single canvas.
 *
 * @internal
 */
export const withMeasuredSize = (Component) => (props) => {
    const ref = React.useRef(null);
    const size = useMeasuredSize(ref);
    const dataProps = { [SIZE_COMPATIBILITY_WRAPPER_ATTRIBUTE]: true };
    // The initial render will be delayed until the measured size is available.
    const shouldRender = Boolean(size);
    // In the export case, we'll sometimes be provided with explicit width and
    // height to use as fallback. This is a temporary measure and will only
    // happen when the used width / height is a fixed number. This code should
    // be removed once we're no longer using `renderToStaticMarkup` for export.
    const fallbackWidth = props.width ?? DEFAULT_SIZE;
    const fallbackHeight = props.height ?? DEFAULT_SIZE;
    return (React.createElement("div", { style: { width: "100%", height: "100%", pointerEvents: "none" }, ref: ref, ...dataProps }, shouldRender && (React.createElement(Component, { ...props, width: size?.width ?? fallbackWidth, height: size?.height ?? fallbackHeight }))));
};
//# sourceMappingURL=withMeasuredSize.js.map