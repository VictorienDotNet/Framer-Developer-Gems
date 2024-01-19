import type { MotionStyle } from "framer-motion";
import { Color } from "../types/Color/Color.js";
/** @public */
export interface TextColorProperties {
    color: Color | string;
}
export declare function collectTextColorFromProps(props: Partial<TextColorProperties>, style: MotionStyle): void;
//# sourceMappingURL=TextColor.d.ts.map