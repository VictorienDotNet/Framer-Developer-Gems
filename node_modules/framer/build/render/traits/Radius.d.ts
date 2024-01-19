import type { MotionStyle } from "framer-motion";
import { Animatable } from "../../animation/Animatable/Animatable.js";
export type RadiusValue = number | Animatable<number> | string;
/** @public */
export interface RadiusProperties {
    radius: RadiusValue | Partial<{
        topLeft: RadiusValue;
        topRight: RadiusValue;
        bottomLeft: RadiusValue;
        bottomRight: RadiusValue;
    }>;
}
/**
 * We assign the borderRadius to each corner individually to make it easier to animate between
 * different frames.
 */
export declare function collectRadiusFromProps(props: Partial<RadiusProperties>, style: MotionStyle): void;
//# sourceMappingURL=Radius.d.ts.map