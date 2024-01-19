import { MotionProps, MotionStyle } from "framer-motion";
import * as React from "react";
import { Animatable } from "../../animation/Animatable/Animatable.js";
import type { FilterProperties } from "../traits/Filters.js";
import { NewConstraintProperties, ParentSize, PositionAbsoluteProperties, PositionFixedProperties } from "../types/NewConstraints.js";
import { RenderTarget } from "../types/RenderEnvironment.js";
import type { Shadow } from "../types/Shadow.js";
import type { LayerProps } from "./Layer.js";
import type { TextVerticalAlignment } from "./Text.js";
/**
 * @internal
 * Don't change these values as they are used in generated components as well.
 */
export declare const deprecatedRichTextPlaceholder = "{{ text-placeholder }}";
export declare const richTextWrapperClassName = "rich-text-wrapper";
/** @internal */
export interface DeprecatedRichTextProps extends NewConstraintProperties, PositionFixedProperties, PositionAbsoluteProperties, Partial<FilterProperties>, LayerProps, Pick<MotionProps, "transformTemplate"> {
    __fromCanvasComponent?: boolean;
    __htmlStructure?: string;
    className?: string;
    environment?(): RenderTarget;
    fonts?: string[];
    html?: string;
    htmlFromDesign?: string;
    innerRef?: React.MutableRefObject<HTMLDivElement | null>;
    isEditable?: boolean;
    name?: string;
    opacity?: number;
    parentSize?: ParentSize;
    preload?: string[];
    rotation?: Animatable<number> | number;
    shadows?: readonly Shadow[];
    style?: MotionStyle;
    stylesPresetsClassName?: string;
    text?: string;
    textFromDesign?: string;
    value?: string;
    verticalAlignment?: TextVerticalAlignment;
    visible?: boolean;
    withExternalLayout?: boolean;
}
/** @internal @deprecated */
export declare const DeprecatedRichText: React.ForwardRefExoticComponent<Partial<DeprecatedRichTextProps> & React.RefAttributes<HTMLDivElement>>;
export declare function convertVerticalAlignment(verticalAlignment: TextVerticalAlignment): "center" | "flex-start" | "flex-end";
export declare function useLoadFonts(fonts: string[], fromCanvasComponent: boolean, containerRef: React.RefObject<HTMLElement | SVGElement>): void;
//# sourceMappingURL=DeprecatedRichText.d.ts.map