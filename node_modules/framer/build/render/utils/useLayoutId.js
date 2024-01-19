import { useContext, useMemo } from "react";
import { LayoutIdContext } from "../../components/AnimateLayout/LayoutIdContext.js";
/**
 * @internal
 */
export function useLayoutId(props, { specificLayoutId, postfix } = {}) {
    const { name, layoutIdKey, duplicatedFrom, __fromCodeComponentNode = false, drag } = props;
    const { getLayoutId, enabled } = useContext(LayoutIdContext);
    return useMemo(() => {
        // If automatic layoutId's are disabled, but a Frame is used in code, and provides a layoutId, always use it.
        if (!enabled)
            return props.layoutId;
        const existingLayoutId = specificLayoutId || props.layoutId;
        // If no existing layoutId is provided, we do not generate a layoutId if:
        // - No id is provided (a requirement for generating layoutIds)
        // - The layer is not draggable, because magic motion and dragging are not supported (drag)
        // - The layer should not be animated with magic motion (layoutIdKey)
        // - The layer is the direct child of a ComponentContainer (Scroll/Page should always use specificLayoutId)
        if (!existingLayoutId) {
            if (drag || !layoutIdKey || __fromCodeComponentNode)
                return undefined;
        }
        // If provided, use an existing layoutId, otherwise generate one with the LayoutIdContext.
        const layoutIdCandidate = existingLayoutId || getLayoutId({ id: layoutIdKey, name, duplicatedFrom });
        // If for some reason we can't generate a layoutId, don't provide a layoutId.
        if (!layoutIdCandidate)
            return undefined;
        // If we have provided a postfix, postfix whatever layoutId we've decided to use with the string, and return it.
        return postfix ? `${layoutIdCandidate}-${postfix}` : layoutIdCandidate;
    }, [enabled]); // Must return a stable value as layoutIds must be stable between all renders.
}
//# sourceMappingURL=useLayoutId.js.map