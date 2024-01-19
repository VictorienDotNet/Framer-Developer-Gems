import type { MotionStyle } from "framer-motion";
import type React from "react";
import type { BackgroundFilterProperties } from "../traits/BackdropFilters.js";
import type { FilterProperties } from "../traits/Filters.js";
import type { BoxShadowProperties } from "../traits/Shadow.js";
import { BackgroundProperties } from "../traits/Background.js";
import { BlendingProperties } from "../traits/Blending.js";
import { WithOpacity } from "../traits/Opacity.js";
import { OverflowProperties } from "../traits/Overflow.js";
import { RadiusProperties } from "../traits/Radius.js";
import { TextColorProperties } from "../traits/TextColor.js";
/** @public */
export type DeprecatedVisualProperties = Partial<BackgroundProperties & RadiusProperties & FilterProperties & BackgroundFilterProperties & BlendingProperties & OverflowProperties & BoxShadowProperties & WithOpacity & TextColorProperties>;
/** @internal */
export declare function collectVisualStyleFromProps(props: DeprecatedVisualProperties, style: React.CSSProperties | MotionStyle, isTextNode?: boolean): void;
//# sourceMappingURL=collectVisualStyleFromProps.d.ts.map