import { roundedNumber } from "../utils/roundedNumber.js";
import { Point } from "./Point.js";
/**
 * @public
 */
export var Rect;
(function (Rect) {
    /**
     *
     * @param rect -
     * @param other -
     * @public
     */
    function equals(rect, other) {
        if (rect === other)
            return true;
        if (!rect || !other)
            return false;
        return rect.x === other.x && rect.y === other.y && rect.width === other.width && rect.height === other.height;
    }
    Rect.equals = equals;
    /** @internal */
    Rect.atOrigin = (size) => {
        return { ...size, x: 0, y: 0 };
    };
    /** @internal */
    Rect.fromTwoPoints = (a, b) => {
        return {
            x: Math.min(a.x, b.x),
            y: Math.min(a.y, b.y),
            width: Math.abs(a.x - b.x),
            height: Math.abs(a.y - b.y),
        };
    };
    /** @internal */
    Rect.fromRect = (rect) => {
        return {
            x: rect.left,
            y: rect.top,
            width: rect.right - rect.left,
            height: rect.bottom - rect.top,
        };
    };
    /** @internal */
    Rect.multiply = (rect, n) => {
        return {
            x: rect.x * n,
            y: rect.y * n,
            width: rect.width * n,
            height: rect.height * n,
        };
    };
    /** @internal */
    Rect.divide = (rect, n) => {
        return Rect.multiply(rect, 1 / n);
    };
    /** @internal */
    Rect.offset = (rect, delta) => {
        const xOffset = typeof delta.x === "number" ? delta.x : 0;
        const yOffset = typeof delta.y === "number" ? delta.y : 0;
        return {
            ...rect,
            x: rect.x + xOffset,
            y: rect.y + yOffset,
        };
    };
    /** @internal */
    function inflate(rect, value) {
        if (value === 0)
            return rect;
        const doubleValue = 2 * value;
        return {
            x: rect.x - value,
            y: rect.y - value,
            width: rect.width + doubleValue,
            height: rect.height + doubleValue,
        };
    }
    Rect.inflate = inflate;
    /** @internal */
    Rect.pixelAligned = (rect) => {
        const x = Math.round(rect.x);
        const y = Math.round(rect.y);
        const rectMaxX = Math.round(rect.x + rect.width);
        const rectMaxY = Math.round(rect.y + rect.height);
        const width = Math.max(rectMaxX - x, 0);
        const height = Math.max(rectMaxY - y, 0);
        return { x, y, width, height };
    };
    /** @internal */
    Rect.halfPixelAligned = (rect) => {
        const x = Math.round(rect.x * 2) / 2;
        const y = Math.round(rect.y * 2) / 2;
        const rectMaxX = Math.round((rect.x + rect.width) * 2) / 2;
        const rectMaxY = Math.round((rect.y + rect.height) * 2) / 2;
        const width = Math.max(rectMaxX - x, 1);
        const height = Math.max(rectMaxY - y, 1);
        return { x, y, width, height };
    };
    /** @internal */
    Rect.round = (rect, decimals = 0) => {
        const x = roundedNumber(rect.x, decimals);
        const y = roundedNumber(rect.y, decimals);
        const width = roundedNumber(rect.width, decimals);
        const height = roundedNumber(rect.height, decimals);
        return { x, y, width, height };
    };
    /** @internal */
    Rect.roundToOutside = (rect) => {
        const x = Math.floor(rect.x);
        const y = Math.floor(rect.y);
        const rectMaxX = Math.ceil(rect.x + rect.width);
        const rectMaxY = Math.ceil(rect.y + rect.height);
        const width = Math.max(rectMaxX - x, 0);
        const height = Math.max(rectMaxY - y, 0);
        return { x, y, width, height };
    };
    /**
     * @param rect -
     * @internal
     */
    Rect.minX = (rect) => {
        return rect.x;
    };
    /**
     * @param rect -
     * @internal
     */
    Rect.maxX = (rect) => {
        return rect.x + rect.width;
    };
    /**
     * @param rect -
     * @internal
     */
    Rect.minY = (rect) => {
        return rect.y;
    };
    /**
     * @param rect -
     * @internal
     */
    Rect.maxY = (rect) => {
        return rect.y + rect.height;
    };
    /** @internal */
    Rect.positions = (rect) => {
        return {
            minX: rect.x,
            midX: rect.x + rect.width / 2,
            maxX: Rect.maxX(rect),
            minY: rect.y,
            midY: rect.y + rect.height / 2,
            maxY: Rect.maxY(rect),
        };
    };
    /**
     *
     * @param rect -
     * @internal
     */
    Rect.center = (rect) => {
        return {
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height / 2,
        };
    };
    /** @internal */
    Rect.fromPoints = (ps) => {
        const xValues = ps.map(point => point.x);
        const yValues = ps.map(point => point.y);
        const x = Math.min(...xValues);
        const y = Math.min(...yValues);
        const width = Math.max(...xValues) - x;
        const height = Math.max(...yValues) - y;
        return { x, y, width, height };
    };
    /**
     * Returns a rect containing all input rects
     * @param rect - a list of rectangles
     * @returns A rectangle that fits exactly around the input rects
     * @internal
     */
    Rect.merge = (...rect) => {
        const min = {
            x: Math.min(...rect.map(Rect.minX)),
            y: Math.min(...rect.map(Rect.minY)),
        };
        const max = {
            x: Math.max(...rect.map(Rect.maxX)),
            y: Math.max(...rect.map(Rect.maxY)),
        };
        return Rect.fromTwoPoints(min, max);
    };
    /** @internal */
    Rect.intersection = (rect1, rect2) => {
        const x = Math.max(rect1.x, rect2.x);
        const x2 = Math.min(rect1.x + rect1.width, rect2.x + rect2.width);
        const y = Math.max(rect1.y, rect2.y);
        const y2 = Math.min(rect1.y + rect1.height, rect2.y + rect2.height);
        return { x, y, width: x2 - x, height: y2 - y };
    };
    /**
     * Returns all the corner points for a rect
     * @param rect -
     * @internal
     */
    Rect.points = (rect) => {
        return [
            { x: Rect.minX(rect), y: Rect.minY(rect) },
            { x: Rect.minX(rect), y: Rect.maxY(rect) },
            { x: Rect.maxX(rect), y: Rect.minY(rect) },
            { x: Rect.maxX(rect), y: Rect.maxY(rect) },
        ];
    };
    /** Takes a rect and transforms it by a matrix, resulting in the bounding rectangle of the
     * rotated and/or translated original.
     * @param rect - rectangle to transform
     * @param matrix - matrix to transform by
     * @returns The bounding rectangle of the rotated and/or translated rect.
     */
    Rect.transform = (rect, matrix) => {
        const { x: x1, y: y1 } = matrix.transformPoint({ x: rect.x, y: rect.y });
        const { x: x2, y: y2 } = matrix.transformPoint({ x: rect.x + rect.width, y: rect.y });
        const { x: x3, y: y3 } = matrix.transformPoint({ x: rect.x + rect.width, y: rect.y + rect.height });
        const { x: x4, y: y4 } = matrix.transformPoint({ x: rect.x, y: rect.y + rect.height });
        const x = Math.min(x1, x2, x3, x4);
        const width = Math.max(x1, x2, x3, x4) - x;
        const y = Math.min(y1, y2, y3, y4);
        const height = Math.max(y1, y2, y3, y4) - y;
        return { x, y, width, height };
    };
    /**
     * Checks if a rectangle contains a point
     * @param rect - The rectangle to check
     * @param point - The point to check
     * @returns true if the provided rectangle contains the provided point
     * @internal
     */
    Rect.containsPoint = (rect, point) => {
        if (point.x < Rect.minX(rect)) {
            return false;
        }
        if (point.x > Rect.maxX(rect)) {
            return false;
        }
        if (point.y < Rect.minY(rect)) {
            return false;
        }
        if (point.y > Rect.maxY(rect)) {
            return false;
        }
        if (isNaN(rect.x)) {
            return false;
        }
        if (isNaN(rect.y)) {
            return false;
        }
        return true;
    };
    /**
     * Returns wether a rect contains another rect entirely
     * @param rectA -
     * @param rectB -
     * @returns true if rectA contains rectB
     */
    Rect.containsRect = (rectA, rectB) => {
        for (const point of Rect.points(rectB)) {
            if (!Rect.containsPoint(rectA, point)) {
                return false;
            }
        }
        return true;
    };
    /** @internal */
    Rect.toCSS = (rect) => {
        return {
            display: "block",
            transform: `translate(${rect.x}px, ${rect.y}px)`,
            width: `${rect.width}px`,
            height: `${rect.height}px`,
        };
    };
    /** @internal */
    Rect.inset = (rect, n) => {
        return {
            x: rect.x + n,
            y: rect.y + n,
            width: Math.max(0, rect.width - 2 * n),
            height: Math.max(0, rect.height - 2 * n),
        };
    };
    /** @internal */
    Rect.intersects = (rectA, rectB) => {
        return !(rectB.x >= Rect.maxX(rectA) || Rect.maxX(rectB) <= rectA.x || rectB.y >= Rect.maxY(rectA) || Rect.maxY(rectB) <= rectA.y);
    };
    /** @internal */
    Rect.overlapHorizontally = (rectA, rectB) => {
        const aMax = Rect.maxX(rectA);
        const bMax = Rect.maxX(rectB);
        return aMax > rectB.x && bMax > rectA.x;
    };
    /** @internal */
    Rect.overlapVertically = (rectA, rectB) => {
        const aMax = Rect.maxY(rectA);
        const bMax = Rect.maxY(rectB);
        return aMax > rectB.y && bMax > rectA.y;
    };
    /** @internal */
    Rect.doesNotIntersect = (rect, rects) => {
        return (rects.find(comparingRect => {
            return Rect.intersects(comparingRect, rect);
        }) === undefined);
    };
    /**
     *
     * @param rectA -
     * @param rectB -
     * @returns if the input rectangles are equal in size and position
     * @public
     */
    Rect.isEqual = (rectA, rectB) => {
        if (rectA && rectB) {
            const { x, y, width, height } = rectA;
            return rectB.x === x && rectB.y === y && rectB.width === width && rectB.height === height;
        }
        else {
            return rectA === rectB;
        }
    };
    /** @internal */
    Rect.cornerPoints = (rect) => {
        const rectMinX = rect.x;
        const rectMaxX = rect.x + rect.width;
        const rectMinY = rect.y;
        const rectMaxY = rect.y + rect.height;
        const corner1 = { x: rectMinX, y: rectMinY };
        const corner2 = { x: rectMaxX, y: rectMinY };
        const corner3 = { x: rectMaxX, y: rectMaxY };
        const corner4 = { x: rectMinX, y: rectMaxY };
        return [corner1, corner2, corner3, corner4];
    };
    /** @internal */
    Rect.midPoints = (rect) => {
        const rectMinX = rect.x;
        const rectMidX = rect.x + rect.width / 2;
        const rectMaxX = rect.x + rect.width;
        const rectMinY = rect.y;
        const rectMidY = rect.y + rect.height / 2;
        const rectMaxY = rect.y + rect.height;
        const top = { x: rectMidX, y: rectMinY };
        const right = { x: rectMaxX, y: rectMidY };
        const bottom = { x: rectMidX, y: rectMaxY };
        const left = { x: rectMinX, y: rectMidY };
        return [top, right, bottom, left];
    };
    /** @internal */
    Rect.pointDistance = (rect, point) => {
        let x = 0;
        let y = 0;
        if (point.x < rect.x) {
            x = rect.x - point.x;
        }
        else if (point.x > Rect.maxX(rect)) {
            x = point.x - Rect.maxX(rect);
        }
        if (point.y < rect.y) {
            y = rect.y - point.y;
        }
        else if (point.y > Rect.maxY(rect)) {
            y = point.y - Rect.maxY(rect);
        }
        return Point.distance({ x, y }, { x: 0, y: 0 });
    };
    const fromAnyDefaults = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    };
    /** @internal */
    Rect.fromAny = (rect, defaults = fromAnyDefaults) => {
        return {
            x: rect.x || defaults.x,
            y: rect.y || defaults.y,
            width: rect.width || defaults.width,
            height: rect.height || defaults.height,
        };
    };
    /** @internal */
    Rect.withMinSize = (rect, minSize) => {
        const { width: minWidth, height: minHeight } = minSize;
        const diffX = rect.width - minWidth;
        const diffY = rect.height - minHeight;
        return {
            width: Math.max(rect.width, minWidth),
            height: Math.max(rect.height, minHeight),
            x: rect.width < minWidth ? rect.x + diffX / 2 : rect.x,
            y: rect.height < minHeight ? rect.y + diffY / 2 : rect.y,
        };
    };
})(Rect || (Rect = {}));
//# sourceMappingURL=Rect.js.map