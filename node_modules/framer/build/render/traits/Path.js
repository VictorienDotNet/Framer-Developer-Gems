import { assert } from "../../utils/assert.js";
import { PathSegment } from "../types/PathSegment.js";
import { RenderTarget } from "../types/RenderEnvironment.js";
import { isFiniteNumber } from "../utils/isFiniteNumber.js";
import { roundedNumberString } from "../utils/roundedNumber.js";
const key = "pathSegments";
/**
 * @internal
 */
export function withPath(target) {
    return key in target;
}
/**
 * @internal
 */
export const pathDefaults = {
    pathSegments: [],
    pathClosed: false,
};
/**
 * @internal
 */
export function toSVGPath(withPaths, translate = { x: 0, y: 0 }, canvasMode = RenderTarget.canvas) {
    let pathElements = [];
    let paths = [];
    if (Array.isArray(withPaths)) {
        paths = withPaths;
    }
    else {
        paths = [withPaths];
    }
    paths.forEach(path => {
        const { pathClosed, pathSegments } = path;
        const segmentCount = pathSegments.length;
        if (segmentCount === 0)
            return "";
        for (let i = 0; i < segmentCount; i++) {
            const segment = pathSegments[i];
            assert(segment, "Path segment must be defined");
            let nextSegment;
            let prevSegment;
            const isFirstSegment = i === 0;
            const isLastSegment = i === segmentCount - 1;
            if (!isLastSegment) {
                nextSegment = pathSegments[i + 1];
            }
            else if (pathClosed) {
                nextSegment = pathSegments[0];
            }
            if (!isFirstSegment) {
                prevSegment = pathSegments[i - 1];
            }
            else if (pathClosed) {
                prevSegment = pathSegments[segmentCount - 1];
            }
            if (i === 0) {
                pathElements.push("M");
            }
            else if (prevSegment && isStraightCurve(prevSegment, segment)) {
                pathElements.push("L");
            }
            pathElements.push(segment.x + translate.x, segment.y + translate.y);
            if (nextSegment && !isStraightCurve(segment, nextSegment)) {
                const handleOut = PathSegment.calculatedHandleOut(segment);
                const handleIn = PathSegment.calculatedHandleIn(nextSegment);
                pathElements.push("C", handleOut.x + translate.x, handleOut.y + translate.y, handleIn.x + translate.x, handleIn.y + translate.y);
            }
            if (isLastSegment && nextSegment) {
                if (isStraightCurve(segment, nextSegment)) {
                    pathElements.push("Z");
                }
                else {
                    pathElements.push(nextSegment.x + translate.x, nextSegment.y + translate.y, "Z");
                }
            }
        }
    });
    if (canvasMode === RenderTarget.export || canvasMode === RenderTarget.preview) {
        pathElements = pathElements.map(value => (isFiniteNumber(value) ? roundedNumberString(value, 3) : value));
    }
    return pathElements.join(" ");
}
/**
 * @internal
 */
export function isStraightCurve(fromSegment, toSegment) {
    const fromStraight = fromSegment.handleMirroring === "straight" || (fromSegment.handleOutX === 0 && fromSegment.handleOutY === 0);
    const toStraight = toSegment.handleMirroring === "straight" || (toSegment.handleInX === 0 && toSegment.handleInY === 0);
    return fromStraight && toStraight;
}
//# sourceMappingURL=Path.js.map