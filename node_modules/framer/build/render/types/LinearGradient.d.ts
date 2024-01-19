import { MultiStopGradient } from "./MultiStopGradient.js";
import { SimpleGradient } from "./SimpleGradient.js";
/**
 * @public
 */
export interface LinearGradientBase {
    alpha: number;
    angle: number;
}
/**
 * @public
 */
export type LinearGradient = LinearGradientBase & (SimpleGradient | MultiStopGradient);
/**
 * @public
 */
export declare const LinearGradient: {
    /**
     * @param value -
     */
    isLinearGradient: (value: any) => value is LinearGradient;
    /** @internal */
    hash: (linearGradient: LinearGradient) => number;
    /** @internal */
    toCSS: (linearGradient: LinearGradient, overrideAngle?: number) => string;
};
//# sourceMappingURL=LinearGradient.d.ts.map