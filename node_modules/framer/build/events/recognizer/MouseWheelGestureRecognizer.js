import { debounce } from "../../render/utils/debounce.js";
import { GestureRecognizer, State } from "./GestureRecognizer.js";
/**
 * @internal
 */
export class MouseWheelGestureRecognizer extends GestureRecognizer {
    startEvent;
    eventType = "mousewheel";
    pointerSessionBegan(session, event) { }
    pointerSessionMoved(session, event) { }
    pointerSessionEnded(session, event) { }
    mouseWheel(session, event) {
        if (!this.handler)
            return;
        if (this.hasState(State.Possible)) {
            this.startEvent = event;
            this.stateSwitch(State.Began);
            this.handler.gestureBegan(this.eventType, event, this.startEvent.target);
            return;
        }
        if (this.hasState(State.Began | State.Changed) && this.startEvent) {
            this.stateSwitch(State.Changed);
            this.handler.gestureChanged(this.eventType, event, this.startEvent.target);
        }
        this.onMouseWheelEnd(event);
    }
    onMouseWheelEnd = debounce((event) => {
        if (this.handler && this.startEvent) {
            this.stateSwitch(State.Ended);
            this.handler.gestureEnded(this.eventType, event, this.startEvent.target);
            this.startEvent = null;
            this.reset();
        }
    }, 300);
}
//# sourceMappingURL=MouseWheelGestureRecognizer.js.map