import { RefObject } from "react";
type GetChildrenFn = (element: Element) => Element[];
/**
 * Adds the element and its children to the layout measure queue
 *
 * @internal
 */
export declare function useMeasureLayout(props: {
    id?: string;
    visible?: boolean;
    _needsMeasure?: boolean;
}, ref: RefObject<Element | null>, getChildren?: GetChildrenFn, options?: {
    skipHook?: boolean;
}): void;
/**
 * Attempts to find the closest component container ancestor to a reference
 * element, and add a layout measure request for it. Used when an element inside
 * a code component has caused a layout shift outside of the normal render loop
 * (such as when fonts load), and needs to trigger a re-measure of its container.
 *
 * @param element
 * @internal
 */
export declare function measureClosestComponentContainer(element: Element): void;
export {};
//# sourceMappingURL=useMeasureLayout.d.ts.map