import { shadowsAsFilter } from "../style/shadow.js";
import { isFiniteNumber } from "./isFiniteNumber.js";
export function collectLayerFilters(props, style) {
    const filters = [];
    /**
     * number-percentage types are set as numbers, as when filters are read from the DOM
     * they are returned as numbers rather than percetages. This makes it simpler for Motion
     * to animate from filters read from the DOM.
     */
    if (isFiniteNumber(props.brightness)) {
        filters.push(`brightness(${props.brightness / 100})`);
    }
    if (isFiniteNumber(props.contrast)) {
        filters.push(`contrast(${props.contrast / 100})`);
    }
    if (isFiniteNumber(props.grayscale)) {
        filters.push(`grayscale(${props.grayscale / 100})`);
    }
    if (isFiniteNumber(props.hueRotate)) {
        filters.push(`hue-rotate(${props.hueRotate}deg)`);
    }
    if (isFiniteNumber(props.invert)) {
        filters.push(`invert(${props.invert / 100})`);
    }
    if (isFiniteNumber(props.saturate)) {
        filters.push(`saturate(${props.saturate / 100})`);
    }
    if (isFiniteNumber(props.sepia)) {
        filters.push(`sepia(${props.sepia / 100})`);
    }
    if (isFiniteNumber(props.blur)) {
        filters.push(`blur(${props.blur}px)`);
    }
    if (props.dropShadows) {
        filters.push(...shadowsAsFilter(props.dropShadows));
    }
    if (filters.length === 0)
        return;
    style.filter = style.WebkitFilter = filters.join(" ");
}
export function collectBackgroundFilters(props, style) {
    if (isFiniteNumber(props.backgroundBlur)) {
        style.backdropFilter = style.WebkitBackdropFilter = `blur(${props.backgroundBlur}px)`;
    }
}
/** @internal */
export function collectFiltersFromProps(props, style) {
    collectBackgroundFilters(props, style);
    collectLayerFilters(props, style);
}
//# sourceMappingURL=filtersForNode.js.map