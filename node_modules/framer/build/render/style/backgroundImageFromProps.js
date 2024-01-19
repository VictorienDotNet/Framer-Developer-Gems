import { Animatable } from "../../animation/Animatable/Animatable.js";
import { isString } from "../../utils/utils.js";
import { BackgroundImage } from "../types/BackgroundImage.js";
function applyForwardOverrides(background, props) {
    const { _forwardedOverrideId, _forwardedOverrides, id } = props;
    const forwardedOverrideId = _forwardedOverrideId ?? id;
    const src = _forwardedOverrides && forwardedOverrideId ? _forwardedOverrides[forwardedOverrideId] : undefined;
    if (src && typeof src === "string") {
        background = { ...background, src };
    }
    return background;
}
/** @internal */
export function backgroundImageFromProps(props) {
    const { background, image } = props;
    if (image !== undefined && background && !BackgroundImage.isImageObject(background)) {
        // Give precedence to background prop that is not set to an image
        return;
    }
    let backgroundImage = null;
    if (isString(image)) {
        backgroundImage = { alt: "", src: image };
    }
    else {
        backgroundImage = Animatable.get(background, null);
    }
    if (!BackgroundImage.isImageObject(backgroundImage)) {
        return;
    }
    return applyForwardOverrides(backgroundImage, props);
}
//# sourceMappingURL=backgroundImageFromProps.js.map