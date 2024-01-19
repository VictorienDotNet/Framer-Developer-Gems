import { Loop, MainLoop } from "../core/Loop.js";
import { MouseWheelGestureRecognizer } from "./recognizer/MouseWheelGestureRecognizer.js";
import { PanGestureRecognizer } from "./recognizer/PanGestureRecognizer.js";
import { TapGestureRecognizer } from "./recognizer/TapGestureRecognizer.js";
/**
 * @internal
 */
export class FramerEventSession {
    events = [];
    recognizers = [];
    mouseWheelRecognizer = new MouseWheelGestureRecognizer();
    dispatcher;
    /**
     * @internal
     */
    originElement;
    get isStarted() {
        return this.events.length !== 0;
    }
    get startEvent() {
        return this.isStarted ? this.events[0] : undefined;
    }
    get lastEvent() {
        return this.events[this.events.length - 1];
    }
    constructor(dispatcher, customOrigin) {
        this.dispatcher = dispatcher;
        if (customOrigin) {
            this.originElement = customOrigin;
        }
        else {
            this.originElement = document.body;
        }
        const pan = new PanGestureRecognizer();
        const tap = new TapGestureRecognizer();
        pan.handler = this;
        tap.handler = this;
        this.mouseWheelRecognizer.handler = this;
        this.recognizers = [tap, pan];
    }
    // Event handling
    processEvent(event) {
        // const event = new FramerEvent(originalEvent, this)
        this.events.push(event);
        return event;
    }
    pointerDown(event) {
        if (this.isStarted) {
            return;
        }
        this.processEvent(event);
        this.recognizers.map(r => {
            r.cancel();
            r.pointerSessionBegan(this, event);
        });
    }
    pointerMove(event) {
        if (!this.isStarted) {
            return;
        }
        this.processEvent(event);
        this.recognizers.map(r => {
            r.pointerSessionMoved(this, event);
        });
    }
    pointerUp(event) {
        if (!this.isStarted) {
            return;
        }
        this.processEvent(event);
        this.recognizers.map(r => {
            r.pointerSessionEnded(this, event);
        });
        this.clearEvents();
        this.recognizers.map(r => {
            r.reset();
        });
    }
    mouseWheel(event) {
        this.processEvent(event);
        this.mouseWheelRecognizer.mouseWheel(this, event);
        this.clearEvents();
    }
    clearEvents() {
        this.events = [];
    }
    dispatch(type, event, target = null) {
        const dispatchTarget = target || (this.startEvent && this.startEvent.target) || event.target;
        if (dispatchTarget) {
            this.dispatcher(type, event, dispatchTarget);
        }
    }
    // Gesture Handler
    gestureBegan(type, event, target) {
        this.dispatch(`${type}start`, event, target);
    }
    gestureChanged(type, event, target) {
        this.dispatch(type, event, target);
    }
    gestureEnded(type, event, target) {
        this.dispatch(`${type}end`, event, target);
    }
    // Calculatinos
    /**
     * Average velocity over last n seconds in pixels per second.
     * @param n - number of events to use for calculation
     */
    velocity(t = Loop.TimeStep * 2) {
        if (!this.isStarted || this.events.length < 2) {
            return { x: 0, y: 0 };
        }
        const events = this.events;
        let i = events.length - 1;
        let event = null;
        while (i >= 0) {
            event = events[i] ?? null;
            if (!event || MainLoop.time - event.loopTime > t) {
                break;
            }
            i--;
        }
        if (!event) {
            return { x: 0, y: 0 };
        }
        const current = events[events.length - 1];
        if (!current) {
            return { x: 0, y: 0 };
        }
        const time = (MainLoop.time - event.loopTime) * 1000;
        if (time === 0) {
            return { x: 0, y: 0 };
        }
        const velocity = {
            x: (current.devicePoint.x - event.devicePoint.x) / time,
            y: (current.devicePoint.y - event.devicePoint.y) / time,
        };
        if (velocity.x === Infinity) {
            velocity.x = 0;
        }
        if (velocity.y === Infinity) {
            velocity.y = 0;
        }
        return velocity;
    }
    offset(event) {
        if (!this.startEvent) {
            return { x: 0, y: 0 };
        }
        // TODO: externalize:
        const subtract = (pointA, pointB) => {
            return {
                x: pointA.x - pointB.x,
                y: pointA.y - pointB.y,
            };
        };
        return subtract(event.devicePoint, this.startEvent.devicePoint);
    }
}
//# sourceMappingURL=FramerEventSession.js.map