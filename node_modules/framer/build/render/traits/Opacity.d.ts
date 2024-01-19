import type { MotionStyle } from "framer-motion";
import { Animatable } from "../../animation/Animatable/Animatable.js";
/** @public */
export interface WithOpacity {
    opacity: number | Animatable<number>;
}
/** @internal */
export declare function withOpacity(target: any): target is WithOpacity;
/** @internal */
export declare function collectOpacityFromProps(props: Partial<WithOpacity>, style: MotionStyle): void;
//# sourceMappingURL=Opacity.d.ts.map