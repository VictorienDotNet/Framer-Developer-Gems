import { memoize } from "../../utils/memoize.js";
import { hash as stringHash } from "../../utils/string.js";
import { ConvertColor } from "../types/Color/ConvertColor.js";
const CSSVariableRegExp = /var\(.+\)/;
const colorCache = new Map();
function cachedMultiplyAlpha(s, a) {
    const key = [s, a];
    if (CSSVariableRegExp.test(s)) {
        return s;
    }
    return memoize(1000, colorCache, key, () => ConvertColor.multiplyAlpha(s, a));
}
/**
 * @param alpha - is optional because SVGs define the alpha as a seperate property
 * @internal
 */
export function gradientColorStops(gradient, alpha = 1) {
    let stops;
    if ("stops" in gradient) {
        stops = gradient.stops;
    }
    else {
        stops = [
            { value: gradient.start, position: 0 },
            { value: gradient.end, position: 1 },
        ];
    }
    if (alpha === 1) {
        return stops;
    }
    else {
        return stops.map(stop => ({ ...stop, value: cachedMultiplyAlpha(stop.value, alpha) }));
    }
}
export function gradientColorStopsHash(gradient, alpha) {
    let result = 0;
    gradientColorStops(gradient, alpha).forEach((stop) => {
        result ^= stringHash(stop.value) ^ stop.position;
    });
    return result;
}
//# sourceMappingURL=gradientColorStops.js.map