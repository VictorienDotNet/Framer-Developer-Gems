/**
 * @internal
 */
export class Observers {
    observers = new Set();
    transactions = {};
    add(observer) {
        this.observers.add(observer);
        let isCalled = false;
        return () => {
            if (isCalled) {
                return;
            }
            isCalled = true;
            this.remove(observer);
        };
    }
    remove(observer) {
        this.observers.delete(observer);
    }
    notify(change, transaction) {
        if (transaction) {
            const accumulatedChange = this.transactions[transaction] || change;
            accumulatedChange.value = change.value;
            this.transactions[transaction] = accumulatedChange;
        }
        else {
            this.callObservers(change);
        }
    }
    finishTransaction(transaction) {
        const accumulatedChange = this.transactions[transaction];
        delete this.transactions[transaction];
        return this.callObservers(accumulatedChange, transaction);
    }
    callObservers(change, transaction) {
        const finishObservers = [];
        // Make a copy and de-duplicate so we always call all handlers,
        // even if the handler array changes because of handler call
        new Set(this.observers).forEach(observer => {
            if (typeof observer === "function") {
                observer(change, transaction);
            }
            else {
                observer.update(change, transaction);
                finishObservers.push(observer.finish);
            }
        });
        return finishObservers;
    }
}
//# sourceMappingURL=Observers.js.map