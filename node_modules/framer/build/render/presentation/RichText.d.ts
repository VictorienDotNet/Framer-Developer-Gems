import type { FilterProperties } from "../traits/Filters.js";
import type { TextShadowProperties } from "../traits/Shadow.js";
import type { LayerProps } from "./Layer.js";
import type { TextVerticalAlignment } from "./Text.js";
import { MotionProps } from "framer-motion";
import React from "react";
import { Animatable } from "../../animation/Animatable/Animatable.js";
import { NewConstraintProperties } from "../types/NewConstraints.js";
import { RenderTarget } from "../types/RenderEnvironment.js";
import { DeprecatedRichTextProps } from "./DeprecatedRichText.js";
/** @internal */
export interface RichTextProps extends NewConstraintProperties, Partial<FilterProperties>, Omit<LayerProps, "children">, Partial<TextShadowProperties>, MotionProps {
    __fromCanvasComponent?: boolean;
    children?: React.ReactElement;
    className?: string;
    environment?(): RenderTarget;
    fonts?: string[];
    isEditable?: boolean;
    name?: string;
    opacity?: number;
    rotation?: Animatable<number> | number;
    stylesPresetsClassNames?: Record<string, string>;
    text?: string;
    verticalAlignment?: TextVerticalAlignment;
    visible?: boolean;
    withExternalLayout?: boolean;
    viewBox?: string;
    viewBoxScale?: number;
}
/** @internal */
export declare const RichText: React.ForwardRefExoticComponent<RichTextProps & DeprecatedRichTextProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=RichText.d.ts.map