import type { GradientColorStop } from "./GradientColorStop.js";
/**
 * @public
 */
export interface MultiStopGradient {
    stops: readonly GradientColorStop[];
}
export declare function isMultiStopGradient(value: any): value is MultiStopGradient;
//# sourceMappingURL=MultiStopGradient.d.ts.map