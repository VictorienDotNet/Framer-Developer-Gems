import type { FramerEvent } from "../FramerEvent.js";
import type { FramerEventSession } from "../FramerEventSession.js";
import { GestureRecognizer } from "./GestureRecognizer.js";
/**
 * @internal
 */
export declare class PanGestureRecognizer extends GestureRecognizer {
    private startEvent;
    readonly eventType = "pan";
    pointerSessionBegan(session: FramerEventSession, event: FramerEvent): void;
    pointerSessionMoved(session: FramerEventSession, event: FramerEvent): void;
    pointerSessionEnded(session: FramerEventSession, event: FramerEvent): void;
    recognize(session: FramerEventSession, event: FramerEvent): void;
    reset(): void;
    panstart(event: FramerEvent): void;
    pan(event: FramerEvent): void;
    panend(event: FramerEvent): void;
}
//# sourceMappingURL=PanGestureRecognizer.d.ts.map