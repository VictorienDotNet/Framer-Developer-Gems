import { MotionValue, PanInfo, Point } from "framer-motion";
import { RefObject } from "react";
interface WheelScrollOptions {
    enabled: boolean;
    initial: Point;
    prev: Point;
    direction: "horizontal" | "vertical" | "both";
    constraints: RefObject<{
        top: number;
        right: number;
        bottom: number;
        left: number;
    }>;
    offsetX: MotionValue<number>;
    offsetY: MotionValue<number>;
    onScrollStart: ((info: PanInfo) => void) | undefined;
    onScroll: ((info: PanInfo) => void) | undefined;
    onScrollEnd: ((info: PanInfo) => void) | undefined;
}
export declare function useWheelScroll(ref: RefObject<Element>, { enabled, initial, prev, direction, constraints, offsetX, offsetY, onScrollStart, onScroll, onScrollEnd, }: WheelScrollOptions): void;
export {};
//# sourceMappingURL=useWheelScroll.d.ts.map