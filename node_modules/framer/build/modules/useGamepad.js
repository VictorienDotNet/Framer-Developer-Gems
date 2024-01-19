import React from "react";
import { useOnCurrentTargetChange } from "../components/NavigationTargetContext.js";
import { useConstant } from "../components/utils/useConstant.js";
import { safeWindow } from "../utils/safeWindow.js";
import { isObject } from "../utils/utils.js";
/** @internal */
export function isFramerGamepadKeydownData(value) {
    return isObject(value) && value.mapping !== undefined;
}
function gamepadInputsHaveChanged(previous, current) {
    if (previous.length !== current.length)
        return true;
    if (!previous.every((item, i) => current[i] === item))
        return true;
    return false;
}
/**
 * Exported for testing.
 * @internal
 */
export function createGamepadPoller() {
    const handlers = new Set();
    let isConnected = false;
    let isPolling = null;
    let lastKeys = [];
    const startPolling = () => {
        const input = getGamepadInputs();
        // Don't do anything if no gamepad is connected
        if (!input)
            return;
        const { gamepad, inputs } = input;
        const { mapping, id } = gamepad;
        // Each frame only knows its own last pressed key. If two continuous
        // frames both have gamepad events binding on the same key, we don't
        // want to fire two events in a row.
        if (gamepadInputsHaveChanged(lastKeys, inputs))
            handlers.forEach(handler => handler({ inputs, mapping, id }));
        lastKeys = inputs;
        isPolling = safeWindow.requestAnimationFrame(startPolling);
    };
    const handleConnection = () => {
        if (isConnected || isPolling)
            return;
        startPolling();
        isConnected = true;
    };
    const stopPolling = () => {
        if (!isPolling)
            return;
        safeWindow.cancelAnimationFrame(isPolling);
        isPolling = null;
    };
    const handleDisconnection = () => {
        if (!isConnected)
            return;
        stopPolling();
        isConnected = false;
    };
    const setupAndStartPolling = () => {
        if (isPolling)
            return;
        const gamepad = getGamepadInputs();
        if (!gamepad) {
            // @NOTE: gamepadconnected only exists on window
            // https://developer.mozilla.org/en-US/docs/Web/API/Window/gamepadconnected_event
            safeWindow.addEventListener("gamepadconnected", handleConnection);
            return;
        }
        // Even if we haven't connected yet, we need to make sure we disconnect
        // in the future.
        safeWindow.addEventListener("gamepaddisconnected", handleDisconnection);
        isConnected = true;
        startPolling();
    };
    const cleanupAndStopPolling = () => {
        if (!isPolling)
            return;
        // If the gamepad is already connected, then this event has no use
        // anymore; if the gamepad is not connected yet, we will only listen to
        // it when start polling. So we should remove the event listener anyway.
        safeWindow.removeEventListener("gamepadconnected", handleConnection);
        safeWindow.removeEventListener("gamepaddisconnected", handleDisconnection);
        stopPolling();
    };
    return {
        register(callback) {
            if (handlers.size === 0)
                setupAndStartPolling();
            handlers.add(callback);
        },
        unregister(callback) {
            handlers.delete(callback);
            if (handlers.size === 0)
                cleanupAndStopPolling();
        },
    };
}
const gamepadPoller = /* @__PURE__ */ createGamepadPoller();
/** @internal */
export const GamepadContext = /* @__PURE__ */ React.createContext(gamepadPoller);
/**
 * Return the first gamepad that has input together with the input keys. If
 * there's no input, return the first available gamepad. If there's no gamepad
 * connected, return null.
 */
function getGamepadInputs() {
    let firstConnectedGamepad = null;
    const gamepads = navigator.getGamepads();
    for (const gamepad of gamepads) {
        if (!gamepad)
            continue;
        if (!firstConnectedGamepad)
            firstConnectedGamepad = gamepad;
        const inputs = [...scanPressedAxis(gamepad), ...scanPressedButtons(gamepad)];
        if (inputs.length > 0)
            return { gamepad, inputs };
    }
    if (firstConnectedGamepad)
        return { gamepad: firstConnectedGamepad, inputs: [] };
    return null;
}
function scanPressedAxis(gamepad) {
    const axes = [];
    for (const [idx, axis] of gamepad.axes.entries()) {
        // Normally axis 0&1 are allocated for the left stick, and 3&4 for the
        // right stick. Depending on the browser, some controllers can have more
        // than 4 axes. For example, in safari, a PS5 Dualsense controller has
        // its axis 4&5 for the left/right triggers, that are set to -1 when
        // idling. We don't want these axes to be taken as pressed.
        if (idx > 3)
            continue;
        if (axis <= -0.5)
            axes.push(`Axis ${idx}-`);
        if (axis > 0.5)
            axes.push(`Axis ${idx}+`);
    }
    return axes;
}
function scanPressedButtons(gamepad) {
    const buttons = [];
    for (const [idx, button] of gamepad.buttons.entries()) {
        if (isButtonPressed(button))
            buttons.push(`Button ${idx}`);
    }
    return buttons;
}
function isButtonPressed(button) {
    // button.value represents the current state of analog buttons
    return button.pressed === true || button.value > 0;
}
/**
 * Register a callback to be executed when a gamepad button is pressed and the
 * registering component is in the current Framer navigation target. Optionally
 * provide a specific gamepad mapping, or flag the hook to operate on keyup.
 *
 *  @public
 */
export function useGamepad(input, callback, { mapping, on } = {}) {
    const context = React.useContext(GamepadContext);
    const settings = useConstant(() => ({
        mapping: mapping ?? "standard",
        on: on ?? "keydown",
    }));
    const stateRef = React.useRef({
        pressed: false,
        handler: callback,
    });
    const cb = React.useCallback((gamepad) => {
        const { pressed, handler } = stateRef.current;
        if (gamepad.inputs.includes(input) && settings.mapping === gamepad.mapping) {
            settings.on === "keydown" && handler();
            stateRef.current.pressed = true;
        }
        else if (pressed) {
            settings.on === "keyup" && handler();
            stateRef.current.pressed = false;
        }
    }, [input, settings]);
    useOnCurrentTargetChange((isInTarget, isOverlayed) => {
        const isActive = isInTarget && !isOverlayed;
        if (isActive) {
            context.register(cb);
        }
        else {
            context.unregister(cb);
        }
        // Unregister the callback when the screen unmounts. This is probably
        // unnecessary since we unregister the callback when the component
        // unmounts, but may catch instances where the screen is being unmounted
        // with AnimatePresence and hasn't yet been removed from the react tree.
        return () => context.unregister(cb);
    }, []);
    // Unregister the callback when unmounted.
    React.useEffect(() => {
        return () => context.unregister(cb);
    }, [cb, context]);
    // Maintain an up to date reference to the provided callback. This prevents
    // users from being forced to create a memoized callback with useCallback
    // and React refs.
    React.useEffect(() => {
        stateRef.current.handler = callback;
    }, [callback]);
}
//# sourceMappingURL=useGamepad.js.map