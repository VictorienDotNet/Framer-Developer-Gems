import type { MotionStyle } from "framer-motion";
/**
 * @public
 */
export type StackDirection = "horizontal" | "vertical";
/**
 * @public
 */
export type StackDistribution = "start" | "center" | "end" | "space-between" | "space-around" | "space-evenly";
/**
 * @public
 */
export type StackAlignment = "start" | "center" | "end";
/**
 * @public
 */
export interface StackSpecificProps {
    /**
     * Defines the flow direction of the stack contents, either `"vertical"` or `"horizontal"`. Set
     * to `"vertical"` by default.
     *
     * @remarks
     * ```jsx
     * // Vertical
     * <Stack direction="vertical" />
     *
     * // Horizontal
     * <Stack direction="horizontal" />
     * ```
     */
    direction: StackDirection;
    /**
     * Defines the distribution of the stack contents. Set to `"space-around"` by default, which makes the contents spread evenly across the container.
     * @remarks
     *
     * - `"start"` — from the leading edge of the container.
     * - `"center"` — centered within the container.
     * - `"end"` — from the trailing edge of the container.
     * - `"space-between"` — spread evenly in the container.
     * - `"space-around"` — spread evenly with excess applied at the start / end.
     * - `"space-evenly"` — spread with equal padding between contents.
     *
     * ```jsx
     * // Default
     * <Stack distribution="space-around" />
     *
     * // Start
     * <Stack distribution="start" />
     *
     * // Center
     * <Stack distribution="center" />
     *
     * // End
     * <Stack distribution="end" />
     *
     * // Space Between
     * <Stack distribution="space-between" />
     *
     * // Space Around
     * <Stack distribution="space-around" />
     *
     * // Space Evenly
     * <Stack distribution="space-evenly" />
     * ```
     */
    distribution: StackDistribution;
    /**
     * Defines the distribution of the stack contents on the alternative axis to the direction. Can
     * be one of `"start"`, `"end",` or `"center"`. Set to `"center"` by default.
     *
     * @remarks
     * ```jsx
     * <Stack alignment="end" />
     * ```
     */
    alignment: StackAlignment;
    /**
     * The gap between items in the stack. Set to `10` by default.
     * @remarks
     * ```jsx
     * <Stack gap={120} />
     * ```
     */
    gap: number;
    /**
     * Padding to be applied to all sides of container. Set to `0` by default.
     * @remarks
     * To specify different padding for each side you can provide
     * individual `paddingTop`, `paddingLeft`, `paddingRight` and `paddingBottom` values.
     *
     * ```jsx
     * <Stack padding={20} />
     * ```
     */
    padding: number;
    /**
     * Flag to tell the Stack to ignore the `padding` prop and apply values per-side.
     *
     * @remarks
     *
     * ```jsx
     * <Stack paddingPerSide paddingLeft={20} paddingBottom={20} />
     * ```
     */
    paddingPerSide: boolean;
    /**
     * Value for the top padding of the container. Set to `0` by default.
     *
     * @remarks
     *
     * ```jsx
     * <Stack paddingTop={20} />
     * ```
     */
    paddingTop: number;
    /**
     * Value for the right padding of the container. Set to `0` by default.
     * @remarks
     *
     * ```jsx
     * <Stack paddingRight={20} />
     * ```
     */
    paddingRight: number;
    /**
     * Value for the left padding of the container. Set to `0` by default.
     *       @remarks
     *
     * ```jsx
     * <Stack paddingLeft={20} />
     * ```
     */
    paddingLeft: number;
    /**
     * Value for the bottom padding of the container. Set to `0` by default.
     * @remarks
     *
     * ```jsx
     * <Stack paddingBottom={20} />
     * ```
     */
    paddingBottom: number;
    /**
     * Value for wrapping items when they don't fit on the row / column.
     * @remarks
     *
     * ```jsx
     * <Stack wrap />
     * ```
     */
    wrap: boolean;
    /**
     * @privateRemarks If `true`, specifies that the component is a direct child of a ComponentContainer, rendered by a CodeComponentNode that is placed on the canvas.
     * @internal
     * */
    __fromCodeComponentNode?: boolean;
    /**
     * @privateRemarks The styles will be passed directly into the `style` prop
     * of the internal wrapper around the stack content. The internal wrapper is
     * used to work around a WebKit bug that breaks box-sizing when
     * `min-content` width/height is used in combination with absolute positioning.
     * @internal
     */
    __contentWrapperStyle?: MotionStyle;
}
//# sourceMappingURL=types.d.ts.map