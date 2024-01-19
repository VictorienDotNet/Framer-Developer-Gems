import { assert } from "./../../utils/assert.js";
import { Point } from "./Point.js";
/**
 * @internal
 */
export class PathSegment {
    // #region withClassDiscriminator
    // NOTE: this implementation carefully copies the implementation of `withClassDiscriminator`
    // from Vekter. If making changes here, make sure to sync them to `withClassDiscriminator` as well.
    __class = "PathSegment";
    static displayName = "WithClassDiscriminatorMixin(PathSegment)";
    // #endregion
    x = 0; // The anchor point of the segment.
    y = 0;
    handleMirroring = "straight";
    handleOutX = 0; // Describes the out tangent of the segment.
    handleOutY = 0;
    handleInX = 0; // Describes the in tangent of the segment.
    handleInY = 0;
    radius = 0;
    constructor(value) {
        if (value) {
            Object.assign(this, value);
        }
    }
    merge(value) {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this, value);
    }
}
// #region withClassDiscriminator
// NOTE: this implementation carefully copies the implementation of `withClassDiscriminator`
// from Vekter. If making changes here, make sure to sync them to `withClassDiscriminator` as well.
;
PathSegment.prototype.__class = "PathSegment";
// #endregion
/**
 * @internal
 */
(function (PathSegment) {
    PathSegment.point = (pathSegment) => {
        return { x: pathSegment.x, y: pathSegment.y };
    };
    PathSegment.handleOut = (pathSegment) => {
        return { x: pathSegment.handleOutX, y: pathSegment.handleOutY };
    };
    PathSegment.handleIn = (pathSegment) => {
        return { x: pathSegment.handleInX, y: pathSegment.handleInY };
    };
    PathSegment.calculatedHandleOut = (pathSegment) => {
        switch (pathSegment.handleMirroring) {
            case "symmetric":
            case "disconnected":
            case "asymmetric":
                return Point.add(PathSegment.point(pathSegment), PathSegment.handleOut(pathSegment));
            default:
                return { x: pathSegment.x, y: pathSegment.y };
        }
    };
    PathSegment.calculatedHandleIn = (pathSegment) => {
        switch (pathSegment.handleMirroring) {
            case "symmetric":
                return Point.subtract(PathSegment.point(pathSegment), PathSegment.handleOut(pathSegment));
            case "disconnected":
            case "asymmetric":
                return Point.add(PathSegment.point(pathSegment), PathSegment.handleIn(pathSegment));
            default:
                return PathSegment.point(pathSegment);
        }
    };
    PathSegment.curveDefault = (points, index) => {
        if (points.length > 2) {
            let pointBefore;
            let pointAfter;
            if (index === 0) {
                pointBefore = points[points.length - 1];
            }
            else {
                pointBefore = points[index - 1];
            }
            if (index === points.length - 1) {
                pointAfter = points[0];
            }
            else {
                pointAfter = points[index + 1];
            }
            assert(pointBefore, "pointBefore should be defined");
            assert(pointAfter, "pointAfter should be defined");
            const delta = Point.subtract(PathSegment.point(pointAfter), PathSegment.point(pointBefore));
            return { x: delta.x / 4, y: delta.y / 4 };
        }
        return { x: 10, y: 10 };
    };
})(PathSegment || (PathSegment = {}));
//# sourceMappingURL=PathSegment.js.map