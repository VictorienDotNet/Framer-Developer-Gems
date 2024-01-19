import type { FramerEvent } from "../FramerEvent.js";
import type { FramerEventSession } from "../FramerEventSession.js";
import { GestureRecognizer } from "./GestureRecognizer.js";
/**
 * @internal
 */
export declare class MouseWheelGestureRecognizer extends GestureRecognizer {
    private startEvent;
    readonly eventType = "mousewheel";
    pointerSessionBegan(session: FramerEventSession, event: FramerEvent): void;
    pointerSessionMoved(session: FramerEventSession, event: FramerEvent): void;
    pointerSessionEnded(session: FramerEventSession, event: FramerEvent): void;
    mouseWheel(session: FramerEventSession, event: FramerEvent): void;
    private onMouseWheelEnd;
}
//# sourceMappingURL=MouseWheelGestureRecognizer.d.ts.map