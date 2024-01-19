import type { MotionValue, PanInfo } from "framer-motion";
import type { FrameProps } from "../../render/presentation/Frame/FrameWithMotion.js";
import type { Point } from "../../render/types/Point.js";
export interface ScrollInfo {
    offset: Point;
    velocity: Point;
}
/**
 * @public
 */
export interface ScrollEvents {
    /**
     * Called when scrolling starts.
     *
     * @remarks
     * ```jsx
     * function onScrollStart(info) {
     *   console.log(info.offset, info.velocity)
     * }
     *
     * <Scroll onScrollStart={onScrollStart} />
     * ```
     * @param info - An {@link PanInfo} object containing `x` and `y` values for:
     *
     *   - `point`: Relative to the device or page.
     *   - `delta`: Distance moved since the last event.
     *   - `offset`: Offset from the original pan event.
     *   - `velocity`: Current velocity of the pointer.
     * @public
     */
    onScrollStart?(info: PanInfo): void;
    /**
     * Called periodically during scrolling.
     *
     * @remarks
     * ```jsx
     * function onScroll(info) {
     *   console.log(info.offset, info.velocity)
     * }
     *
     * <Scroll onScroll={onScroll} />
     * ```
     * @param info - An {@link PanInfo} object containing `x` and `y` values for:
     *
     *   - `point`: Relative to the device or page.
     *   - `delta`: Distance moved since the last event.
     *   - `offset`: Offset from the original pan event.
     *   - `velocity`: Current velocity of the pointer.
     * @public
     */
    onScroll?(info: PanInfo): void;
    /**
     * Called when scrolling ends.
     *
     * @remarks
     * ```jsx
     * function onScrollEnd(info) {
     *   console.log(info.offset, info.velocity)
     * }
     *
     * <Scroll onScrollEnd={onScrollEnd} />
     * ```
     * @param info - An {@link PanInfo} object containing `x` and `y` values for:
     *
     *   - `point`: Relative to the device or page.
     *   - `delta`: Distance moved since the last event.
     *   - `offset`: Offset from the original pan event.
     *   - `velocity`: Current velocity of the pointer.
     * @public
     */
    onScrollEnd?(info: PanInfo): void;
}
/**
 * The properties for the {@link Scroll} component, which are also available within other components, like {@link Page}.
 * @public
 */
export interface ScrollConfig {
    /**
     * Controls the axis of drag-scrolling.
     * Defaults to `"vertical"` for vertical scrolling.
     *
     * @remarks
     * Set `"horizontal"` or `"vertical"` to only drag in a specific direction.
     * Set `"both"` to drag both directions.
     *
     * ```jsx
     * // Horizontal
     * <Scroll direction="horizontal" />
     *
     * // Vertical
     * <Scroll direction="vertical" />
     *
     * // Locked
     * <Scroll direction="locked" />
     *
     * // Both directions
     * <Scroll direction="both" />
     * ```
     *
     * @public
     */
    direction?: "horizontal" | "vertical" | "both";
    /**
     * If `true`, this will lock dragging to the initial direction.
     *
     * @public
     *
     * ```jsx
     * <Scroll direction="both" directionLock={true} />
     * ```
     */
    directionLock?: boolean;
    /**
     * Enable or disable dragging to scroll. Defaults to `true`.
     *
     * @public
     *
     * ```jsx
     * <Scroll dragEnabled={false} />
     * ```
     */
    dragEnabled?: boolean;
    /**
     * Enable or disable wheel scroll. Defaults to `true`.
     *
     * @public
     *
     * ```jsx
     * <Scroll wheelEnabled={false} />
     * ```
     */
    wheelEnabled?: boolean;
    /**
     * Horizontal offset of the scrollable content. Set to `0` by default
     *
     * @remarks
     * ```jsx
     * <Scroll contentOffsetX={20} />
     * ```
     */
    contentOffsetX?: MotionValue<number> | number;
    /**
     * Vertical offset of the scrollable content. Set to `0` by default.
     *
     * @remarks
     * ```jsx
     * <Scroll contentOffsetY={20} />
     * ```
     */
    contentOffsetY?: MotionValue<number> | number;
    /**
     * Width of the scrollable content.
     *
     * @remarks
     * ```jsx
     * <Scroll contentWidth={500} />
     * ```
     */
    contentWidth?: number;
    /**
     * Height of the scrollable content.
     *
     * @remarks
     * ```jsx
     * <Scroll contentHeight={500} />
     * ```
     */
    contentHeight?: number;
    /**
     * Add a custom control for the scroll animation.
     * @remarks
     * ```jsx
     * const controls = useAnimation()
     * controls.start({ y: -50 })
     * <Scroll scrollAnimate={controls} />
     * ```
     * @public
     * */
    scrollAnimate?: FrameProps["animate"];
    /**
     * Flag the scroll component to reset it's scroll offset when it becomes
     * visible in Framer.
     *
     * @remarks
     * ```jsx
     * <Scroll resetOffset={true} />
     * ```
     * @public
     * */
    resetOffset?: boolean;
    /**
     * Flag the scroll component to emulate device overdrag.
     *
     * @remarks
     * ```jsx
     * <Scroll overdragEnabled={false} />
     * ```
     * @public
     * */
    overdragEnabled?: boolean;
    /**
     * @privateRemarks If `true`, specifies that the component is a direct child of a ComponentContainer, rendered by a CodeComponentNode that is placed on the canvas.
     * @internal
     * */
    __fromCodeComponentNode?: boolean;
    /**
     * @internal
     */
    className?: string;
}
/**
 * @public
 */
export type EmulatedScrollProps = {
    native?: false | undefined;
} & Omit<Partial<FrameProps>, "onScroll" | "size" | "overflow"> & ScrollEvents & ScrollConfig;
/**
 * @public
 */
export type NativeScrollProps = {
    native: true;
} & Omit<Partial<FrameProps>, "size" | "overflow"> & Omit<ScrollEvents, "onScroll"> & ScrollConfig & {
    scrollBarVisible?: boolean;
};
/**
 * @public
 */
export type ScrollProps = EmulatedScrollProps | NativeScrollProps;
//# sourceMappingURL=types.d.ts.map