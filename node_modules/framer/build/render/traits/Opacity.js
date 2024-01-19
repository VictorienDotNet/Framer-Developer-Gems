import { Animatable } from "../../animation/Animatable/Animatable.js";
const key = "opacity";
/** @internal */
export function withOpacity(target) {
    return key in target;
}
/** @internal */
export function collectOpacityFromProps(props, style) {
    if (!withOpacity(props))
        return;
    const opacity = Animatable.getNumber(props.opacity);
    if (opacity === 1)
        return;
    style.opacity = opacity;
}
//# sourceMappingURL=Opacity.js.map