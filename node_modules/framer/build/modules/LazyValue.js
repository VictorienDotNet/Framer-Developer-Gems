import { assertNever } from "../utils/assert.js";
/**
 * LazyValue can be used with dynamic imports to load a value asynchronously
 * with Suspense and render it when it's ready.
 */
export class LazyValue {
    resolver;
    static is(value) {
        return value instanceof LazyValue;
    }
    status;
    constructor(resolver) {
        this.resolver = resolver;
    }
    /** Preload the value so it can be read() later. */
    preload() {
        if (this.status) {
            const status = this.status;
            // The value was already preloaded.
            if (status.type !== "pending")
                return;
            // The value is currently preloading.
            return status.promise;
        }
        // The value is not preloaded.
        const promise = this.resolver().then(value => {
            this.status = {
                type: "fulfilled",
                value,
            };
        }, error => {
            this.status = {
                type: "rejected",
                error,
            };
        });
        this.status = {
            type: "pending",
            promise,
        };
        return promise;
    }
    /** Synchronously read the value after calling preload() before. */
    read() {
        const status = this.status;
        if (!status) {
            throw new Error("Need to call preload() before read()");
        }
        switch (status.type) {
            case "pending":
                throw new Error("Need to wait for preload() to resolve");
            case "fulfilled":
                return status.value;
            case "rejected":
                throw status.error;
            default:
                assertNever(status);
        }
    }
}
//# sourceMappingURL=LazyValue.js.map