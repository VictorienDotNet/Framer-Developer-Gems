import type { WillChangeTransformProp } from "../../render/presentation/Layer.js";
import type { StackAlignment, StackDirection, StackDistribution, StackSpecificProps } from "./types.js";
import React from "react";
import { FrameProps } from "../../render/presentation/Frame/FrameWithMotion.js";
import { ParentSize } from "../../render/types/NewConstraints.js";
/**
 * The Stack component will automatically distribute its contents based on its
 * properties. The Stack component takes the same props as the {@link Frame} component
 * as well as a few additional interface defined below.
 *
 * @remarks
 * ```jsx
 * function MyComponent() {
 *   return (
 *     <Stack>
 *       <Frame />
 *       <Frame />
 *       <Frame />
 *     </Stack>
 *   )
 * }
 * ```
 * @public
 * @deprecated
 */
export interface StackProperties extends StackSpecificProps, FrameProps, WillChangeTransformProp {
    as?: keyof HTMLElementTagNameMap;
    children?: React.ReactNode;
    /** @internal */
    parentSize?: ParentSize;
    className?: string;
    useFlexboxGap?: boolean;
}
type FlexDirection = "column" | "row" | "column-reverse" | "row-reverse";
/**
 * @public
 * @deprecated The `Stack` component is being deprecated and will no longer be maintained in future releases. We recommend using flexbox instead for layout needs: {@link https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox}
 */
export declare const Stack: React.MemoExoticComponent<React.ForwardRefExoticComponent<Partial<StackProperties> & React.RefAttributes<HTMLElement | HTMLDivElement>>>;
/**
 * @internal
 */
export declare function isFractionDimension(dimension: any): dimension is string;
/**
 * @internal
 */
export declare function fraction(dimension: string): number;
/**
 * @internal
 */
export declare function isGapEnabled(gap: number | undefined, justifyContent: React.CSSProperties["justifyContent"], wrap: boolean): boolean;
/**
 * @internal
 */
export declare function toFlexDirection(direction: StackDirection): FlexDirection;
/** @internal */
export declare function toJustifyOrAlignment(distribution: StackDistribution | StackAlignment): "center" | "space-around" | "space-between" | "space-evenly" | "flex-end" | "flex-start";
export {};
//# sourceMappingURL=Stack.d.ts.map