import type { Animator as AnimatorInterface } from "../Animators/Animator.js";
import { AnimationDriver } from "./AnimationDriver.js";
/**
 * @internal
 */
export declare class MainLoopAnimationDriver<Animator extends AnimatorInterface<Value, Options>, Value, Options> extends AnimationDriver<Animator, Value, Options> {
    play(): void;
    cancel(): void;
    finish(): void;
}
//# sourceMappingURL=MainLoopDriver.d.ts.map