import type { Rect } from "./Rect.js";
import type { Size } from "./Size.js";
import React from "react";
import { DimensionType, SizeConstraints, UserConstraintValues } from "./Constraints.js";
export interface PositionProperties {
    top: number | string;
    right: number | string;
    bottom: number | string;
    left: number | string;
    center: "x" | "y" | boolean;
}
/** @internal */
export interface SizeProperties extends SizeConstraints {
    width: number | string;
    height: number | string;
    size: number | string;
}
/** @public */
export interface PositionStickyProperties {
    /** @internal */
    positionSticky?: boolean;
    /** @internal */
    positionStickyTop?: number;
    /** @internal */
    positionStickyRight?: number;
    /** @internal */
    positionStickyBottom?: number;
    /** @internal */
    positionStickyLeft?: number;
}
export interface PositionFixedProperties {
    /** @internal */
    positionFixed?: boolean;
}
export interface PositionAbsoluteProperties {
    /** @internal */
    positionAbsolute?: boolean;
}
export interface LayoutProperties extends PositionProperties, PositionStickyProperties, PositionFixedProperties, PositionAbsoluteProperties, SizeProperties {
    /** @internal */
    widthType?: DimensionType;
    /** @internal */
    heightType?: DimensionType;
}
export interface CustomConstraintProperties {
    /**
     * Aspect Ratio to keep when resizing
     * @public
     */
    aspectRatio?: number | null;
    /**
     * Used for Text and Graphics containers
     * @public
     */
    autoSize?: boolean;
    /**
     * Use Vekter constraint layout system, disable DOM layout
     * @public
     */
    enabled: boolean;
    intrinsicWidth?: number;
    intrinsicHeight?: number;
}
export interface ConstraintConfiguration {
    /** @internal */
    _constraints: CustomConstraintProperties;
}
/** @internal */
export interface NewConstraintProperties extends Partial<LayoutProperties>, ConstraintConfiguration {
}
/** @internal */
export declare function constraintsEnabled(props: Partial<NewConstraintProperties>): props is NewConstraintProperties;
/** @internal */
export declare function calculateRect(props: Partial<NewConstraintProperties & Partial<{
    size: number | string;
}>>, parentSize: ParentSize, pixelAlign?: boolean): Rect | null;
/** @internal */
export declare function getConstraintValues(props: NewConstraintProperties): UserConstraintValues;
/** @internal */
export declare enum ParentSizeState {
    Unknown = 0,
    Disabled = 1,
    DisabledForCurrentLevel = 2
}
/** @internal */
export type ParentSize = Size | ParentSizeState;
export declare const ConstraintsContext: React.Context<{
    parentSize: ParentSize;
}>;
export declare function deprecatedParentSize(parentSize: ParentSize): Size | null;
/** @internal */
export declare function useParentSize(): ParentSize;
export declare function isSize(o: ParentSize): o is Size;
/** @internal */
export declare const ProvideParentSize: React.FunctionComponent<{
    children?: React.ReactNode;
    parentSize: ParentSize;
}>;
export declare const ConsumeParentSize: React.Consumer<{
    parentSize: ParentSize;
}>;
export declare function useProvideParentSize(node: React.ReactNode, parentSize: ParentSize): React.ReactNode;
export declare function useConstraints(props: Partial<NewConstraintProperties>): Rect | null;
//# sourceMappingURL=NewConstraints.d.ts.map