interface LayoutHintDataProps {
    "data-framer-layout-hint-center-x"?: boolean;
    "data-framer-layout-hint-center-y"?: boolean;
}
/**
 * Returns a set of layout hint data props, which will be used to correctly
 * infer the correct translation offset when measuring DOM nodes in Chrome.
 *
 * Important: To be used ONLY when a transform template is set. Transform
 * templates use a -50% translation to center elements. When measuring DOM
 * nodes, we use the resulting computed style transform to differentiate between
 * a translation (transform) offset and a position (layout) offset. When
 * reporting the -50% value in the resulting transform matrix, Chrome will
 * report the 50% as based on the _painted_ rect of the element, but will
 * actually use the actual computed width, which might not be the same as the
 * painted width, when determining where to paint the element. To get to the
 * "real" offset, we use the layout hints to tell the measuring code that it
 * should just throw away the information reported in the transform matrix and
 * make its own calculation based on the computed size.
 *
 * This function has no effect outside of Chrome or the Canvas RenderTarget.
 *
 * @internal
 * @param center
 */
export declare function layoutHintDataPropsForCenter(center: boolean | "x" | "y" | undefined): LayoutHintDataProps;
export {};
//# sourceMappingURL=layoutHintDataPropsForCenter.d.ts.map