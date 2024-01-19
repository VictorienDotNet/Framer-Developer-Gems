import type { MotionStyle } from "framer-motion";
import type { FrameProps } from "./FrameWithMotion.js";
interface PositionObject {
    left?: any;
    right?: any;
    top?: any;
    bottom?: any;
}
export declare function hasLeftAndRight(style?: PositionObject): boolean;
export declare function hasTopAndBottom(style?: PositionObject): boolean;
export declare function getStyleForFrameProps(props?: Partial<FrameProps>): MotionStyle;
export {};
//# sourceMappingURL=getStyleForFrameProps.d.ts.map