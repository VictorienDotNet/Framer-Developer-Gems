import { roundWithOffset } from "../utils/roundedNumber.js";
/**
 * @public
 */
function Point(x, y) {
    return { x, y };
}
/**
 * @public
 */
(function (Point) {
    /** @internal */
    Point.add = (...args) => {
        return args.reduce((previousValue, currentValue) => {
            return { x: previousValue.x + currentValue.x, y: previousValue.y + currentValue.y };
        }, { x: 0, y: 0 });
    };
    /** @internal */
    Point.subtract = (a, b) => {
        return { x: a.x - b.x, y: a.y - b.y };
    };
    /** @internal */
    Point.multiply = (a, b) => {
        return { x: a.x * b, y: a.y * b };
    };
    /** @internal */
    Point.divide = (a, b) => {
        return { x: a.x / b, y: a.y / b };
    };
    /** @internal */
    Point.absolute = (point) => {
        return {
            x: Math.abs(point.x),
            y: Math.abs(point.y),
        };
    };
    /** @internal */
    Point.reverse = (point) => {
        return {
            x: point.x * -1,
            y: point.y * -1,
        };
    };
    /** @internal */
    Point.pixelAligned = (point, offset = { x: 0, y: 0 }) => {
        return {
            x: roundWithOffset(point.x, offset.x),
            y: roundWithOffset(point.y, offset.y),
        };
    };
    /** @internal */
    Point.distance = (a, b) => {
        const deltaX = Math.abs(a.x - b.x);
        const deltaY = Math.abs(a.y - b.y);
        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    };
    /** @internal */
    Point.angle = (a, b) => {
        return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI - 90;
    };
    /** @public */
    Point.isEqual = (a, b) => {
        return a.x === b.x && a.y === b.y;
    };
    /** @internal */
    Point.rotationNormalizer = () => {
        let lastValue;
        return (value) => {
            if (typeof lastValue !== "number") {
                lastValue = value;
            }
            const diff = lastValue - value;
            const maxDiff = Math.abs(diff) + 180;
            const nTimes = Math.floor(maxDiff / 360);
            if (diff < 180) {
                value -= nTimes * 360;
            }
            if (diff > 180) {
                value += nTimes * 360;
            }
            lastValue = value;
            return value;
        };
    };
    /** @internal */
    function center(a, b) {
        return {
            x: (a.x + b.x) / 2,
            y: (a.y + b.y) / 2,
        };
    }
    Point.center = center;
})(Point || (Point = {}));
export { Point };
//# sourceMappingURL=Point.js.map