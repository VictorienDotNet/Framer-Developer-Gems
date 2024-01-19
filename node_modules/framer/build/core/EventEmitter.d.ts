import type { ListenerFn } from "eventemitter3";
export declare class EventEmitter<EventName> {
    private _emitter;
    eventNames(): string[];
    eventListeners(): {
        [index: string]: ListenerFn[];
    };
    on(eventName: EventName, fn: Function): void;
    off(eventName: EventName, fn: Function): void;
    once(eventName: EventName, fn: Function): void;
    unique(eventName: EventName, fn: Function): void;
    addEventListener(eventName: EventName, fn: Function, once: boolean, unique: boolean, context: Record<string, any>): void;
    removeEventListeners(eventName?: EventName, fn?: Function): void;
    removeAllEventListeners(): void;
    countEventListeners(eventName?: EventName, handler?: Function): number;
    emit(eventName: EventName, ...args: any[]): void;
}
//# sourceMappingURL=EventEmitter.d.ts.map