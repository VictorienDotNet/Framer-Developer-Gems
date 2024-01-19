import { PathSegment } from "../types/PathSegment.js";
import { RenderTarget } from "../types/RenderEnvironment.js";
/**
 * @internal
 */
export interface WithPath {
    pathSegments: readonly PathSegment[];
    pathClosed: boolean;
}
/**
 * @internal
 */
export declare function withPath(target: any): target is WithPath;
/**
 * @internal
 */
export type WithPaths = WithPath[];
/**
 * @internal
 */
export declare const pathDefaults: WithPath;
/**
 * @internal
 */
export declare function toSVGPath(withPaths: WithPaths | WithPath, translate?: {
    x: number;
    y: number;
}, canvasMode?: RenderTarget): string;
/**
 * @internal
 */
export declare function isStraightCurve(fromSegment: PathSegment, toSegment: PathSegment): boolean;
//# sourceMappingURL=Path.d.ts.map