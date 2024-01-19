import type { HTMLMotionProps, MotionStyle, MotionTransform, MotionValue } from "framer-motion";
import type React from "react";
import type { WithEventsProperties } from "../../../components/hoc/WithEvents.js";
import type { BorderProperties } from "../../style/BorderComponent.js";
import type { DimensionType } from "../../types/Constraints.js";
import type { PositionAbsoluteProperties, PositionFixedProperties, PositionStickyProperties } from "../../types/NewConstraints.js";
import type { DeprecatedCoreFrameProps } from "./DeprecatedFrame.js";
export type MotionDivProps = HTMLMotionProps<"div">;
export type DeprecatedFrameWithEventsProps = DeprecatedCoreFrameProps & WithEventsProperties;
/**
 * @privateRemarks do no use separately from FrameProps
 * @public
 * */
export interface FrameLayoutProperties extends PositionStickyProperties, PositionFixedProperties, PositionAbsoluteProperties {
    /**
     * Distance from the top in pixels. Set to `0` by default.
     * @remarks
     * ```jsx
     * <Frame top={100} />
     * ```
     * @public
     */
    top: number | string | MotionValue<number | string>;
    /**
     * Distance from the right in pixels. Set to `0` by default.
     * @remarks
     * ```jsx
     * <Frame right={100} />
     * ```
     * @public
     */
    right: number | string | MotionValue<number | string>;
    /**
     * Distance from the bottom in pixels. Set to `0` by default.
     * @remarks
     * ```jsx
     * <Frame bottom={100} />
     * ```
     * @public
     */
    bottom: number | string | MotionValue<number | string>;
    /**
     * Distance from the left in pixels. Set to `0` by default.
     * @remarks
     * ```jsx
     * <Frame left={100} />
     * ```
     * @public
     */
    left: number | string | MotionValue<number | string>;
    /**
     * Set the CSS `width` property. Set to `200` by default. Accepts all CSS value types (including pixels, percentages, keywords and more).
     * @remarks
     * ```jsx
     * // Pixels
     * <Frame width={100} />
     *
     * // Percentages
     * <Frame width={"100%"} />
     * ```
     * @public
     */
    width: number | string | MotionValue<number | string>;
    /**
     * Set the CSS `height` property. Set to `200` by default. Accepts all CSS value types (including pixels, percentages, keywords and more).
     * @remarks
     * ```jsx
     * // Pixels
     * <Frame height={100} />
     *
     * // Percentages
     * <Frame height={"100%"} />
     *
     * ```
     * @public
     */
    height: number | string | MotionValue<number | string>;
    /**
     * Set the CSS `position` property. Set to `"absolute"` by default.
     * @remarks
     * ```jsx
     * <Frame position={"relative"} />
     * ```
     * @public
     */
    position: React.CSSProperties["position"];
    /**
     * Shortcut for centering Frames.
     * @remarks
     * ```jsx
     * // Center
     * <Frame center />
     *
     * // Center horizontally
     * <Frame center="x" />
     *
     * // Center vertically
     * <Frame center="y" />
     * ```
     * @public
     */
    center: boolean | "x" | "y";
    /**
     * Shortcut for setting the width and height simultaneously.
     * @remarks
     * ```jsx
     * <Frame size={100} />
     * ```
     * @public
     */
    size: number | string;
    /**
     * Set the CSS `min-width` property. Unset by default.
     * @remarks
     * ```jsx
     * <Frame minWidth={200} />
     * ```
     * @public
     */
    minWidth: number | string | MotionValue<number | string>;
    /**
     * Set the CSS `min-height` property. Unset by default.
     * @remarks
     * ```jsx
     * <Frame minHeight={200} />
     * ```
     * @public
     */
    minHeight: number | string | MotionValue<number | string>;
    /**
     * Set the CSS `min-width` property. Unset by default.
     * @remarks
     * ```jsx
     * <Frame minWidth={200} />
     * ```
     * @public
     */
    maxWidth: number | string | MotionValue<number | string>;
    /**
     * Set the CSS `max-height` property. Unset by default.
     * @remarks
     * ```jsx
     * <Frame maxHeight={200} />
     * ```
     * @public
     */
    maxHeight: number | string | MotionValue<number | string>;
    /** @internal */
    widthType: DimensionType;
    /** @internal */
    heightType: DimensionType;
}
/**
 * @privateRemarks do no use separately from FrameProps
 * @public
 * */
