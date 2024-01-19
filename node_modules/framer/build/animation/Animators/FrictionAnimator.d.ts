import type { Animator } from "./Animator.js";
import { State } from "./Integrator.js";
export interface Options {
    velocity: number;
    friction: number;
    tolerance: number;
}
/**
 * @internal
 * @deprecated
 */
export declare class FrictionAnimator implements Animator<number, Partial<Options>> {
    options: Options;
    private state;
    private integrator;
    constructor(options: Partial<Options>);
    setFrom(value: number): void;
    setTo(value: number): void;
    setVelocity(velocity: number): void;
    getState(): State;
    isReady(): boolean;
    next(delta: number): number;
    isFinished(): boolean;
}
//# sourceMappingURL=FrictionAnimator.d.ts.map