import type { MotionStyle } from "framer-motion";
import type { BackgroundFilterProperties } from "../traits/BackdropFilters.js";
import type { FilterProperties } from "../traits/Filters.js";
export declare function collectLayerFilters(props: Partial<FilterProperties>, style: MotionStyle): void;
export declare function collectBackgroundFilters(props: Partial<BackgroundFilterProperties>, style: MotionStyle): void;
/** @internal */
export declare function collectFiltersFromProps(props: Partial<FilterProperties & BackgroundFilterProperties>, style: MotionStyle): void;
//# sourceMappingURL=filtersForNode.d.ts.map