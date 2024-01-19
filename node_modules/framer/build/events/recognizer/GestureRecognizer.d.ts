import type { FramerEvent } from "../FramerEvent.js";
import type { FramerEventSession } from "../FramerEventSession.js";
/**
 * @internal
 */
export declare enum State {
    Possible = 2,
    Began = 4,
    Changed = 8,
    Ended = 16,
    Failed = 32,
    Cancelled = 64,
    Recognized = 128
}
/**
 * @internal
 */
export declare abstract class GestureRecognizer {
    private _state;
    get state(): State;
    private setState;
    handler: GestureHandler | null;
    preventers: GestureRecognizer[];
    get isPrevented(): boolean;
    abstract pointerSessionBegan(session: FramerEventSession, event: FramerEvent): void;
    abstract pointerSessionMoved(session: FramerEventSession, event: FramerEvent): void;
    abstract pointerSessionEnded(session: FramerEventSession, event: FramerEvent): void;
    canBePreventedBy(recognizer: GestureRecognizer): void;
    hasState(bitmask: State): boolean;
    stateSwitch(newState: State): void;
    cancel(): void;
    reset(): void;
}
/**
 * @internal
 */
export interface GestureHandler {
    gestureBegan: (type: string, event: FramerEvent, target: EventTarget | null) => void;
    gestureChanged: (type: string, event: FramerEvent, target: EventTarget | null) => void;
    gestureEnded: (type: string, event: FramerEvent, target: EventTarget | null) => void;
}
//# sourceMappingURL=GestureRecognizer.d.ts.map