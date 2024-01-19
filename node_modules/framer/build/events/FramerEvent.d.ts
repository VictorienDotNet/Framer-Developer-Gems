import type { FramerEventSession } from "./FramerEventSession.js";
import { Point } from "../render/types/Point.js";
export type EventHandler = (event: FramerEvent) => void;
/**
 * @public
 */
export declare class FramerEvent {
    /** @internal */ readonly originalEvent: MouseEvent | TouchEvent;
    /** @internal */ readonly session?: FramerEventSession | undefined;
    /**
     * @internal
     */
    readonly time: number;
    /**
     * @internal
     */
    readonly loopTime: number;
    /**
     * @internal
     */
    readonly point: Point;
    /**
     * @internal
     */
    readonly devicePoint: Point;
    /**
     * @internal
     */
    readonly target: EventTarget | null;
    /**
     * @internal
     */
    readonly delta: Point;
    /**
     * @internal
     */
    constructor(
    /** @internal */ originalEvent: MouseEvent | TouchEvent, 
    /** @internal */ session?: FramerEventSession | undefined);
    private static eventLikeFromOriginalEvent;
    /**
     * @internal
     */
    velocity(t: number): Point;
    /**
     * @internal
     */
    get offset(): Point;
    /**
     * @internal
     */
    get isLeftMouseClick(): boolean | undefined;
}
//# sourceMappingURL=FramerEvent.d.ts.map