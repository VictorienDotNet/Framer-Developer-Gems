import type { FillProperties } from "../traits/Fill.js";
import type { Rect } from "../types/Rect.js";
import type { BoxShadow } from "../types/Shadow.js";
import type { LineCap, LineJoin } from "../types/Stroke.js";
import type { StrokeAlignment } from "../types/StrokeAlignment.js";
import { Transition, Variants } from "framer-motion";
import { WithPath } from "../traits/Path.js";
import { Layer, LayerProps } from "./Layer.js";
/**
 * @internal
 */
export interface VectorProps extends Partial<FillProperties> {
    isRootVectorNode: boolean;
    name: string | null;
    includeTransform?: boolean;
    defaultFillColor?: string;
    defaultStrokeColor?: string;
    defaultStrokeWidth?: number;
    defaultStrokeAlignment?: StrokeAlignment;
    width: number;
    height: number;
    rotation: number;
    /**
     * For simplicity in Framer, accept `rotate`, (the framer-motion
     * property key), and prefer it when provided over the `rotation` prop.
     */
    rotate?: number;
    /**
     * For brevity `frame` is optional, and `rect` will be used in it's place if
     * `frame` is not supplied, since they are usually* identical.
     */
    frame?: Rect;
    opacity?: number;
    calculatedPath: WithPath[];
    d?: string;
    shapeId?: string;
    insideStroke: boolean;
    strokeEnabled: boolean;
    strokeClipId?: string;
    strokeWidth?: number;
    idAttribute?: string;
    shadows: BoxShadow[];
    rect: Rect;
    strokeAlpha: number;
    lineCap: LineCap;
    lineJoin: LineJoin;
    strokeColor: string;
    strokeMiterLimit: number;
    strokeDashArray: string;
    strokeDashOffset: number;
    variants?: Variants;
    transition?: Transition;
}
/**
 * @internal
 */
export interface VectorProperties extends VectorProps, LayerProps {
}
declare class VectorType extends Layer<VectorProperties, {}> {
    static defaultVectorProps: VectorProps;
    static readonly defaultProps: VectorProperties;
}
/**
 * @internal
 */
export declare const Vector: typeof VectorType;
export {};
//# sourceMappingURL=Vector.d.ts.map