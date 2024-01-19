import type { Point } from "../render/types/Point.js";
import type { FramerEvent } from "./FramerEvent.js";
import type { GestureHandler } from "./recognizer/GestureRecognizer.js";
export type EventDispatcher = (type: string, event: FramerEvent, target: EventTarget) => void;
export type NativeEvent = MouseEvent | TouchEvent;
/**
 * @internal
 */
export declare class FramerEventSession implements GestureHandler {
    private events;
    private recognizers;
    private mouseWheelRecognizer;
    private dispatcher;
    /**
     * @internal
     */
    originElement: HTMLElement;
    get isStarted(): boolean;
    get startEvent(): FramerEvent | undefined;
    get lastEvent(): FramerEvent | undefined;
    constructor(dispatcher: EventDispatcher, customOrigin?: HTMLElement);
    private processEvent;
    pointerDown(event: FramerEvent): void;
    pointerMove(event: FramerEvent): void;
    pointerUp(event: FramerEvent): void;
    mouseWheel(event: FramerEvent): void;
    private clearEvents;
    private dispatch;
    gestureBegan(type: string, event: FramerEvent, target: EventTarget | null): void;
    gestureChanged(type: string, event: FramerEvent, target: EventTarget | null): void;
    gestureEnded(type: string, event: FramerEvent, target: EventTarget | null): void;
    /**
     * Average velocity over last n seconds in pixels per second.
     * @param n - number of events to use for calculation
     */
    velocity(t?: number): Point;
    offset(event: FramerEvent): Point;
}
//# sourceMappingURL=FramerEventSession.d.ts.map