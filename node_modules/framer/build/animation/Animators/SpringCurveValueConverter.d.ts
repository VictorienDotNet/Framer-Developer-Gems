export interface CurveOptions {
    tension: number;
    friction: number;
    velocity: number;
}
export declare const SpringCurveValueConverter: {
    computeDampingRatio: (tension: number, friction: number, mass?: number) => number;
    computeDuration: (tension: number, friction: number, velocity?: number, mass?: number) => number | null;
    computeDerivedCurveOptions: (dampingRatio: number, duration: number, velocity?: number, mass?: number) => CurveOptions;
};
//# sourceMappingURL=SpringCurveValueConverter.d.ts.map