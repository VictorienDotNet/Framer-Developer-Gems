import { Integrator } from "./Integrator.js";
/**
 * @internal
 * @deprecated
 */
export class FrictionAnimator {
    options;
    state;
    integrator;
    constructor(options) {
        this.options = {
            velocity: 0,
            friction: 2,
            tolerance: 1 / 10,
        };
        Object.assign(this.options, options);
        this.state = {
            x: 0,
            v: this.options.velocity,
        };
        this.integrator = new Integrator(state => -(this.options.friction * state.v));
    }
    setFrom(value) {
        this.state.x = value;
    }
    setTo(value) { }
    setVelocity(velocity) {
        this.state.v = velocity;
    }
    getState() {
        return this.state;
    }
    isReady() {
        return true;
    }
    next(delta) {
        this.state = this.integrator.integrateState(this.state, delta);
        return this.state.x;
    }
    isFinished() {
        return Math.abs(this.state.v) < this.options.tolerance;
    }
}
//# sourceMappingURL=FrictionAnimator.js.map