import type { MotionStyle } from "framer-motion";
import type { ReactNode } from "react";
import type { Rect } from "../types/Rect.js";
import React, { Component } from "react";
/** @public */
export interface IdentityProps {
    /** An unique id for the layer */
    id?: string;
    duplicatedFrom?: string[];
}
export interface WillChangeTransformProp {
    willChangeTransform?: boolean;
}
/** @public */
export interface DOMLayoutProps {
    /** @internal */
    _needsMeasure?: boolean;
    /** @internal */
    _usesDOMRect?: boolean;
    /** @internal */
    _domRect?: Rect | null;
}
/** @public */
export interface LayerProps extends IdentityProps, WillChangeTransformProp, DOMLayoutProps {
    children?: ReactNode;
    key?: React.Key;
    /**
     * @internal a stable identifier to use when generating layoutIds based on
     * duplicatedFrom.
     */
    layoutIdKey?: string;
    /**
     * @internal the prefixed node id, used for the forwarded overrides look up
     */
    _forwardedOverrideId?: string;
    /** @internal */
    _forwardedOverrides?: {
        [key: string]: any;
    };
    /** @internal */
    _index?: number;
}
/**
 * @public
 */
export declare class Layer<P extends Partial<LayerProps>, S> extends Component<P, S> {
    static readonly defaultProps: LayerProps;
    static applyWillChange(props: WillChangeTransformProp, style: MotionStyle, usingMotionStyle: boolean): void;
    private layerElement;
    setLayerElement: (element: HTMLElement | SVGElement | null) => void;
    /** @internal */
    shouldComponentUpdate(nextProps: P, nextState: S): boolean;
    /** @internal */
    componentDidUpdate(prevProps: P): void;
}
//# sourceMappingURL=Layer.d.ts.map