import type { MotionValue } from "framer-motion";
import type { FramerEvent } from "../../events/FramerEvent.js";
import type { FrameProps } from "../../render/presentation/Frame/FrameWithMotion.js";
import type { LayerProps } from "../../render/presentation/Layer.js";
import type { Size } from "../../render/types/Size.js";
import type { ScrollEvents } from "../Scroll/types.js";
/**
 * @public
 */
export type PageDirection = "horizontal" | "vertical";
/**
 * @public
 */
export type PageContentDimension = "auto" | "stretch";
/**
 * @public
 */
export type PageAlignment = "start" | "center" | "end";
/**
 * Page effects change the behavior of the transition when swiping between pages.
 * By default there is no page effect applied.
 * @remarks
 * ```jsx
 * import React from "react"
 * import { Page, PageEffect } from "framer"
 *
 * export function MyComponent() {
 *  return <Page defaultEffect={"cube"} />
 * }
 * ```
 *
 * `"none"` - No custom effect is applied. This is the default.
 * `"cube"` - Each page is positioned as a 3D cube, connected to the current page.
 * `"coverflow"` - Each page is positioned in 3D, behind the current page.
 * `"wheel"` - Each page is gently titled in 3D, like a wheel.
 * `"pile"` - Each page is stacked behind the current page.
 * @public
 */
export type PageEffect = "none" | "cube" | "coverflow" | "wheel" | "pile";
/**
 * Information about the current effect.
 * @public
 */
export interface PageEffectInfo {
    /**
     * The offset of this page, in pixels, measured from the left-most part of the container.
     * @public
     */
    offset: number;
    /**
     * The offset of this page, normalised to the page size.
     *
     * For instance, if each page is `200` pixels wide, and we're on page index `1`, the `normalizedOffset` of page index `0` will be `-1`.
     * @public
     */
    normalizedOffset: number;
    /**
     * The `width` and `height` of the page.
     * @public
     */
    size: Size;
    /**
     * The index of the current page. The first page is `0`, the second is `1` and so on.
     * @public
     */
    index: number;
    /**
     * The direction of page scrolling, `"horizontal"` or `"vertical"`
     * @public
     */
    direction: PageDirection;
    /**
     * The gap between each page, in pixels.
     * @public
     */
    gap: number;
    /**
     * The total number of pages.
     *
     * @public
     */
    pageCount: number;
}
/**
 * Information about the current effect.
 * @public
 */
export type CustomPageEffect = (info: PageEffectInfo) => PageEffectValues;
/**
 * Information about the current effect.
 * @public
 */
export type PageEventHandler = (event: FramerEvent) => void;
/**
 * Information about the current effect.
 * @public
 */
export interface PageEffectValues {
    [key: string]: string | number | boolean;
}
/**
 * Event callbacks for the Page component, can be used to react to and co-ordinate
 * with other components.
 *
 * @public
 */
export interface PageEvents {
    /**
     * A callback that will be invoked when changing the page.
     * @remarks
     * This will be invoked when the drag animation begins or when the page changes
     * programatically. It can be used to co-ordinate with other behaviors.
     *
     * @param currentIndex - The current page number
     * @param previousIndex - The index of the previous page
     * @public
     * @remarks
     * ```jsx
     * <Page
     *     onChangePage={(current, previous) => {
     *         console.log(current, previous)
     *     }}
     * />
     * ```
     */
    onChangePage(currentIndex: number, previousIndex: number): void;
}
/**
 * All properties that can be used with the {@link Page} component it also extends all {@link ScrollProps} properties.
 * ```jsx
 * <Page
 *   direction={"horizontal"}
 *   contentWidth={"stretch"}
 *   contentHeight={"stretch"}
 *   alignment={"center"}
 *   currentPage={0}
 *   animateCurrentPageUpdate={true}
 *   gap={10}
 *   padding={0}
 *   paddingPerSide={true}
 *   paddingTop={0}
 *   paddingRight={0}
 *   paddingBottom={0}
 *   paddingLeft={0}
 *   momentum={false}
 *   dragEnabled={false}
 *   defaultEffect={PageEffect.Cube}>
 *   <Frame background="#19E" />
 *   <Frame background="#5CF" />
 *   <Frame background="#2CD" />
 * </Page>
 * ```
 * @public
 */
