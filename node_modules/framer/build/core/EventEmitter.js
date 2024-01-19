import EE3 from "eventemitter3";
const { EventEmitter: EventEmitter3 } = EE3;
export class EventEmitter {
    _emitter = new EventEmitter3();
    eventNames() {
        return this._emitter.eventNames();
    }
    eventListeners() {
        const listeners = {};
        for (const eventName of this._emitter.eventNames()) {
            listeners[eventName] = this._emitter.listeners(eventName);
        }
        return listeners;
    }
    on(eventName, fn) {
        this.addEventListener(eventName, fn, false, false, this);
    }
    off(eventName, fn) {
        this.removeEventListeners(eventName, fn);
    }
    once(eventName, fn) {
        this.addEventListener(eventName, fn, true, false, this);
    }
    unique(eventName, fn) {
        this.addEventListener(eventName, fn, false, true, this);
    }
    addEventListener(eventName, fn, once, unique, context) {
        if (unique) {
            for (const name of this._emitter.eventNames()) {
                if (fn === this._emitter.listeners(name)) {
                    return;
                }
            }
        }
        if (once === true) {
            this._emitter.once(eventName, fn, context);
        }
        else {
            this._emitter.addListener(eventName, fn, context);
        }
    }
    removeEventListeners(eventName, fn) {
        if (eventName) {
            this._emitter.removeListener(eventName, fn);
        }
        else {
            this.removeAllEventListeners();
        }
    }
    removeAllEventListeners() {
        this._emitter.removeAllListeners();
    }
    countEventListeners(eventName, handler) {
        if (eventName) {
            return this._emitter.listeners(eventName).length;
        }
        else {
            let count = 0;
            for (const name of this._emitter.eventNames()) {
                count += this._emitter.listeners(name).length;
            }
            return count;
        }
    }
    emit(eventName, ...args) {
        this._emitter.emit(eventName, ...args);
    }
}
//# sourceMappingURL=EventEmitter.js.map