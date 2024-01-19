/**
 * @internal
 */
export interface State {
    x: number;
    v: number;
}
/**
 * @internal
 */
export type AccelerationFunction = (state: State) => number;
/**
 * @internal
 */
export declare class Integrator {
    private accelerationForState;
    constructor(accelerationFunction: AccelerationFunction);
    integrateState(state: State, dt: number): State;
    private evaluateState;
    private evaluateStateWithDerivative;
}
//# sourceMappingURL=Integrator.d.ts.map