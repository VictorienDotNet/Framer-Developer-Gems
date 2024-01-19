import type { Interpolation } from "../../interpolation/Interpolation.js";
import type { Animator } from "./Animator.js";
import { State } from "./Integrator.js";
export declare const SpringTensionFrictionDefaults: TensionFrictionSpringOptions;
export declare const SpringDampingDurationDefaults: DampingDurationSpringOptions;
export interface TensionFrictionSpringOptions {
    tension: number;
    friction: number;
    tolerance: number;
    velocity: number;
}
export interface DampingDurationSpringOptions {
    dampingRatio: number;
    duration: number;
    velocity: number;
    mass: number;
}
export type SpringOptions = TensionFrictionSpringOptions | DampingDurationSpringOptions;
/**
 * Animator class using a spring curve
 * @internal
 * @deprecated Use the `transition` prop instead
 */
export declare class SpringAnimator<Value> implements Animator<Value, SpringOptions> {
    private interpolation;
    private options;
    private current;
    private destination;
    private difference;
    private state;
    private integrator;
    private interpolator;
    constructor(options: Partial<SpringOptions>, interpolation: Interpolation<Value>);
    isReady(): boolean;
    next(delta: number): Value;
    isFinished(): boolean;
    setFrom(value: Value): void;
    setVelocity(velocity: number): void;
    progress(): number;
    setTo(value: Value): void;
    /** @internal */
    getState(): State;
    updateInterpolator(): void;
}
//# sourceMappingURL=SpringAnimator.d.ts.map