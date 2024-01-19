import type { Point } from "../../render/types/Point.js";
export declare function animatePointWithInertia({ from, velocity, onUpdate, onComplete, onStop, }: {
    from: Point;
    velocity: Point;
    onUpdate: (value: Point) => void;
    onComplete: () => void;
    onStop: () => void;
}): {
    stop: () => void;
};
//# sourceMappingURL=animatePointWithInertia.d.ts.map