import type { MotionStyle } from "framer-motion";
export type Overflow = "visible" | "hidden" | "scroll" | "auto";
export interface OverflowProperties {
    overflow: Overflow;
}
export declare function collectOverflowFromProps(props: Partial<OverflowProperties>, style: MotionStyle): void;
//# sourceMappingURL=Overflow.d.ts.map