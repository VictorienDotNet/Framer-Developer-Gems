import { GestureRecognizer, State } from "./GestureRecognizer.js";
/**
 * @internal
 */
export class PanGestureRecognizer extends GestureRecognizer {
    startEvent;
    eventType = "pan";
    pointerSessionBegan(session, event) {
        this.recognize(session, event);
    }
    pointerSessionMoved(session, event) {
        this.recognize(session, event);
    }
    pointerSessionEnded(session, event) {
        this.panend(event);
    }
    recognize(session, event) {
        if (Math.abs(event.delta.x) > 0 || Math.abs(event.delta.y) > 0) {
            if (this.startEvent) {
                this.pan(event);
            }
            else {
                this.panstart(event);
            }
        }
    }
    reset() {
        this.startEvent = null;
        super.reset();
    }
    panstart(event) {
        if (!this.hasState(State.Possible) || (event.isLeftMouseClick !== undefined && !event.isLeftMouseClick)) {
            return;
        }
        this.stateSwitch(State.Began);
        this.startEvent = event;
        if (this.handler && this.startEvent.target) {
            this.handler.gestureBegan(this.eventType, event, this.startEvent.target);
        }
    }
    pan(event) {
        if (!this.hasState(State.Began | State.Changed)) {
            return;
        }
        if (!this.startEvent) {
            return;
        }
        this.stateSwitch(State.Changed);
        if (this.handler && this.startEvent.target) {
            this.handler.gestureChanged(this.eventType, event, this.startEvent.target);
        }
    }
    panend(event) {
        if (!this.hasState(State.Began | State.Changed)) {
            return;
        }
        if (!this.startEvent) {
            return;
        }
        this.stateSwitch(State.Ended);
        if (this.handler && this.startEvent.target) {
            this.handler.gestureEnded(this.eventType, event, this.startEvent.target);
        }
    }
}
//# sourceMappingURL=PanGestureRecognizer.js.map