export interface VisualProperties {
    /**
     * Defines whether or not the `Frame` is visible. Unlike `opacity`, this property cannot be animated. Set to `true` by default. Maps to CSS.
     * @remarks
     * ```jsx
     * <Frame visible={false} />
     * ```
     * @public
     */
    visible: boolean;
    /**
     * Set the opacity value, which allows you to make elements semi-transparent or entirely hidden. Useful for show-and-hide animations.
     * Set to `1` by default.
     * @remarks
     * ```jsx
     * <Frame opacity={0.5} />
     * ```
     * @public
     */
    opacity: number | MotionValue<number>;
    /**
     * Set the CSS border property, which accepts width, style and color.
     * Set to `"none"` by default.
     * @remarks
     * ```jsx
     * <Frame border="1px solid #09F" />
     * ```
     * @public
     */
    border: string | MotionValue<string>;
    /**
     * Set the CSS border-radius property, in pixels or percentages.
     * Set to `0` by default.
     * @remarks
     * ```jsx
     * // Radius with pixels
     * <Frame radius={10} />
     *
     * // Radius with percentages
     * <Frame radius="50%" />
     * ```
     * @public
     */
    radius: number | string | MotionValue<number | string>;
    /**
     * Set the CSS border-radius property, in pixels or percentages. Alias for `radius`
     * Set to `0` by default.
     * @remarks
     * ```jsx
     * // Radius with pixels
     * <Frame borderRadius={10} />
     *
     * // Radius with percentages
     * <Frame borderRadius="50%" />
     * ```
     * @public
     */
    borderRadius: number | string | MotionValue<number | string>;
    /**
     * Set the color for text elements inside of a `Frame`. By default, text within Frames will be rendered in black.
     * @remarks
     * ```jsx
     * <Frame color="#09F" />
     * ```
     * @public
     */
    color: string | MotionValue<string>;
    /**
     * Set the CSS overflow property. Set to `"visible"` by default.
     * @remarks
     * ```jsx
     * <Frame overflow="hidden" />
     * ```
     * @public
     */
    overflow: "visible" | "hidden" | "auto";
    /**
     * Set the CSS box-shadow property.
     * @remarks
     * ```jsx
     * <Frame shadow="10px 5px 5px black" />
     * ```
     * @public
     */
    shadow: string | MotionValue<string>;
    /**
     * Position the children of the frame in 3D space. Set to `false` by default.
     * @remarks
     * ```jsx
     * <Frame preserve3d={true} />
     * ```
     * @public
     */
    preserve3d: boolean;
    /**
     * Sets whether the back face is visible when turned towards the user. Set to `true` by default.
     * @remarks
     * ```jsx
     * <Frame backfaceVisible={true} />
     * ```
     * @public
     */
    backfaceVisible: boolean;
}
/**
 * @privateRemarks do no use separately from FrameProps
 * @public
 * */
