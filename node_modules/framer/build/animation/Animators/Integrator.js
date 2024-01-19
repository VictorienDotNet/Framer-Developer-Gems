/**
 * @internal
 */
export class Integrator {
    accelerationForState;
    constructor(accelerationFunction) {
        this.accelerationForState = accelerationFunction;
    }
    integrateState(state, dt) {
        const a = this.evaluateState(state);
        const b = this.evaluateStateWithDerivative(state, dt * 0.5, a);
        const c = this.evaluateStateWithDerivative(state, dt * 0.5, b);
        const d = this.evaluateStateWithDerivative(state, dt, c);
        const dxdt = (1.0 / 6.0) * (a.dx + 2.0 * (b.dx + c.dx) + d.dx);
        const dvdt = (1.0 / 6.0) * (a.dv + 2.0 * (b.dv + c.dv) + d.dv);
        state.x = state.x + dxdt * dt;
        state.v = state.v + dvdt * dt;
        return state;
    }
    evaluateState(initialState) {
        const dv = this.accelerationForState(initialState);
        return { dx: initialState.v, dv: dv };
    }
    evaluateStateWithDerivative(initialState, dt, derivative) {
        const state = {
            x: initialState.x + derivative.dx * dt,
            v: initialState.v + derivative.dv * dt,
        };
        const output = {
            dx: state.v,
            dv: this.accelerationForState(state),
        };
        return output;
    }
}
//# sourceMappingURL=Integrator.js.map