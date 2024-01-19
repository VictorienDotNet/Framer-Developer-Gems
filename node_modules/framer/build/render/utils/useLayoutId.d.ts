import type { MotionProps } from "framer-motion";
interface UseMagicMotionProps {
    layoutId?: string;
    /**
     * An id to use as the basis of generated layout ids. This will usually be
     * the node id. If a layoutIdKey is not provided we will not attempt to
     * generate a layoutId.
     */
    layoutIdKey?: string;
    name?: string;
    duplicatedFrom?: string[];
    __fromCodeComponentNode?: boolean;
    drag?: MotionProps["drag"];
}
/**
 * @internal
 */
export declare function useLayoutId(props: UseMagicMotionProps, { specificLayoutId, postfix }?: {
    specificLayoutId?: string;
    postfix?: string;
}): string | undefined;
export {};
//# sourceMappingURL=useLayoutId.d.ts.map