import { GestureRecognizer, State } from "./GestureRecognizer.js";
/**
 * @internal
 */
export class TapGestureRecognizer extends GestureRecognizer {
    eventType = "tap";
    pointerSessionBegan(session, event) {
        if (this.handler && (event.isLeftMouseClick === undefined || event.isLeftMouseClick)) {
            this.handler.gestureBegan(this.eventType, event, null);
        }
    }
    pointerSessionMoved(session, event) { }
    pointerSessionEnded(session, event) {
        if (this.isPrevented) {
            this.stateSwitch(State.Failed);
        }
        else if (!session.startEvent || session.startEvent.target === event.target) {
            this.stateSwitch(State.Recognized);
            if (this.handler) {
                this.handler.gestureChanged(this.eventType, event, null);
            }
        }
        else {
            this.stateSwitch(State.Failed);
        }
        if (this.handler) {
            this.handler.gestureEnded(this.eventType, event, null);
        }
    }
}
//# sourceMappingURL=TapGestureRecognizer.js.map