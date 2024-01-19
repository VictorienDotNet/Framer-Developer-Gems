import { Animatable, isAnimatable } from "../../animation/Animatable/Animatable.js";
import { assertNever } from "../../utils/assert.js";
import { isReactChild, isReactElement } from "../../utils/type-guards.js";
import { isFiniteNumber } from "../utils/isFiniteNumber.js";
import { Rect } from "./Rect.js";
export const constraintDefaults = {
    left: null,
    right: null,
    top: null,
    bottom: null,
    centerX: "50%",
    centerY: "50%",
    aspectRatio: null,
    parentSize: null,
    width: 100,
    height: 100,
};
/** @internal */
export var DimensionType;
(function (DimensionType) {
    DimensionType[DimensionType["FixedNumber"] = 0] = "FixedNumber";
    DimensionType[DimensionType["Percentage"] = 1] = "Percentage";
    /** @internal */ DimensionType[DimensionType["Auto"] = 2] = "Auto";
    DimensionType[DimensionType["FractionOfFreeSpace"] = 3] = "FractionOfFreeSpace";
    DimensionType[DimensionType["Viewport"] = 4] = "Viewport";
})(DimensionType || (DimensionType = {}));
export function isConstraintSupportingChild(child) {
    if (!isReactChild(child) || !isReactElement(child)) {
        return false;
    }
    // Assume for now that all children support constraints (so they get passed parentSize)
    return true;
}
export function isConstraintSupportingClass(classToTest) {
    if (classToTest === null || classToTest === undefined) {
        return false;
    }
    return classToTest.supportsConstraints === true;
}
/** @internal */
export var ConstraintMask;
(function (ConstraintMask) {
    // Modifies the constraint mask to remove invalid (mutually exclusive) options and returns the original.
    // TODO: this removes major inconsistencies but probably needs to be merged with ConstraintSolver.
    ConstraintMask.quickfix = (constraints) => {
        if (constraints.widthType === DimensionType.Auto || constraints.heightType === DimensionType.Auto) {
            constraints.aspectRatio = null;
        }
        if (isFiniteNumber(constraints.aspectRatio)) {
            if (constraints.left && constraints.right) {
                constraints.widthType = DimensionType.FixedNumber;
            }
            if (constraints.top && constraints.bottom) {
                constraints.heightType = DimensionType.FixedNumber;
            }
            if (constraints.left && constraints.right && constraints.top && constraints.bottom) {
                constraints.bottom = false;
            }
            if (constraints.widthType !== DimensionType.FixedNumber &&
                constraints.heightType !== DimensionType.FixedNumber) {
                constraints.heightType = DimensionType.FixedNumber;
            }
        }
        if (constraints.left && constraints.right) {
            if (constraints.fixedSize ||
                constraints.widthType === DimensionType.Auto ||
                isFiniteNumber(constraints.maxWidth)) {
                constraints.right = false;
            }
            constraints.widthType = DimensionType.FixedNumber;
        }
        if (constraints.top && constraints.bottom) {
            if (constraints.fixedSize ||
                constraints.heightType === DimensionType.Auto ||
                isFiniteNumber(constraints.maxHeight)) {
                constraints.bottom = false;
            }
            constraints.heightType = DimensionType.FixedNumber;
        }
        return constraints;
    };
})(ConstraintMask || (ConstraintMask = {}));
/** @internal */
export function valueToDimensionType(value) {
    if (typeof value === "string") {
        const trimmedValue = value.trim();
        if (trimmedValue === "auto")
            return DimensionType.Auto;
        if (trimmedValue.endsWith("fr"))
            return DimensionType.FractionOfFreeSpace;
        if (trimmedValue.endsWith("%"))
            return DimensionType.Percentage;
        if (trimmedValue.endsWith("vw") || trimmedValue.endsWith("vh"))
            return DimensionType.Viewport;
    }
    return DimensionType.FixedNumber;
}
/**
 * @internal
 */
