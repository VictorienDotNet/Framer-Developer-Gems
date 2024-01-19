import type { Size } from "./Size.js";
import { Point } from "./Point.js";
/**
 * @public
 */
export interface Rect extends Point, Size {
}
/**
 * @public
 */
export declare namespace Rect {
    /**
     *
     * @param rect -
     * @param other -
     * @public
     */
    function equals(rect: Rect | null, other: Rect | null): boolean;
    /** @internal */
    const atOrigin: (size: Size) => {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    /** @internal */
    const fromTwoPoints: (a: Point, b: Point) => Rect;
    /** @internal */
    const fromRect: (rect: ClientRect) => Rect;
    /** @internal */
    const multiply: (rect: Rect, n: number) => Rect;
    /** @internal */
    const divide: (rect: Rect, n: number) => Rect;
    /** @internal */
    const offset: (rect: Rect, delta: Partial<Point>) => Rect;
    /** @internal */
    function inflate(rect: Rect, value: number): Rect;
    /** @internal */
    const pixelAligned: (rect: Rect) => Rect;
    /** @internal */
    const halfPixelAligned: (rect: Rect) => Rect;
    /** @internal */
    const round: (rect: Rect, decimals?: number) => Rect;
    /** @internal */
    const roundToOutside: (rect: Rect) => Rect;
    /**
     * @param rect -
     * @internal
     */
    const minX: (rect: Rect) => number;
    /**
     * @param rect -
     * @internal
     */
    const maxX: (rect: Rect) => number;
    /**
     * @param rect -
     * @internal
     */
    const minY: (rect: Rect) => number;
    /**
     * @param rect -
     * @internal
     */
    const maxY: (rect: Rect) => number;
    /** @internal */
    const positions: (rect: Rect) => {
        minX: number;
        midX: number;
        maxX: number;
        minY: number;
        midY: number;
        maxY: number;
    };
    /**
     *
     * @param rect -
     * @internal
     */
    const center: (rect: Rect) => {
        x: number;
        y: number;
    };
    /** @internal */
    const fromPoints: (ps: Point[]) => {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    /**
     * Returns a rect containing all input rects
     * @param rect - a list of rectangles
     * @returns A rectangle that fits exactly around the input rects
     * @internal
     */
    const merge: (...rect: Rect[]) => Rect;
    /** @internal */
    const intersection: (rect1: Rect, rect2: Rect) => Rect;
    /**
     * Returns all the corner points for a rect
     * @param rect -
     * @internal
     */
    const points: (rect: Rect) => Point[];
    /** Takes a rect and transforms it by a matrix, resulting in the bounding rectangle of the
     * rotated and/or translated original.
     * @param rect - rectangle to transform
     * @param matrix - matrix to transform by
     * @returns The bounding rectangle of the rotated and/or translated rect.
     */
    const transform: (rect: Rect, matrix: DOMMatrixReadOnly) => Rect;
    /**
     * Checks if a rectangle contains a point
     * @param rect - The rectangle to check
     * @param point - The point to check
     * @returns true if the provided rectangle contains the provided point
     * @internal
     */
    const containsPoint: (rect: Rect, point: Point) => boolean;
    /**
     * Returns wether a rect contains another rect entirely
     * @param rectA -
     * @param rectB -
     * @returns true if rectA contains rectB
     */
    const containsRect: (rectA: Rect, rectB: Rect) => boolean;
    /** @internal */
    const toCSS: (rect: Rect) => {
        display: string;
        transform: string;
        width: string;
        height: string;
    };
    /** @internal */
    const inset: (rect: Rect, n: number) => {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    /** @internal */
    const intersects: (rectA: Rect, rectB: Rect) => boolean;
    /** @internal */
    const overlapHorizontally: (rectA: Rect, rectB: Rect) => boolean;
    /** @internal */
    const overlapVertically: (rectA: Rect, rectB: Rect) => boolean;
    /** @internal */
    const doesNotIntersect: (rect: Rect, rects: Rect[]) => boolean;
    /**
     *
     * @param rectA -
     * @param rectB -
     * @returns if the input rectangles are equal in size and position
     * @public
     */
    const isEqual: (rectA: Rect | null, rectB: Rect | null) => boolean;
    /** @internal */
    const cornerPoints: (rect: Rect) => [Point, Point, Point, Point];
    /** @internal */
    const midPoints: (rect: Rect) => [Point, Point, Point, Point];
    /** @internal */
    const pointDistance: (rect: Rect, point: Point) => number;
    /** @internal */
    const fromAny: (rect: any, defaults?: {
        x: number;
        y: number;
        width: number;
        height: number;
    }) => Rect;
    /** @internal */
    const withMinSize: (rect: Rect, minSize: Size) => Rect;
}
//# sourceMappingURL=Rect.d.ts.map