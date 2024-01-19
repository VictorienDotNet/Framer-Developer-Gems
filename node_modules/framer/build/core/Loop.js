import * as time from "./Time.js";
import { EventEmitter } from "./EventEmitter.js";
let LoopTimeStep = 1 / 60;
/**
 * @public
 */
export class Loop extends EventEmitter {
    _started = false;
    _frame = 0;
    _frameTasks = [];
    /**
     * To add a task to be done at the end of a frame.
     * Tasks added from a task will be ignored. These will run after loop events have been processed.
     * @internal
     */
    addFrameTask(task) {
        this._frameTasks.push(task);
    }
    _processFrameTasks() {
        const postEventTasks = this._frameTasks;
        const length = postEventTasks.length;
        if (length === 0)
            return;
        for (let i = 0; i < length; i++) {
            postEventTasks[i]?.();
        }
        postEventTasks.length = 0;
    }
    /**
     * @internal
     */
    static set TimeStep(value) {
        LoopTimeStep = value;
    }
    /**
     * @internal
     */
    static get TimeStep() {
        return LoopTimeStep;
    }
    /**
     * @internal
     */
    constructor(start = false) {
        super();
        if (start) {
            this.start();
        }
    }
    /**
     * @internal
     */
    start() {
        if (this._started)
            return this;
        this._frame = 0;
        this._started = true;
        time.raf(this.tick);
        return this;
    }
    /**
     * @internal
     * @deprecated Don’t use `stop` as you could be stopping the MainLoop for others.
     */
    stop() {
        this._started = false;
        return this;
    }
    /**
     * @internal
     */
    get frame() {
        return this._frame;
    }
    /**
     * @internal
     */
    get time() {
        return this._frame * LoopTimeStep;
    }
    /**
     * @internal
     */
    tick = () => {
        if (!this._started)
            return;
        time.raf(this.tick);
        this.emit("update", this._frame, LoopTimeStep);
        this.emit("render", this._frame, LoopTimeStep);
        this._processFrameTasks();
        this._frame++;
    };
}
/**
 * @internal
 */
export const MainLoop = new Loop();
//# sourceMappingURL=Loop.js.map