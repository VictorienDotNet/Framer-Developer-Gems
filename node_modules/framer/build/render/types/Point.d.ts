/**
 * @public
 */
interface Point {
    x: number;
    y: number;
}
/**
 * @public
 */
declare function Point(x: number, y: number): Point;
/**
 * @public
 */
declare namespace Point {
    /** @internal */
    const add: (...args: Point[]) => Point;
    /** @internal */
    const subtract: (a: Point, b: Point) => Point;
    /** @internal */
    const multiply: (a: Point, b: number) => Point;
    /** @internal */
    const divide: (a: Point, b: number) => Point;
    /** @internal */
    const absolute: (point: Point) => Point;
    /** @internal */
    const reverse: (point: Point) => Point;
    /** @internal */
    const pixelAligned: (point: Point, offset?: Point) => Point;
    /** @internal */
    const distance: (a: Point, b: Point) => number;
    /** @internal */
    const angle: (a: Point, b: Point) => number;
    /** @public */
    const isEqual: (a: Point, b: Point) => boolean;
    /** @internal */
    const rotationNormalizer: () => (value: number) => number;
    /** @internal */
    function center(a: Point, b: Point): {
        x: number;
        y: number;
    };
}
export { Point };
//# sourceMappingURL=Point.d.ts.map