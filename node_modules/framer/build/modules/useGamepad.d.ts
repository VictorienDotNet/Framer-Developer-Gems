import React from "react";
/** @internal */
export interface FramerGamepadKeydownData {
    inputs: string[];
    id: string;
    mapping: Gamepad["mapping"];
}
/** @internal */
export declare function isFramerGamepadKeydownData(value: unknown): value is FramerGamepadKeydownData;
/** @internal */
export type GamepadKeydownHandler = (data: FramerGamepadKeydownData) => void;
/**
 * Exported for testing.
 * @internal
 */
export declare function createGamepadPoller(): {
    register(callback: (input: FramerGamepadKeydownData) => void): void;
    unregister(callback: (input: FramerGamepadKeydownData) => void): void;
};
/** @internal */
export declare const GamepadContext: React.Context<{
    register(callback: (input: FramerGamepadKeydownData) => void): void;
    unregister(callback: (input: FramerGamepadKeydownData) => void): void;
}>;
/**
 * Register a callback to be executed when a gamepad button is pressed and the
 * registering component is in the current Framer navigation target. Optionally
 * provide a specific gamepad mapping, or flag the hook to operate on keyup.
 *
 *  @public
 */
export declare function useGamepad(input: string, callback: () => void, { mapping, on }?: {
    mapping?: string;
    on?: "keyup" | "keydown";
}): void;
//# sourceMappingURL=useGamepad.d.ts.map