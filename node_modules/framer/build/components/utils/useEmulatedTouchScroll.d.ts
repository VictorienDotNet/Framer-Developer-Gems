import React from "react";
import { Point } from "../../render/types/Point.js";
type Direction = "horizontal" | "vertical" | "both";
export declare function useEmulateTouchScroll(ref: React.RefObject<HTMLDivElement>, direction: Direction, enabled: boolean): {
    cancelEmulatedTouchScrollAnimation?: () => void;
};
export declare function calculateVelocity({ mouseMoveEvents, mouseUpEvent, }: {
    mouseMoveEvents: MouseEvent[];
    mouseUpEvent: MouseEvent;
}): Point;
export {};
//# sourceMappingURL=useEmulatedTouchScroll.d.ts.map