import { MultiStopGradient } from "./MultiStopGradient.js";
import { SimpleGradient } from "./SimpleGradient.js";
/**
 * @public
 */
export interface RadialGradientBase {
    alpha: number;
    widthFactor: number;
    heightFactor: number;
    centerAnchorX: number;
    centerAnchorY: number;
}
/**
 * @public
 */
export type RadialGradient = RadialGradientBase & (SimpleGradient | MultiStopGradient);
/**
 * @public
 */
export declare const RadialGradient: {
    /**
     * @param value -
     * @public
     */
    isRadialGradient: (value: any) => value is RadialGradient;
    /** @internal */
    hash: (radialGradient: RadialGradient) => number;
    /** @internal */
    toCSS: (radialGradient: RadialGradient) => string;
};
//# sourceMappingURL=RadialGradient.d.ts.map