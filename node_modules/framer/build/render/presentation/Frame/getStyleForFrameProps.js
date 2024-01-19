import { collectBackgroundFromProps } from "../../traits/Background.js";
import { extractStyleFromProps } from "../../utils/extractStyleFromProps.js";
export function hasLeftAndRight(style) {
    if (!style)
        return false;
    return style.left !== undefined && style.right !== undefined;
}
export function hasTopAndBottom(style) {
    if (!style)
        return false;
    return style.top !== undefined && style.bottom !== undefined;
}
export function getStyleForFrameProps(props) {
    if (!props) {
        return {};
    }
    const style = {};
    // Styles
    if (props.preserve3d === true) {
        style.transformStyle = "preserve-3d";
    }
    else if (props.preserve3d === false) {
        style.transformStyle = "flat";
    }
    if (props.backfaceVisible === true) {
        style.backfaceVisibility = "visible";
    }
    else if (props.backfaceVisible === false) {
        style.backfaceVisibility = "hidden";
    }
    if (style.backfaceVisibility) {
        style.WebkitBackfaceVisibility = style.backfaceVisibility;
    }
    if (props.perspective !== undefined) {
        style.perspective = style.WebkitPerspective = props.perspective;
    }
    // Generated Component instances set left and top via CSS. But can still be
    // centered with a centering transform.
    if (!props.__fromCanvasComponent) {
        if (props.center === true) {
            style.left = "50%";
            style.top = "50%";
        }
        else {
            if (props.center === "x") {
                style.left = "50%";
            }
            else if (props.center === "y") {
                style.top = "50%";
            }
        }
    }
    extractStyleFromProps(props, "size", style);
    extractStyleFromProps(props, "width", style);
    extractStyleFromProps(props, "height", style);
    extractStyleFromProps(props, "minWidth", style);
    extractStyleFromProps(props, "minHeight", style);
    extractStyleFromProps(props, "top", style);
    extractStyleFromProps(props, "right", style);
    extractStyleFromProps(props, "bottom", style);
    extractStyleFromProps(props, "left", style);
    extractStyleFromProps(props, "position", style);
    extractStyleFromProps(props, "overflow", style);
    extractStyleFromProps(props, "opacity", style);
    // avoid "double border" issues
    if (!props._border || !props._border.borderWidth)
        extractStyleFromProps(props, "border", style);
    extractStyleFromProps(props, "borderRadius", style);
    extractStyleFromProps(props, "radius", style, "borderRadius");
    extractStyleFromProps(props, "color", style);
    extractStyleFromProps(props, "shadow", style, "boxShadow");
    extractStyleFromProps(props, "x", style);
    extractStyleFromProps(props, "y", style);
    extractStyleFromProps(props, "z", style);
    extractStyleFromProps(props, "rotate", style);
    extractStyleFromProps(props, "rotateX", style);
    extractStyleFromProps(props, "rotateY", style);
    extractStyleFromProps(props, "rotateZ", style);
    extractStyleFromProps(props, "scale", style);
    extractStyleFromProps(props, "scaleX", style);
    extractStyleFromProps(props, "scaleY", style);
    extractStyleFromProps(props, "skew", style);
    extractStyleFromProps(props, "skewX", style);
    extractStyleFromProps(props, "skewY", style);
    extractStyleFromProps(props, "originX", style);
    extractStyleFromProps(props, "originY", style);
    extractStyleFromProps(props, "originZ", style);
    collectBackgroundFromProps(props, style);
    return style;
}
//# sourceMappingURL=getStyleForFrameProps.js.map