export var ConstraintValues;
(function (ConstraintValues) {
    // Returns concrete current values given some ConstraintProperties.
    ConstraintValues.fromProperties = (props) => {
        const { left, right, top, bottom, width, height, centerX, centerY, aspectRatio, autoSize } = props;
        const constraints = ConstraintMask.quickfix({
            left: isFiniteNumber(left) || isAnimatable(left),
            right: isFiniteNumber(right) || isAnimatable(right),
            top: isFiniteNumber(top) || isAnimatable(top),
            bottom: isFiniteNumber(bottom) || isAnimatable(bottom),
            widthType: valueToDimensionType(width),
            heightType: valueToDimensionType(height),
            aspectRatio: aspectRatio || null,
            fixedSize: autoSize === true,
        });
        let widthValue = null;
        let heightValue = null;
        let widthType = DimensionType.FixedNumber;
        let heightType = DimensionType.FixedNumber;
        if (constraints.widthType !== DimensionType.FixedNumber && typeof width === "string") {
            const parsedWidth = parseFloat(width);
            if (width.endsWith("fr")) {
                widthType = DimensionType.FractionOfFreeSpace;
                widthValue = parsedWidth;
            }
            else if (width === "auto") {
                widthType = DimensionType.Auto;
            }
            else {
                // Percentage
                widthType = DimensionType.Percentage;
                widthValue = parsedWidth / 100;
            }
        }
        else if (width !== undefined && typeof width !== "string") {
            widthValue = Animatable.getNumber(width);
        }
        if (constraints.heightType !== DimensionType.FixedNumber && typeof height === "string") {
            const parsedHeight = parseFloat(height);
            if (height.endsWith("fr")) {
                heightType = DimensionType.FractionOfFreeSpace;
                heightValue = parsedHeight;
            }
            else if (height === "auto") {
                heightType = DimensionType.Auto;
            }
            else {
                // Percentage
                heightType = DimensionType.Percentage;
                heightValue = parseFloat(height) / 100;
            }
        }
        else if (height !== undefined && typeof height !== "string") {
            heightValue = Animatable.getNumber(height);
        }
        let centerAnchorX = 0.5;
        let centerAnchorY = 0.5;
        if (centerX) {
            centerAnchorX = parseFloat(centerX) / 100;
        }
        if (centerY) {
            centerAnchorY = parseFloat(centerY) / 100;
        }
        return {
            left: constraints.left ? Animatable.getNumber(left) : null,
            right: constraints.right ? Animatable.getNumber(right) : null,
            top: constraints.top ? Animatable.getNumber(top) : null,
            bottom: constraints.bottom ? Animatable.getNumber(bottom) : null,
            widthType,
            heightType,
            width: widthValue,
            height: heightValue,
            aspectRatio: constraints.aspectRatio || null,
            centerAnchorX: centerAnchorX,
            centerAnchorY: centerAnchorY,
        };
    };
    ConstraintValues.toSize = (values, parentSizeInfo, autoSize, freeSpace) => {
        let width = null;
        let height = null;
        const parentWidth = parentSizeInfo?.sizing ? Animatable.getNumber(parentSizeInfo?.sizing.width) : null;
        const parentHeight = parentSizeInfo?.sizing ? Animatable.getNumber(parentSizeInfo?.sizing.height) : null;
        const hOpposingPinsOffset = pinnedOffset(values.left, values.right);
        if (parentWidth && isFiniteNumber(hOpposingPinsOffset)) {
            width = parentWidth - hOpposingPinsOffset;
        }
        else if (autoSize && values.widthType === DimensionType.Auto) {
            width = autoSize.width;
        }
        else if (isFiniteNumber(values.width)) {
            switch (values.widthType) {
                case DimensionType.FixedNumber:
                    width = values.width;
                    break;
                case DimensionType.FractionOfFreeSpace:
                    // set width/height to null if freeSpace is not available, so we would fallback to the default value
                    // see: https://github.com/framer/FramerStudio/pull/3345
                    width = freeSpace
                        ? (freeSpace.freeSpaceInParent.width / freeSpace.freeSpaceUnitDivisor.width) * values.width
                        : null;
                    break;
                case DimensionType.Percentage:
                case DimensionType.Viewport:
                    if (parentWidth) {
                        width = parentWidth * values.width;
                    }
                    break;
                case DimensionType.Auto:
                    break;
                default:
                    assertNever(values.widthType);
            }
        }
        const vOpposingPinsOffset = pinnedOffset(values.top, values.bottom);
        if (parentHeight && isFiniteNumber(vOpposingPinsOffset)) {
            height = parentHeight - vOpposingPinsOffset;
        }
        else if (autoSize && values.heightType === DimensionType.Auto) {
            height = autoSize.height;
        }
        else if (isFiniteNumber(values.height)) {
            switch (values.heightType) {
                case DimensionType.FixedNumber:
                    height = values.height;
                    break;
                case DimensionType.FractionOfFreeSpace:
                    // set width/height to null if freeSpace is not available, so we would fallback to the default value
                    // see: https://github.com/framer/FramerStudio/pull/3345
                    height = freeSpace
                        ? (freeSpace.freeSpaceInParent.height / freeSpace.freeSpaceUnitDivisor.height) * values.height
                        : null;
                    break;
                case DimensionType.Percentage:
                case DimensionType.Viewport:
                    if (parentHeight) {
                        height = parentHeight * values.height;
                    }
                    break;
                case DimensionType.Auto:
                    break;
                default:
                    assertNever(values.heightType);
            }
        }
        return sizeAfterApplyingConstraintsAndAspectRatio(width, height, values, {
            height: parentHeight ?? 0,
            width: parentWidth ?? 0,
        }, parentSizeInfo?.viewport);
    };
    // Returns a parent-relative rect given concrete ConstraintValues.
    ConstraintValues.toRect = (values, 
    // Normally we would use the same parentSize to calculate the node's size (width/height) and postiion (x/y), but
    // for non-position-fixed nodes using vw/vh, the size is based on the viewport size, while its position should
    // still be calculated via its parent's size.
    parentSizeInfo = null, autoSize = null, pixelAlign = false, 
    // This argument is actually never used, because fractional sizes are
    // always calculated by it's parent to static sizes
    freeSpace = null) => {
        let x = values.left || 0;
        let y = values.top || 0;
        const { width, height } = ConstraintValues.toSize(values, parentSizeInfo, autoSize, freeSpace);
        const parentSizeForPositioning = parentSizeInfo?.positioning ?? null;
        const positioningParentWidth = parentSizeForPositioning
            ? Animatable.getNumber(parentSizeForPositioning.width)
            : null;
        const positioningParentHeight = parentSizeForPositioning
            ? Animatable.getNumber(parentSizeForPositioning.height)
            : null;
        if (values.left !== null) {
            x = values.left;
        }
        else if (positioningParentWidth && values.right !== null) {
            x = positioningParentWidth - values.right - width;
        }
        else if (positioningParentWidth) {
            x = values.centerAnchorX * positioningParentWidth - width / 2;
        }
        if (values.top !== null) {
            y = values.top;
        }
        else if (positioningParentHeight && values.bottom !== null) {
            y = positioningParentHeight - values.bottom - height;
        }
        else if (positioningParentHeight) {
            y = values.centerAnchorY * positioningParentHeight - height / 2;
        }
        const f = { x, y, width, height };
        if (pixelAlign) {
            return Rect.pixelAligned(f);
        }
        return f;
    };
})(ConstraintValues || (ConstraintValues = {}));
const defaultWidth = 200;
const defaultHeight = 200;
function getConstraintValue(constraint, value, parentSize, viewport) {
    if (typeof value === "string") {
        if (value.endsWith("%") && parentSize) {
            switch (constraint) {
                case "maxWidth":
                case "minWidth":
                    return (parseFloat(value) / 100) * parentSize.width;
                case "maxHeight":
                case "minHeight":
                    return (parseFloat(value) / 100) * parentSize.height;
                default:
                    break;
            }
        }
        if (value.endsWith("vh") && viewport) {
            switch (constraint) {
                case "maxWidth":
                case "minWidth":
                    return (parseFloat(value) / 100) * viewport.width;
                case "maxHeight":
                case "minHeight":
                    return (parseFloat(value) / 100) * viewport.height;
                default:
                    break;
            }
        }
        return parseFloat(value);
    }
    return value;
}
function constrainHeight(height, values, parentSize, viewport) {
    if (values.minHeight) {
        height = Math.max(getConstraintValue("minHeight", values.minHeight, parentSize, viewport), height);
    }
    if (values.maxHeight) {
        height = Math.min(getConstraintValue("maxHeight", values.maxHeight, parentSize, viewport), height);
    }
    return height;
}
function constrainWidth(width, values, parentSize, viewport) {
    if (values.minWidth) {
        width = Math.max(getConstraintValue("minWidth", values.minWidth, parentSize, viewport), width);
    }
    if (values.maxWidth) {
        width = Math.min(getConstraintValue("maxWidth", values.maxWidth, parentSize, viewport), width);
    }
    return width;
}
function sizeAfterApplyingConstraintsAndAspectRatio(width, height, values, parentSize, viewport) {
    let w = constrainWidth(isFiniteNumber(width) ? width : defaultWidth, values, parentSize, viewport);
    let h = constrainHeight(isFiniteNumber(height) ? height : defaultHeight, values, parentSize, viewport);
    if (isFiniteNumber(values.aspectRatio) && values.aspectRatio > 0) {
        if (isFiniteNumber(values.left) && isFiniteNumber(values.right)) {
            h = w / values.aspectRatio;
        }
        else if (isFiniteNumber(values.top) && isFiniteNumber(values.bottom)) {
            w = h * values.aspectRatio;
        }
        else if (values.widthType !== DimensionType.FixedNumber) {
            h = w / values.aspectRatio;
        }
        else {
            w = h * values.aspectRatio;
        }
    }
    return {
        width: w,
        height: h,
    };
}
function pinnedOffset(start, end) {
    if (!isFiniteNumber(start) || !isFiniteNumber(end))
        return null;
    return start + end;
}
/** @internal */
export function getMergedConstraintsProps(props, constraints) {
    const result = {};
    if (props.constraints) {
        result.constraints = { ...props.constraints, ...constraints };
    }
    else {
        Object.assign(result, constraints);
    }
    return result;
}
//# sourceMappingURL=Constraints.js.map