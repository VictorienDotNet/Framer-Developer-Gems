/**
 * @internal
 */
export var State;
(function (State) {
    State[State["Possible"] = 2] = "Possible";
    State[State["Began"] = 4] = "Began";
    State[State["Changed"] = 8] = "Changed";
    State[State["Ended"] = 16] = "Ended";
    State[State["Failed"] = 32] = "Failed";
    State[State["Cancelled"] = 64] = "Cancelled";
    State[State["Recognized"] = 128] = "Recognized";
})(State || (State = {}));
function stateName(state) {
    switch (state) {
        case State.Possible:
            return "Possible";
        case State.Began:
            return "Began";
        case State.Changed:
            return "Changed";
        case State.Ended:
            return "Ended";
        case State.Failed:
            return "Failed";
        case State.Cancelled:
            return "Cancelled";
        case State.Recognized:
            return "Recognized";
        default:
            return "Unknown";
    }
}
function containsBitmask(value, bitmask) {
    return (value & bitmask) !== 0;
}
/**
 * @internal
 */
export class GestureRecognizer {
    _state = State.Possible;
    get state() {
        return this._state;
    }
    setState(state) {
        this._state = state;
    }
    handler;
    preventers = [];
    get isPrevented() {
        let prevented = false;
        for (const recognizer of this.preventers) {
            if (recognizer.state & (State.Began | State.Changed | State.Ended)) {
                prevented = true;
                break;
            }
        }
        return prevented;
    }
    canBePreventedBy(recognizer) {
        this.preventers.push(recognizer);
    }
    hasState(bitmask) {
        return containsBitmask(this.state, bitmask);
    }
    stateSwitch(newState) {
        let allowedStates;
        switch (this.state) {
            case State.Possible:
                allowedStates = State.Began | State.Recognized | State.Failed;
                break;
            case State.Began:
                allowedStates = State.Changed | State.Cancelled | State.Ended;
                break;
            case State.Changed:
                allowedStates = State.Changed | State.Cancelled | State.Ended;
                break;
            case State.Recognized:
            case State.Ended:
            case State.Cancelled:
            case State.Failed:
                allowedStates = State.Possible;
                break;
            default:
                allowedStates = 0;
        }
        if (!containsBitmask(newState, allowedStates)) {
            // eslint-disable-next-line no-console
            console.warn(`Unallowed state change from ${stateName(this.state)} to ${stateName(newState)}`);
            return;
        }
        this.setState(newState);
    }
    cancel() {
        if (this.hasState(State.Began | State.Changed)) {
            this.setState(State.Cancelled);
        }
        this.reset();
    }
    reset() {
        if (!this.hasState(State.Possible)) {
            this.stateSwitch(State.Possible);
        }
    }
}
//# sourceMappingURL=GestureRecognizer.js.map