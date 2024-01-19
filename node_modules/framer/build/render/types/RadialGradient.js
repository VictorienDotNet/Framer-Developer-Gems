import { gradientColorStops, gradientColorStopsHash } from "../utils/gradientColorStops.js";
import { isMultiStopGradient } from "./MultiStopGradient.js";
import { isSimpleGradient } from "./SimpleGradient.js";
const radialGradientKeys = [
    "widthFactor",
    "heightFactor",
    "centerAnchorX",
    "centerAnchorY",
    "alpha",
];
/**
 * @public
 */
export const RadialGradient = {
    /**
     * @param value -
     * @public
     */
    isRadialGradient: (value) => {
        return (value &&
            radialGradientKeys.every(key => key in value) &&
            (isSimpleGradient(value) || isMultiStopGradient(value)));
    },
    /** @internal */
    hash: (radialGradient) => {
        return (radialGradient.centerAnchorX ^
            radialGradient.centerAnchorY ^
            radialGradient.widthFactor ^
            radialGradient.heightFactor ^
            gradientColorStopsHash(radialGradient, radialGradient.alpha));
    },
    /** @internal */
    toCSS: (radialGradient) => {
        const { alpha, widthFactor, heightFactor, centerAnchorX, centerAnchorY } = radialGradient;
        const stops = gradientColorStops(radialGradient, alpha);
        const cssStops = stops.map(stop => `${stop.value} ${stop.position * 100}%`);
        return `radial-gradient(${widthFactor * 100}% ${heightFactor * 100}% at ${centerAnchorX * 100}% ${centerAnchorY * 100}%, ${cssStops.join(", ")})`;
    },
};
//# sourceMappingURL=RadialGradient.js.map