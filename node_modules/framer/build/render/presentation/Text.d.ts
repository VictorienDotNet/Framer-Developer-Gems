import type { Size } from "../../render/types/Size.js";
import type { FilterProperties } from "../traits/Filters.js";
import type { Rect } from "../types/Rect.js";
import type { Shadow } from "../types/Shadow.js";
import { MotionProps, MotionStyle, Transition, Variants } from "framer-motion";
import React from "react";
import { Animatable } from "../../animation/Animatable/Animatable.js";
import { FontLoadStatus } from "../fonts/useFontLoadStatus.js";
import { NewConstraintProperties, ParentSize, PositionAbsoluteProperties, PositionFixedProperties } from "../types/NewConstraints.js";
import { RenderTarget } from "../types/RenderEnvironment.js";
import { Layer, LayerProps } from "./Layer.js";
/**
 * @internal
 */
export type TextAlignment = "left" | "right" | "center" | undefined;
/**
 * @internal
 */
export type TextVerticalAlignment = "top" | "center" | "bottom";
/**
 * @internal
 */
export interface TextProps extends NewConstraintProperties, PositionFixedProperties, PositionAbsoluteProperties, Partial<FilterProperties> {
    rotation: Animatable<number> | number;
    visible: boolean;
    name?: string;
    alignment: TextAlignment;
    verticalAlignment: TextVerticalAlignment;
    /**
     * @deprecated The single autoSize property will only be passed in when the
       supportsDomLayout platform check is NOT on, and will ultimately be
       removed
     */
    autoSize?: boolean;
    opacity?: number;
    shadows: Readonly<Shadow[]>;
    style?: MotionStyle;
    text?: string;
    font?: string;
    parentSize?: ParentSize;
    viewportSize?: Size | null;
}
/**
 * @internal
 */
export interface TextProperties extends TextProps, LayerProps, Pick<MotionProps, "transformTemplate"> {
    rawHTML?: string;
    isEditable?: boolean;
    fonts?: string[];
    fontLoadStatus: FontLoadStatus;
    layoutId?: string | undefined;
    className?: string;
    /** @internal */
    withExternalLayout?: boolean;
    /** @internal for testing */
    environment?(): RenderTarget;
    /** @internal */
    innerRef?: React.MutableRefObject<HTMLDivElement | null>;
    transition?: Transition;
    variants?: Variants;
    /** @internal */
    __fromCanvasComponent?: boolean;
    /** @internal */
    _initialStyle?: Partial<MotionStyle>;
    /** @internal */
    preload?: string[];
    /** @internal */
    __link?: string;
    /** @internal */
    tabIndex?: number;
}
/**
 * @internal
 */
export declare const Text: React.ForwardRefExoticComponent<Partial<TextProperties> & React.RefAttributes<HTMLDivElement>>;
declare class TextComponentType extends Layer<TextProperties & {
    matchesCurrentRoute: boolean;
}, {}> {
    static supportsConstraints: boolean;
    static defaultTextProps: TextProps;
    static readonly defaultProps: TextProperties;
    editorText: string | undefined;
    get frame(): Rect | null;
    getOverrideText(): void;
    get transformTemplate(): ((_: any, generated: string) => string) | undefined;
}
export declare const TextComponent: typeof TextComponentType;
/**
 * If text is overriden in an override or by a variable, we take the rawHTML,
 * find the first styled span inside the first block, put the text in there, and
 * discard everything else. For example:
 *
 *     <p>
 *         <span>
 *             <span style="BOLD">Hello </span>
 *             <span>World from the 1st block</span>
 *             <br>
 *         </span>
 *         <span>
 *             <!-- Second block is an empty line -->
 *             <span><br></span>
 *         </span>
 *         <span>
 *             <span>More text in third block</span>
 *             <br>
 *         </span>
 *     </p>
 *
 * will become:
 *
 *     <h1>
 *         <span>
 *             <span style="BOLD">Text from the text prop, e.g., a variable or an override</span>
 *             <br>
 *         </span>
 *     </h1>
 */
export declare function replaceDraftHTMLWithText(rawHTML: string, text: string): string;
export {};
//# sourceMappingURL=Text.d.ts.map