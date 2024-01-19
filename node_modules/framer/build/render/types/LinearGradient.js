import { gradientColorStops, gradientColorStopsHash } from "../utils/gradientColorStops.js";
import { isMultiStopGradient } from "./MultiStopGradient.js";
import { isSimpleGradient } from "./SimpleGradient.js";
const linearGradientKeys = ["angle", "alpha"];
/**
 * @public
 */
export const LinearGradient = {
    /**
     * @param value -
     */
    isLinearGradient: (value) => {
        return (value &&
            linearGradientKeys.every(key => key in value) &&
            (isSimpleGradient(value) || isMultiStopGradient(value)));
    },
    /** @internal */
    hash: (linearGradient) => {
        return linearGradient.angle ^ gradientColorStopsHash(linearGradient, linearGradient.alpha);
    },
    /** @internal */
    toCSS: (linearGradient, overrideAngle) => {
        const stops = gradientColorStops(linearGradient, linearGradient.alpha);
        const angle = overrideAngle !== undefined ? overrideAngle : linearGradient.angle;
        const cssStops = stops.map(stop => `${stop.value} ${stop.position * 100}%`);
        return `linear-gradient(${angle}deg, ${cssStops.join(", ")})`;
    },
};
//# sourceMappingURL=LinearGradient.js.map