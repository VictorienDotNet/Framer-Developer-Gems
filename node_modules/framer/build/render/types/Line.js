import { Point } from "./Point.js";
/**
 * @internal
 */
export const Line = /* @__PURE__ */ (() => {
    /**
     * @internal
     */
    function Line(a, b) {
        return { a, b };
    }
    Line.intersection = (lineA, lineB) => {
        const x1 = lineA.a.x;
        const y1 = lineA.a.y;
        const x2 = lineA.b.x;
        const y2 = lineA.b.y;
        const x3 = lineB.a.x;
        const y3 = lineB.a.y;
        const x4 = lineB.b.x;
        const y4 = lineB.b.y;
        const d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (d === 0) {
            return null;
        }
        const xi = ((x3 - x4) * (x1 * y2 - y1 * x2) - (x1 - x2) * (x3 * y4 - y3 * x4)) / d;
        const yi = ((y3 - y4) * (x1 * y2 - y1 * x2) - (y1 - y2) * (x3 * y4 - y3 * x4)) / d;
        return { x: xi, y: yi };
    };
    Line.intersectionAngle = (lineA, lineB) => {
        const deltaAX = lineA.b.x - lineA.a.x;
        const deltaAY = lineA.b.y - lineA.a.y;
        const deltaBX = lineB.b.x - lineB.a.x;
        const deltaBY = lineB.b.y - lineB.a.y;
        const angle = Math.atan2(deltaAX * deltaBY - deltaAY * deltaBX, deltaAX * deltaBX + deltaAY * deltaBY);
        return angle * (180 / Math.PI);
    };
    Line.isOrthogonal = (line) => {
        return line.a.x === line.b.x || line.a.y === line.b.y;
    };
    Line.perpendicular = (line, pointOnLine) => {
        const deltaX = line.a.x - line.b.x;
        const deltaY = line.a.y - line.b.y;
        const pointB = Point(pointOnLine.x - deltaY, pointOnLine.y + deltaX);
        return Line(pointB, pointOnLine);
    };
    Line.projectPoint = (line, point) => {
        const perp = Line.perpendicular(line, point);
        return Line.intersection(line, perp);
    };
    Line.pointAtPercentDistance = (line, distance) => {
        const hypotenuse = Line.distance(line);
        const r = (distance * hypotenuse) / hypotenuse;
        return {
            x: r * line.b.x + (1 - r) * line.a.x,
            y: r * line.b.y + (1 - r) * line.a.y,
        };
    };
    Line.distance = (line) => {
        return Point.distance(line.a, line.b);
    };
    return Line;
})();
//# sourceMappingURL=Line.js.map