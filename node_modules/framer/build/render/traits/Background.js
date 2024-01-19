import { Animatable } from "../../animation/Animatable/Animatable.js";
import { isMotionValue } from "../../render/utils/isMotionValue.js";
import { Color } from "../types/Color/Color.js";
import { LinearGradient, RadialGradient } from "../types/Gradient.js";
// Note: this does not include background images
export function collectBackgroundFromProps({ background, backgroundColor }, style) {
    if (backgroundColor) {
        if (typeof backgroundColor === "string" || isMotionValue(backgroundColor)) {
            style.backgroundColor = backgroundColor;
        }
        else if (Color.isColorObject(background)) {
            style.backgroundColor = background.initialValue || Color.toRgbString(background);
        }
    }
    else if (background) {
        background = Animatable.get(background, null);
        if (typeof background === "string" || isMotionValue(background)) {
            style.background = background;
        }
        else if (LinearGradient.isLinearGradient(background)) {
            style.background = LinearGradient.toCSS(background);
        }
        else if (RadialGradient.isRadialGradient(background)) {
            style.background = RadialGradient.toCSS(background);
        }
        else if (Color.isColorObject(background)) {
            style.backgroundColor = background.initialValue || Color.toRgbString(background);
        }
    }
}
//# sourceMappingURL=Background.js.map