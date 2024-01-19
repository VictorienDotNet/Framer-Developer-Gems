import type { PropsAddedByLink } from "../../modules/Link.js";
import type { BackgroundFilterProperties } from "../traits/BackdropFilters.js";
import type { Background } from "../traits/Background.js";
import type { FilterProperties } from "../traits/Filters.js";
import type { WithOpacity } from "../traits/Opacity.js";
import type { RadiusProperties } from "../traits/Radius.js";
import type { Rect } from "../types/Rect.js";
import type { Shadow } from "../types/Shadow.js";
import { Transition, Variants } from "framer-motion";
import React from "react";
import { Animatable } from "../../animation/Animatable/Animatable.js";
import { NewConstraintProperties, ParentSize } from "../types/NewConstraints.js";
import { Layer, LayerProps } from "./Layer.js";
/**
 * @internal
 */
export interface SVGProps extends Partial<NewConstraintProperties>, Partial<FilterProperties & BackgroundFilterProperties & RadiusProperties & WithOpacity>, PropsAddedByLink {
    rotation: Animatable<number> | number;
    visible: boolean;
    name?: string;
    fill?: Animatable<Background> | Background | null;
    svg: string;
    intrinsicWidth?: number;
    intrinsicHeight?: number;
    shadows: Readonly<Shadow[]>;
    parentSize?: ParentSize;
    withExternalLayout?: boolean;
    className?: string;
    style?: React.CSSProperties;
    variants?: Variants;
    transition?: Transition;
    /** If nonzero indicates a managed SVG of fixed size and with unique internal ids. */
    svgContentId?: number;
    title?: string;
    description?: string;
    tabIndex?: number;
    as?: keyof HTMLElementTagNameMap;
}
/**
 * @internal
 */
export interface SVGProperties extends SVGProps, LayerProps {
    ariaId?: string;
    layoutId?: string | undefined;
    /** @internal */
    innerRef?: React.RefObject<HTMLDivElement>;
    /** @internal */
    providedWindow?: typeof window | null;
}
/**
 * @internal
 */
export declare function SVG(props: Partial<SVGProperties>): React.ReactElement<any>;
declare class SVGComponentType extends Layer<SVGProperties, {}> {
    static supportsConstraints: boolean;
    static frame(props: Partial<SVGProperties>): any;
    static defaultSVGProps: SVGProps;
    static readonly defaultProps: SVGProperties;
    setSVGElement(element: SVGSVGElement | null): void;
    get frame(): Rect | null;
}
export declare const SVGComponent: typeof SVGComponentType;
export {};
//# sourceMappingURL=SVG.d.ts.map