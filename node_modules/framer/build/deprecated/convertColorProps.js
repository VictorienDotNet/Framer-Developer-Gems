import { Color } from "../render/types/Color/Color.js";
import { LinearGradient, RadialGradient } from "../render/types/Gradient.js";
import { isMotionValue } from "../render/utils/isMotionValue.js";
function convertColorObject(prop) {
    if (typeof prop === "string" || isMotionValue(prop)) {
        return prop;
    }
    else if (LinearGradient.isLinearGradient(prop)) {
        return LinearGradient.toCSS(prop);
    }
    else if (RadialGradient.isRadialGradient(prop)) {
        return RadialGradient.toCSS(prop);
    }
    else if (Color.isColorObject(prop)) {
        return Color.toRgbString(prop);
    }
    return prop;
}
export function convertColorProps(props) {
    if (props.background || props.color) {
        const converted = Object.assign({}, props);
        if (props.background) {
            converted.background = convertColorObject(props.background);
        }
        if (props.color) {
            converted.color = convertColorObject(props.color);
        }
        return converted;
    }
    return props;
}
//# sourceMappingURL=convertColorProps.js.map