export interface PageProperties {
    /**
     * Current swipe direction. Either "horizontal" or "vertical". Set to `"horizontal"` by
     * default.
     *
     * @remarks
     * ```jsx
     * <Page direction="horizontal" />
     * ```
     */
    direction: PageDirection;
    /**
     * Width of the pages within the component. Either "auto" or "stretch" or a numeric value. Set
     * to `"stretch"` by default.
     *
     * @remarks
     * ```jsx
     * <Page contentWidth="auto" />
     * ```
     */
    contentWidth: PageContentDimension | number;
    /**
     * Height of the pages within the component. Either "auto" or "stretch" or a numeric value. Set
     * to `"stretch"` by default.
     *
     * @remarks
     * ```jsx
     * <Page contentHeight="auto" />
     * ```
     */
    contentHeight: PageContentDimension | number;
    /**
     * Alignment of the pages within the component. Either "start", "center", or "end". Set to
     * `"start"` by default.
     *
     * @remarks
     * ```jsx
     * <Page alignment="center" />
     * ```
     */
    alignment: PageAlignment;
    /**
     * Index of the current page. Set to `0` by default.
     *
     * @remarks
     * ```jsx
     * <Page currentPage={5} />
     * ```
     */
    currentPage: number;
    /**
     * Determines whether the component should animate page changes. Set to `true` by default.
     *
     * @remarks
     * ```jsx
     * <Page animateCurrentPageUpdate={false} />
     * ```
     * @internal
     */
    animateCurrentPageUpdate: boolean;
    /**
     * If `true`, this will lock dragging to the initial direction.
     *
     * @public
     *
     * ```jsx
     * <Page direction="both" directionLock={true} />
     * ```
     */
    directionLock?: boolean;
    /**
     * Enable or disable dragging to scroll. Defaults to `true`.
     *
     * @public
     *
     * ```jsx
     * <Page dragEnabled={false} />
     * ```
     */
    dragEnabled?: boolean;
    /**
     * Enable or disable wheel scroll. Defaults to `false`.
     *
     * @public
     *
     * ```jsx
     * <Page wheelEnabled={true} />
     * ```
     */
    wheelEnabled?: boolean;
    /**
     * Horizontal offset of the scrollable content. Set to `0` by default
     *
     * @remarks
     * ```jsx
     * <Page contentOffsetX={20} />
     * ```
     */
    contentOffsetX?: MotionValue<number> | number;
    /**
     * Vertical offset of the scrollable content. Set to `0` by default.
     *
     * @remarks
     * ```jsx
     * <Page contentOffsetY={20} />
     * ```
     */
    contentOffsetY?: MotionValue<number> | number;
    /**
     * A number describing the gap between the page elements. Set to `10` by default. Can not be negative.
     *
     * @remarks
     * ```jsx
     * <Page gap={0} />
     * ```
     * */
    gap: number;
    /**
     * Padding to be applied to all sides. Set to `0` by default.
     * To specify different padding for each side, provide
     * individual `paddingTop`, `paddingLeft`, `paddingRight` and `paddingBottom` values.
     *
     * ```jsx
     * <Page padding={20} />
     * ```
     */
    padding: number;
    /**
     * Flag to tell the Page to ignore the `padding` prop and apply values per-side.
     *
     * @remarks
     *
     * ```jsx
     * <Page paddingLeft={20}  />
     * ```
     */
    paddingPerSide?: boolean;
    /**
     * Value for the top padding of the container. Set to `0` by default.
     * ```jsx
     * <Page paddingTop={20}  />
     * ```
     */
    paddingTop?: number;
    /**
     * ```jsx
     * <Page paddingRight={20}  />
     * ```
     * Value for the right padding of the container. Set to `0` by default.
     */
    paddingRight?: number;
    /**
     * ```jsx
     * <Page paddingBottom={20}  />
     * ```
     * Value for the bottom padding of the container. Set to `0` by default.
     */
    paddingBottom?: number;
    /**
     * ```jsx
     * <Page paddingLeft={20}  />
     * ```
     * Value for the left padding of the container. Set to `0` by default.
     */
    paddingLeft?: number;
    /**
     * When enabled you can flick through multiple pages at once.
     * @remarks
     *
     * ```jsx
     * <Page momentum />
     * ```
     */
    momentum: boolean;
    /**
     * Pick one of the predefined effects. Either "none", "cube", "coverflow", "wheel" or "pile". Set to `"none"` by default.
     * @remarks
     *
     * ```jsx
     * <Page defaultEffect={"coverflow"} />
     * ```
     */
    defaultEffect: PageEffect;
    /**
     * Allows you to provide a custom transition effect for individual pages.
     *
     * This function is called once for every page, every time the scroll offset changes. It returns a new set of styles for this page.
     *
     * @param info - A {@link PageEffectInfo} object with information about the current effect.
     * @returns should return a new set of Frame properties.
     *
     * @remarks
     * ```jsx
     * function scaleEffect(info) {
     *     const { normalizedOffset } = info
     *     return {
     *         scale: Math.max(0, 1 + Math.min(0, normalizedOffset * -1))
     *     }
     * }
     *
     * return <Page effect={scaleEffect} />
     * ```
     * @public
     */
    effect?: (info: PageEffectInfo) => PageEffectValues;
    /**
     * @privateRemarks If `true`, specifies that the component is a direct child of a ComponentContainer, rendered by a CodeComponentNode that is placed on the canvas.
     * @internal
     * */
    __fromCodeComponentNode?: boolean;
}
/**
 * @public
 */
export type PageProps = Partial<PageProperties> & Partial<Omit<FrameProps, "size" | "onScroll">> & LayerProps & Partial<PageEvents> & Partial<ScrollEvents>;
//# sourceMappingURL=types.d.ts.map