import type { FramerEvent } from "../FramerEvent.js";
import type { FramerEventSession } from "../FramerEventSession.js";
import { GestureRecognizer } from "./GestureRecognizer.js";
/**
 * @internal
 */
export declare class TapGestureRecognizer extends GestureRecognizer {
    readonly eventType = "tap";
    pointerSessionBegan(session: FramerEventSession, event: FramerEvent): void;
    pointerSessionMoved(session: FramerEventSession, event: FramerEvent): void;
    pointerSessionEnded(session: FramerEventSession, event: FramerEvent): void;
}
//# sourceMappingURL=TapGestureRecognizer.d.ts.map