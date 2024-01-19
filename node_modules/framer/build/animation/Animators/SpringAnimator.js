import { Integrator } from "./Integrator.js";
import { SpringCurveValueConverter } from "./SpringCurveValueConverter.js";
export const SpringTensionFrictionDefaults = {
    tension: 500,
    friction: 10,
    tolerance: 1 / 10000,
    velocity: 0,
};
export const SpringDampingDurationDefaults = {
    dampingRatio: 1,
    duration: 1,
    velocity: 0,
    mass: 1,
};
function isDampingDurationSpringOptions(options) {
    if (!options) {
        return false;
    }
    return (typeof options.dampingRatio === "number" ||
        typeof options.duration === "number" ||
        typeof options.mass === "number");
}
/**
 * Animator class using a spring curve
 * @internal
 * @deprecated Use the `transition` prop instead
 */
export class SpringAnimator {
    interpolation;
    options;
    current;
    destination;
    difference;
    state;
    integrator;
    interpolator;
    constructor(options, interpolation) {
        this.interpolation = interpolation;
        let _opt;
        if (isDampingDurationSpringOptions(options)) {
            const toPass = { ...SpringDampingDurationDefaults, ...options };
            _opt = SpringCurveValueConverter.computeDerivedCurveOptions(toPass.dampingRatio, toPass.duration, toPass.velocity, toPass.mass);
        }
        else {
            _opt = options;
        }
        this.options = { ...SpringTensionFrictionDefaults, ..._opt };
        this.state = {
            x: 0,
            v: this.options.velocity,
        };
        this.integrator = new Integrator(state => -this.options.tension * state.x - this.options.friction * state.v);
    }
    isReady() {
        return this.interpolator !== undefined && this.difference !== undefined;
    }
    next(delta) {
        this.state = this.integrator.integrateState(this.state, delta);
        const value = this.interpolator(this.progress());
        return value;
    }
    isFinished() {
        const positionNearZero = Math.abs(this.state.x) < this.options.tolerance;
        const velocityNearZero = Math.abs(this.state.v) < this.options.tolerance;
        return positionNearZero && velocityNearZero;
    }
    setFrom(value) {
        this.current = value;
        this.updateInterpolator();
    }
    setVelocity(velocity) {
        this.state.v = velocity;
    }
    progress() {
        return 1 - this.state.x / this.difference;
    }
    // The spring always settles to 0, so we create an interpolation to the destination
    // And calculate the progress based on the current state and the span of the interpolation
    // This lets us integrate over state.x, even though Value is generic
    setTo(value) {
        this.destination = value;
        this.difference = this.interpolation.difference(this.destination, this.current);
        this.state.x = this.difference;
        this.updateInterpolator();
    }
    /** @internal */
    getState() {
        return this.state;
    }
    updateInterpolator() {
        if (this.current === undefined || this.destination === undefined) {
            return;
        }
        this.interpolator = this.interpolation.interpolate(this.current, this.destination);
    }
}
//# sourceMappingURL=SpringAnimator.js.map