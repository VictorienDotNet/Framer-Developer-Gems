import type { GradientColorStop } from "../types/GradientColorStop.js";
import type { MultiStopGradient } from "../types/MultiStopGradient.js";
import type { SimpleGradient } from "../types/SimpleGradient.js";
/**
 * @param alpha - is optional because SVGs define the alpha as a seperate property
 * @internal
 */
export declare function gradientColorStops(gradient: SimpleGradient | MultiStopGradient, alpha?: number): readonly GradientColorStop[];
export declare function gradientColorStopsHash(gradient: SimpleGradient | MultiStopGradient, alpha: number): number;
//# sourceMappingURL=gradientColorStops.d.ts.map