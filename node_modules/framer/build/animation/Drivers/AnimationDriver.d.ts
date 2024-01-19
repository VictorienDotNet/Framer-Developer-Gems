import type { Animator as AnimatorInterface } from "../Animators/Animator.js";
/**
 * @internal
 */
export interface DriverClass<AnimatorClass extends AnimatorInterface<Value, Options>, Value, Options = any> {
    new (animator: AnimatorClass, updateCallback: (value: Value) => void, doneCallback?: (isFinished: boolean) => void): AnimationDriver<AnimatorClass, Value, Options>;
}
/**
 * @public
 */
export interface AnimationInterface {
    /**
     * @internal
     */
    play(): void;
    cancel(): void;
    /**
     * @internal
     */
    finish(): void;
    isFinished(): boolean;
}
/**
 * @internal
 */
export declare abstract class AnimationDriver<AnimatorClass extends AnimatorInterface<Value, Options>, Value, Options> implements AnimationInterface {
    animator: AnimatorClass;
    protected updateCallback: (value: Value) => void;
    protected finishedCallback?: ((isFinished: boolean) => void) | undefined;
    constructor(animator: AnimatorClass, updateCallback: (value: Value) => void, finishedCallback?: ((isFinished: boolean) => void) | undefined);
    abstract play(): void;
    protected update: (frame: number, elapsed: number) => void;
    abstract cancel(): void;
    finish(): void;
    isFinished(): boolean;
}
//# sourceMappingURL=AnimationDriver.d.ts.map