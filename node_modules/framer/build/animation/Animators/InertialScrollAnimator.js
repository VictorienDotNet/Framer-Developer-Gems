import { NumberInterpolation } from "../../interpolation/NumberInterpolation.js";
import { FrictionAnimator } from "./FrictionAnimator.js";
import { SpringAnimator } from "./SpringAnimator.js";
export const Defaults = {
    velocity: 0,
    min: 0,
    max: 0,
    momentum: {
        friction: 2,
        tolerance: 10,
    },
    bounce: {
        tension: 500,
        friction: 10,
        tolerance: 1,
    },
};
/**
 * @internal
 * @deprecated
 */
export class InertialScrollAnimator {
    options;
    current;
    frictionAnimator;
    springAnimator;
    useSpring;
    constructor(options) {
        this.options = Object.assign({ ...Defaults }, options);
        this.frictionAnimator = new FrictionAnimator({
            friction: this.options.momentum.friction,
            tolerance: this.options.momentum.tolerance,
            velocity: this.options.velocity,
        });
        this.springAnimator = new SpringAnimator({
            tension: this.options.bounce.tension,
            friction: this.options.bounce.friction,
            tolerance: this.options.bounce.tolerance,
            velocity: this.options.velocity,
        }, NumberInterpolation);
        this.useSpring = false;
    }
    isReady() {
        return true;
    }
    next(delta) {
        this.current = this.currentAnimator.next(delta);
        if (!this.useSpring) {
            this.tryTransitionToSpring();
        }
        // console.log(this.current, this.useSpring)
        return this.current;
    }
    get currentAnimator() {
        if (this.useSpring) {
            return this.springAnimator;
        }
        return this.frictionAnimator;
    }
    isFinished() {
        return this.currentAnimator.isFinished();
    }
    get state() {
        return this.currentAnimator.getState();
    }
    setFrom(value) {
        this.setState({ x: value, v: this.state.v });
    }
    setState(state) {
        this.frictionAnimator.setFrom(state.x);
        this.frictionAnimator.setVelocity(state.v);
        if (this.isValidState()) {
            return this.tryTransitionToSpring();
        }
        else {
            let bound = 0;
            if (this.state.x <= this.options.min) {
                bound = this.options.min;
            }
            if (this.state.x >= this.options.max) {
                bound = this.options.max;
            }
            return this.transitionToSpring(bound);
        }
    }
    setTo(destination) {
        this.frictionAnimator.setTo(destination);
        this.springAnimator.setTo(destination);
    }
    setLimits(min, max) {
        this.options.min = min;
        this.options.max = max;
    }
    // If the position is outside the min and max bounds, and traveling
    // further away, then transition from friction to spring animation
    tryTransitionToSpring() {
        const belowMinWithVelocity = this.state.x < this.options.min && this.state.v <= 0;
        const aboveMaxWithVelocity = this.state.x > this.options.max && this.state.v >= 0;
        if (belowMinWithVelocity || aboveMaxWithVelocity) {
            let bound;
            if (belowMinWithVelocity) {
                bound = this.options.min;
            }
            else {
                bound = this.options.max;
            }
            this.transitionToSpring(bound);
        }
        else {
            this.useSpring = false;
        }
    }
    transitionToSpring(bound) {
        this.springAnimator.setFrom(this.state.x);
        this.springAnimator.setVelocity(this.state.v);
        this.springAnimator.setTo(bound);
        this.useSpring = true;
    }
    // If the position is outside the min and max bounds, but traveling
    // back towards the bounds, check if the velocity is sufficient to
    // carry the position back within bounds. If it is, let friction do the
    // work. If not, the state is invalid, so use the spring.
    isValidState() {
        // Note that if velocity is 0, the state is still valid (should use spring,
        // not friction), and we don't want to divide by 0 later in the check.
        const belowMinTravelingBack = this.state.x < this.options.min && this.state.v > 0;
        const aboveMaxTravelingBack = this.state.x > this.options.max && this.state.v < 0;
        if (belowMinTravelingBack || aboveMaxTravelingBack) {
            let bound;
            if (belowMinTravelingBack) {
                bound = this.options.min;
            }
            else {
                bound = this.options.max;
            }
            const friction = this.frictionAnimator.options.friction;
            const solution = 1 - (friction * (bound - this.state.x)) / this.state.v;
            return solution > 0;
        }
        return true;
    }
}
//# sourceMappingURL=InertialScrollAnimator.js.map