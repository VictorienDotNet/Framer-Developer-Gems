import { motion } from "framer-motion";
import React from "react";
/** @internal */
export function collectBorderStyleForProps(props, style, collapseEqualBorders = true) {
    const { borderWidth, borderStyle, borderColor } = props;
    if (!borderWidth) {
        return;
    }
    let borderTop;
    let borderBottom;
    let borderLeft;
    let borderRight;
    if (typeof borderWidth === "number") {
        borderTop = borderBottom = borderLeft = borderRight = borderWidth;
    }
    else {
        borderTop = borderWidth.top || 0;
        borderBottom = borderWidth.bottom || 0;
        borderLeft = borderWidth.left || 0;
        borderRight = borderWidth.right || 0;
    }
    if (borderTop === 0 && borderBottom === 0 && borderLeft === 0 && borderRight === 0) {
        return;
    }
    // Equal border
    if (collapseEqualBorders && borderTop === borderBottom && borderTop === borderLeft && borderTop === borderRight) {
        style.border = `${borderTop}px ${borderStyle} ${borderColor}`;
        return;
    }
    style.borderStyle = props.borderStyle;
    style.borderColor = props.borderColor;
    style.borderTopWidth = `${borderTop}px`;
    style.borderBottomWidth = `${borderBottom}px`;
    style.borderLeftWidth = `${borderLeft}px`;
    style.borderRightWidth = `${borderRight}px`;
}
export function Border(props) {
    const layoutId = props.layoutId ? `${props.layoutId}-border` : undefined;
    if (!props.borderWidth) {
        return null;
    }
    const style = {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        borderRadius: "inherit",
        pointerEvents: "none",
    };
    if (props.border) {
        ;
        style.border = props.border;
        return React.createElement(motion.div, { style: style });
    }
    collectBorderStyleForProps(props, style, false);
    return React.createElement(motion.div, { "data-frame-border": true, style: style, layoutId: layoutId });
}
//# sourceMappingURL=BorderComponent.js.map