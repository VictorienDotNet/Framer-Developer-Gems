import type { Cancel, Change, TransactionId } from "./Animatable.js";
/**
 * @public
 */
export type UpdateFunction<Value> = (change: Change<Value> | undefined, transaction?: TransactionId) => void;
/**
 * @public
 */
export type FinishFunction = (transaction: TransactionId) => void;
/**
 * @public
 */
export type Observer<Value> = {
    update: UpdateFunction<Value>;
    finish: FinishFunction;
} | UpdateFunction<Value>;
/**
 * @public
 */
export interface UpdateObserver<Value> {
    onUpdate(handler: Observer<Value>): Cancel;
}
/**
 * @internal
 */
export declare class Observers<Value> {
    private observers;
    private transactions;
    add(observer: Observer<Value>): Cancel;
    private remove;
    notify(change: Change<Value>, transaction?: TransactionId): void;
    finishTransaction(transaction: TransactionId): FinishFunction[];
    private callObservers;
}
//# sourceMappingURL=Observers.d.ts.map