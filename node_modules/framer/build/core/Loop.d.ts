import { EventEmitter } from "./EventEmitter.js";
export type LoopEventNames = "render" | "update" | "finish";
export type LoopDeltaCallback = (this: Loop, frame: number) => void;
/**
 * @public
 */
export declare class Loop extends EventEmitter<LoopEventNames> {
    private _started;
    private _frame;
    private _frameTasks;
    /**
     * To add a task to be done at the end of a frame.
     * Tasks added from a task will be ignored. These will run after loop events have been processed.
     * @internal
     */
    addFrameTask(task: Function): void;
    private _processFrameTasks;
    /**
     * @internal
     */
    static set TimeStep(value: number);
    /**
     * @internal
     */
    static get TimeStep(): number;
    /**
     * @internal
     */
    constructor(start?: boolean);
    /**
     * @internal
     */
    start(): this;
    /**
     * @internal
     * @deprecated Don’t use `stop` as you could be stopping the MainLoop for others.
     */
    stop(): this;
    /**
     * @internal
     */
    get frame(): number;
    /**
     * @internal
     */
    get time(): number;
    /**
     * @internal
     */
    private tick;
}
/**
 * @internal
 */
export declare const MainLoop: Loop;
//# sourceMappingURL=Loop.d.ts.map