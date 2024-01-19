import { Animatable, isAnimatable, } from "../animation/Animatable/Animatable.js";
import { Observers } from "../animation/Animatable/Observers.js";
const hasOwnProperty = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
/**
 * @internal
 */
export const ObservableObject = /* @__PURE__ */ (() => {
    /**
     * @internal
     */
    function ObservableObject(initial = {}, makeAnimatables = false, observeAnimatables = true) {
        const unproxiedState = {};
        unproxiedState[$private] = {
            makeAnimatables,
            observeAnimatables,
            observers: new Observers(),
            reset() {
                for (const key in state) {
                    if (hasOwnProperty(state, key)) {
                        state[key] = hasOwnProperty(initial, key) ? initial[key] : undefined;
                    }
                }
            },
            transactions: new Set(),
        };
        const state = new Proxy(unproxiedState, sharedProxyHandler);
        Object.assign(state, initial);
        return state;
    }
    ObservableObject.resetObject = (target) => {
        return target[$private].reset();
    };
    ObservableObject.addObserver = (target, observer) => {
        return target[$private].observers.add(observer);
    };
    return ObservableObject;
})();
class ObservableObjectProxyHandler {
    set = (target, key, value, receiver) => {
        if (key === $private) {
            return false;
        }
        const privateObject = target[$private];
        let animatable;
        let rawValue;
        if (isAnimatable(value)) {
            animatable = value;
            rawValue = animatable.get();
        }
        else {
            rawValue = value;
        }
        // With the animatable flag, make every value animatable
        if (privateObject.makeAnimatables && typeof value !== "function" && typeof value !== "object" && !animatable) {
            animatable = Animatable(value);
        }
        if (privateObject.observeAnimatables && animatable) {
            const transactions = privateObject.transactions;
            animatable.onUpdate({
                update: (change, transaction) => {
                    if (transaction) {
                        transactions.add(transaction);
                    }
                    privateObject.observers.notify({ value: receiver }, transaction);
                },
                finish: (transaction) => {
                    if (transactions.delete(transaction)) {
                        privateObject.observers.finishTransaction(transaction);
                    }
                },
            });
        }
        let result = false;
        let changed = true;
        if (target[key] !== undefined) {
            // If the key already exists handle it differently
            if (isAnimatable(target[key])) {
                changed = target[key].get() !== rawValue;
                target[key].set(rawValue);
            }
            else {
                changed = target[key] !== rawValue;
                target[key] = rawValue;
            }
            const rawValueIsObject = rawValue !== null && typeof rawValue === "object";
            if (Array.isArray(rawValue) || rawValueIsObject)
                changed = true;
            result = true;
        }
        else {
            // Use the animatable value if it exists
            if (animatable) {
                value = animatable;
            }
            result = Reflect.set(target, key, value);
        }
        if (changed) {
            privateObject.observers.notify({ value: receiver });
        }
        return result;
    };
    get = (target, key, receiver) => {
        if (key === $private) {
            return target[key];
        }
        const value = Reflect.get(target, key, receiver);
        // Bind functions to the receiver, so we can use `this`
        return typeof value === "function" ? value.bind(receiver) : value;
    };
    deleteProperty(target, key) {
        const result = Reflect.deleteProperty(target, key);
        target[$private].observers.notify({ value: target });
        return result;
    }
    ownKeys(target) {
        const keys = Reflect.ownKeys(target);
        const privateIndex = keys.indexOf($private);
        if (privateIndex !== -1) {
            keys.splice(privateIndex, 1);
        }
        return keys;
    }
    getOwnPropertyDescriptor(target, key) {
        if (key === $private) {
            return undefined;
        }
        return Reflect.getOwnPropertyDescriptor(target, key);
    }
}
// Shared handler
const sharedProxyHandler = /* @__PURE__ */ new ObservableObjectProxyHandler();
const $private = /* @__PURE__ */ Symbol("private");
//# sourceMappingURL=ObservableObject.js.map