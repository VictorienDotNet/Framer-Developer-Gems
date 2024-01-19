import type React from "react";
import type { Size } from "../../render/types/Size.js";
import { Animatable } from "../../animation/Animatable/Animatable.js";
export interface DeprecatedTransformProperties {
    z: Animatable<number> | number;
    rotation: Animatable<number> | number;
    rotationX: Animatable<number> | number;
    rotationY: Animatable<number> | number;
    rotationZ: Animatable<number> | number;
    scale: Animatable<number> | number;
    scaleX: Animatable<number> | number;
    scaleY: Animatable<number> | number;
    scaleZ: Animatable<number> | number;
    skew: Animatable<number> | number;
    skewX: Animatable<number> | number;
    skewY: Animatable<number> | number;
    originX: Animatable<number> | number;
    originY: Animatable<number> | number;
    originZ: Animatable<number> | number;
}
export declare const transformDefaults: DeprecatedTransformProperties;
export declare function collectTransformFromProps(props: DeprecatedTransformProperties, rect: {
    x: number | string;
    y: number | string;
} & Size, style: React.CSSProperties): void;
//# sourceMappingURL=Transform.d.ts.map