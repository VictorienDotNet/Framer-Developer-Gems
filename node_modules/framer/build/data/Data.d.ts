import type { Cancel } from "../animation/Animatable/Animatable.js";
import type { Observer } from "../animation/Animatable/Observers.js";
export declare const Data: {
    <T extends object = object>(initial?: object | Partial<T>): T;
    /**
     * @internal
     */
    _stores: object[];
    /** @internal */
    addData(_data: object): void;
    /** @internal */
    reset(): void;
    /** @internal */
    addObserver<T_1 extends object>(target: T_1, observer: Observer<T_1>): Cancel;
};
//# sourceMappingURL=Data.d.ts.map