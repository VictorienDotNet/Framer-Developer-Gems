import type { Rect } from "../types/Rect.js";
import { Layer, LayerProps } from "./Layer.js";
/**
 * @internal
 */
export interface VectorGroupProps {
    name?: string;
    opacity?: number | string;
    visible: boolean;
    x: number;
    y: number;
    rotation: number;
    width: number;
    height: number;
    targetName?: string;
    defaultName: string;
    isRootVectorNode: boolean;
    frame: Rect;
    includeTransform?: boolean;
}
/**
 * @internal
 */
export interface VectorGroupProperties extends VectorGroupProps, LayerProps {
}
declare class VectorGroupType extends Layer<VectorGroupProperties, {}> {
    static defaultVectorGroupProps: VectorGroupProps;
    static readonly defaultProps: VectorGroupProperties;
}
/**
 * @internal
 */
export declare const VectorGroup: typeof VectorGroupType;
export {};
//# sourceMappingURL=VectorGroup.d.ts.map