export interface CSSTransformProperties extends MotionTransform {
    /**
     * Set the CSS transform `translateX` property.
     * @remarks
     * ```jsx
     * <Frame x={100} />
     * ```
     * @public
     */
    x: number | string | MotionValue<number | string>;
    /**
     * Set the CSS transform `translateY` property.
     * @remarks
     * ```jsx
     * <Frame y={100} />
     * ```
     * @public
     */
    y: number | string | MotionValue<number | string>;
    /**
     * Set the CSS transform `translateZ` property.
     * @remarks
     * ```jsx
     * <Frame z={100} />
     * ```
     * @public
     */
    z: number | string | MotionValue<number | string>;
    /**
     * Set the CSS transform `rotate` property in degrees.
     * @remarks
     * ```jsx
     * <Frame rotate={45}/>
     * ```
     * @public
     */
    rotate: number | string | MotionValue<number | string>;
    /**
     * Set the CSS transform `rotateX` property in degrees.
     * @remarks
     * ```jsx
     * <Frame rotateX={45}/>
     * ```
     * @public
     */
    rotateX: number | string | MotionValue<number | string>;
    /**
     * Set the CSS transform `rotateY` property in degrees.
     * @remarks
     * ```jsx
     * <Frame rotateY={45}/>
     * ```
     * @public
     */
    rotateY: number | string | MotionValue<number | string>;
    /**
     * Set the CSS transform `rotateZ` property in degrees.
     * @remarks
     * ```jsx
     * <Frame rotateZ={45}/>
     * ```
     * @public
     */
    rotateZ: number | string | MotionValue<number | string>;
    /**
     * Set the CSS transform `scale` property.
     * @remarks
     * ```jsx
     * <Frame scale={1.5} />
     * ```
     * @public
     */
    scale: number | string | MotionValue<number | string>;
    /**
     * Set the CSS transform `scaleX` property.
     * @remarks
     * ```jsx
     * <Frame scaleX={1.5} />
     * ```
     * @public
     */
    scaleX: number | string | MotionValue<number | string>;
    /**
     * Set the CSS transform `scaleY` property.
     * @remarks
     * ```jsx
     * <Frame scaleY={2} />
     * ```
     * @public
     */
    scaleY: number | string | MotionValue<number | string>;
    /**
     * Set the CSS transform `skew` property in degrees.
     * @remarks
     * ```jsx
     * <Frame skew={15} />
     * ```
     * @public
     */
    skew: number | string | MotionValue<number | string>;
    /**
     * Set the CSS transform `skewX` property in degrees.
     * @remarks
     * ```jsx
     * <Frame skewX={15} />
     * ```
     * @public
     */
    skewX: number | string | MotionValue<number | string>;
    /**
     * Set the CSS transform `skewY` property in degrees.
     * @remarks
     * ```jsx
     * <Frame skewY={15} />
     * ```
     * @public
     */
    skewY: number | string | MotionValue<number | string>;
    /**
     * Set the CSS transform `originX` property.
     * @remarks
     * ```jsx
     * <Frame originX={0.5} />
     * ```
     * @public
     */
    originX: number | string | MotionValue<number | string>;
    /**
     * Set the CSS transform `originY` property.
     * @remarks
     * ```jsx
     * <Frame originY={0.5} />
     * ```
     * @public
     */
    originY: number | string | MotionValue<number | string>;
    /**
     * Set the CSS transform `originZ` property. Defaults to `px` units.
     * @remarks
     * ```jsx
     * <Frame originZ={100} />
     * ```
     * @public
     */
    originZ: number | string | MotionValue<number | string>;
    /**
     * Set the CSS perspective property.
     * @remarks
     * ```jsx
     * <Frame perspective={500} />
     * ```
     * @public
     */
    perspective: number | string | MotionValue<number | string>;
}
/**
 * @remarks do no use separately from FrameProps
 * @public
 * */
export interface BaseFrameProps {
    /**
     * Add a name to the Frame. This property does not change the behaviour of a Frame, but makes it easier to identify it in your code.
     * @remarks
     * The name will be rendered in the `data-framer-name` attribute of the outputted div, so the Frame is recognizable in the HTML DOM too.
     * ```jsx
     * <Frame name={"Button"} />
     * ```
     * @public
     */
    name: string;
    /** @internal */
    _border: Partial<BorderProperties>;
    /** @internal */
    _initialStyle?: Partial<MotionStyle>;
    /**
     * Set by a FrameNode to specify which overrides should be forwarded to their children
     * Processed by processOverrideForwarding into _forwardedOverrides
     * @internal
     * */
    _overrideForwardingDescription: {
        [key: string]: string;
    };
}
//# sourceMappingURL=types.d.ts.map