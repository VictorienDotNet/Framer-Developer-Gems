import { interpolate } from "framer-motion";
import { Line } from "../../render/types/Line.js";
import { Point } from "../../render/types/Point.js";
import { Rect } from "../../render/types/Rect.js";
import { assert } from "../../utils/assert.js";
import { ConvertColor } from "../types/Color/ConvertColor.js";
import { LinearGradient, RadialGradient } from "../types/Gradient.js";
import { gradientColorStops } from "./gradientColorStops.js";
/**
 * Get a line made up of the 2 points where a line from the center of the layer
 * along the angle of the gradient would intersect with a 1x1 rectangle.
 */
function linearGradientLine(angle) {
    const rad = (angle * Math.PI) / 180;
    const offset = {
        x: -Math.sin(rad) * 100,
        y: Math.cos(rad) * 100,
    };
    const anglePoint = Point(offset.x, offset.y);
    const angleLine = Line(Point(0.5, 0.5), anglePoint);
    // Get points from a 1x1 rectangle.
    const points = Rect.points({ x: 0, y: 0, width: 1, height: 1 });
    // Find the two closest points. These should always be the points that form
    // the side of the 1x1 square that the angled line travels through. This is
    // only true because we are using a square, and would not hold true for a
    // rectangle.
    const sortedPoints = points
        .map(point => ({ point, distance: Point.distance(anglePoint, point) }))
        .sort((a, b) => a.distance - b.distance);
    const a = sortedPoints[0]?.point;
    const b = sortedPoints[1]?.point;
    assert(a && b, "linearGradientLine: Must have 2 closest points.");
    // Find the other points, together they should form the line of the opposing side.
    const [c, d] = points.filter(point => !Point.isEqual(point, a) && !Point.isEqual(point, b));
    assert(c && d, "linearGradientLine: Must have 2 opposing points.");
    // The start and end point of the line of the gradient are defined by where
    // the angle line would intersect with our sides.
    const start = Line.intersection(angleLine, Line(a, b));
    const end = Line.intersection(angleLine, Line(c, d));
    assert(start && end, "linearGradientLine: Must have a start and end point.");
    return Line(start, end);
}
export function elementPropertiesForLinearGradient(gradient, id) {
    const line = linearGradientLine(gradient.angle);
    const stops = gradientColorStops(gradient);
    const startPosition = stops[0]?.position ?? 0;
    const endPosition = stops[stops.length - 1]?.position ?? 1;
    const startPoint = Line.pointAtPercentDistance(line, startPosition);
    const endPoint = Line.pointAtPercentDistance(line, endPosition);
    // Since the gradient will be positioned by the coordinates of the start and
    // end point, we normalize the other points into that range.
    const interpolator = interpolate([startPosition, endPosition], [0, 1]);
    return {
        id: `id${id}g${LinearGradient.hash(gradient)}`,
        x1: startPoint.x,
        y1: startPoint.y,
        x2: endPoint.x,
        y2: endPoint.y,
        stops: stops.map(stop => ({
            color: stop.value,
            alpha: ConvertColor.getAlpha(stop.value) * gradient.alpha,
            position: interpolator(stop.position),
        })),
    };
}
export function elementPropertiesForRadialGradient(gradient, id) {
    return {
        id: `id${id}g${RadialGradient.hash(gradient)}`,
        widthFactor: gradient.widthFactor,
        heightFactor: gradient.heightFactor,
        centerAnchorX: gradient.centerAnchorX,
        centerAnchorY: gradient.centerAnchorY,
        stops: gradientColorStops(gradient).map(stop => ({
            color: stop.value,
            alpha: ConvertColor.getAlpha(stop.value) * gradient.alpha,
            position: stop.position,
        })),
    };
}
//# sourceMappingURL=elementPropertiesForGradient.js.map