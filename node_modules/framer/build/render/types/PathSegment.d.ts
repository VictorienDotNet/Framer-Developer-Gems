import { Point } from "./Point.js";
/**
 * @internal
 */
export declare namespace PathSegment {
    type HandleMirroring = "straight" | "symmetric" | "disconnected" | "asymmetric";
}
/**
 * @internal
 */
export declare class PathSegment {
    readonly __class: string;
    static displayName: string;
    readonly x: number;
    readonly y: number;
    readonly handleMirroring: PathSegment.HandleMirroring;
    readonly handleOutX: number;
    readonly handleOutY: number;
    readonly handleInX: number;
    readonly handleInY: number;
    readonly radius: number;
    constructor(value?: Partial<PathSegment>);
    merge(value: Partial<PathSegment>): PathSegment;
}
/**
 * @internal
 */
export declare namespace PathSegment {
    const point: (pathSegment: PathSegment) => {
        x: number;
        y: number;
    };
    const handleOut: (pathSegment: PathSegment) => {
        x: number;
        y: number;
    };
    const handleIn: (pathSegment: PathSegment) => {
        x: number;
        y: number;
    };
    const calculatedHandleOut: (pathSegment: PathSegment) => Point;
    const calculatedHandleIn: (pathSegment: PathSegment) => Point;
    const curveDefault: (points: readonly PathSegment[], index: number) => Point;
}
//# sourceMappingURL=PathSegment.d.ts.map