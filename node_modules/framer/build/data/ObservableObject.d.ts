import { AnimatableObject, Cancel } from "../animation/Animatable/Animatable.js";
import { Observer } from "../animation/Animatable/Observers.js";
/**
 * @internal
 */
export declare const ObservableObject: {
    <T extends object = object>(initial?: object | Partial<T>, makeAnimatables?: boolean, observeAnimatables?: boolean): AnimatableObject<T>;
    resetObject<T_1 extends object>(target: T_1): any;
    addObserver<T_2 extends object>(target: T_2, observer: Observer<T_2>): Cancel;
};
//# sourceMappingURL=ObservableObject.d.ts.map