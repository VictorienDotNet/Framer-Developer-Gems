import type { Animator } from "./Animator.js";
import type { State } from "./Integrator.js";
import { FrictionAnimator } from "./FrictionAnimator.js";
import { SpringAnimator } from "./SpringAnimator.js";
export declare const Defaults: {
    velocity: number;
    min: number;
    max: number;
    momentum: {
        friction: number;
        tolerance: number;
    };
    bounce: {
        tension: number;
        friction: number;
        tolerance: number;
    };
};
export type Options = typeof Defaults;
/**
 * @internal
 * @deprecated
 */
export declare class InertialScrollAnimator implements Animator<number, Options> {
    private options;
    private current;
    private frictionAnimator;
    private springAnimator;
    private useSpring;
    constructor(options: Partial<Options>);
    isReady(): boolean;
    next(delta: number): number;
    get currentAnimator(): SpringAnimator<number> | FrictionAnimator;
    isFinished(): boolean;
    get state(): State;
    setFrom(value: number): void;
    setState(state: State): void;
    setTo(destination: number): void;
    setLimits(min: number, max: number): void;
    private tryTransitionToSpring;
    private transitionToSpring;
    private isValidState;
}
//# sourceMappingURL=InertialScrollAnimator.d.ts.map