/**
 * @internal
 */
export function hasPaddingPerSide(props) {
    const { paddingPerSide, paddingTop, paddingBottom, paddingLeft, paddingRight } = props;
    return (paddingPerSide !== false &&
        (paddingTop !== undefined ||
            paddingBottom !== undefined ||
            paddingLeft !== undefined ||
            paddingRight !== undefined));
}
/**
 * @internal
 */
export function paddingFromProps(props) {
    const { padding = 0, paddingTop, paddingBottom, paddingLeft, paddingRight } = props;
    if (hasPaddingPerSide(props)) {
        return {
            top: paddingTop !== undefined ? paddingTop : padding,
            bottom: paddingBottom !== undefined ? paddingBottom : padding,
            left: paddingLeft !== undefined ? paddingLeft : padding,
            right: paddingRight !== undefined ? paddingRight : padding,
        };
    }
    return {
        top: padding,
        bottom: padding,
        left: padding,
        right: padding,
    };
}
/**
 * @internal
 */
export function makePaddingString({ top, left, bottom, right, }) {
    return `${top}px ${right}px ${bottom}px ${left}px`;
}
//# sourceMappingURL=paddingFromProps.js.map