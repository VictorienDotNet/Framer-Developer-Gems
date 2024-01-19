import { Point } from "./Point.js";
/**
 * @internal
 */
export interface Line {
    a: Point;
    b: Point;
}
/**
 * @internal
 */
export declare const Line: {
    (a: Point, b: Point): Line;
    intersection(lineA: Line, lineB: Line): Point | null;
    intersectionAngle(lineA: Line, lineB: Line): number;
    isOrthogonal(line: Line): boolean;
    perpendicular(line: Line, pointOnLine: Point): Line;
    projectPoint(line: Line, point: Point): Point | null;
    pointAtPercentDistance(line: Line, distance: number): Point;
    distance(line: Line): number;
};
//# sourceMappingURL=Line.d.ts.map