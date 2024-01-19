import type { MotionValue } from "framer-motion";
import { FinishFunction, UpdateObserver } from "./Observers.js";
/** @public */
export type Cancel = () => void;
/**
 * @public
 */
export type TransactionId = number;
export interface Change<Value> {
    value: Value;
    oldValue?: Value;
}
export type ToAnimatable<PossiblyAnimatable> = PossiblyAnimatable extends Animatable<infer Value> ? Animatable<Value> : Animatable<PossiblyAnimatable>;
export type FromAnimatable<PossiblyAnimatable> = PossiblyAnimatable extends Animatable<infer Value> ? Value : PossiblyAnimatable;
export type ToAnimatableOrValue<PossiblyAnimatable> = PossiblyAnimatable extends Animatable<infer Value> ? Value | Animatable<Value> : PossiblyAnimatable | Animatable<PossiblyAnimatable>;
/** @public */
export type AnimatableObject<T> = {
    [K in keyof T]: ToAnimatableOrValue<T[K]>;
};
/**
 * @public
 * @deprecated
 */
export type DeprecatedAnimationTarget<Value> = Animatable<Value> | AnimatableObject<Value> | MotionValue<Value>;
/**
 * @public
 * @deprecated Use {@link useMotionValue} instead
 */
export interface Animatable<Value> extends UpdateObserver<Value> {
    /**
     * Get the current value out of this Animatable object
     * @remarks
     * ```jsx
     * const a = Animatable(0)
     * a.get() // returns 0
     * await animate(a, 42)
     * a.get() // returns 42
     * ```
     * @returns Current value
     * @public
     */
    get(): Value;
    /**
     * Set a new value to a animatable object
     * @remarks
     * The passed value can be an Animatable value too
     * ```jsx
     * const a = Animatable(0)
     * const b = Animatable(100)
     * a.set(42)
     * a.get() // returns 42
     * a.set(b)
     * a.get() // returns 100
     * ```
     * @param value - New value to set to the animatable
     * @public
     */
    set(value: Value | Animatable<Value>): void;
    /**
     * @public
     */
    set(value: Value | Animatable<Value>, transaction?: TransactionId): void;
    /**
     * @internal
     */
    finishTransaction(transaction: TransactionId): FinishFunction[];
}
/**
 * @public
 */
export declare const Animatable: {
    <Value>(value: Value | Animatable<Value>): Animatable<Value>;
    /**
     * @internal
     */
    transaction(update: (updater: (animatable: Animatable<any>, value: any) => void, transactionId: TransactionId) => void): void;
    /**
     * @public
     */
    getNumber(value: number | Animatable<number> | null | undefined, defaultValue?: number): number;
    /** @internal */
    get<Value_1>(value: Value_1 | Animatable<Value_1> | null | undefined, defaultValue: Value_1): Value_1;
    /**
     * @internal
     */
    objectToValues<Object_1>(object: AnimatableObject<Object_1>): Object_1;
};
/**
 * @internal
 * @deprecated
 */
export declare function isAnimatable(value: any): value is Animatable<any>;
//# sourceMappingURL=Animatable.d.ts.map