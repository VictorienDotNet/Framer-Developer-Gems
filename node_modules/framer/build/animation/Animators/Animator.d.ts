import type { Interpolation } from "../../interpolation/Interpolation.js";
/**
 * @internal
 * @deprecated  Use the `transition` prop instead
 */
export interface Animator<Value, Options = any> {
    /**
     * @internal
     */
    setFrom(from: Value): void;
    /**
     * @internal
     */
    setTo(to: Value): void;
    /**
     * @internal
     */
    isReady(): boolean;
    /**
     * @internal
     */
    next(delta: number): Value;
    /**
     * @internal
     */
    isFinished(): boolean;
}
/**
 * @public
 * @deprecated  Use the `transition` prop instead
 */
export interface AnimatorClass<Value, Options = any> {
    /**
     * @internal
     */
    new (options: Partial<Options>, interpolation: Interpolation<Value>): Animator<Value, Options>;
}
//# sourceMappingURL=Animator.d.ts.map