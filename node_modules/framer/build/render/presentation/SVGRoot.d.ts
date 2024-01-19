import type { Rect } from "../types/Rect.js";
import React, { Component } from "react";
/**
 * @internal
 */
export interface SVGRootProps {
    frame: Rect;
    width: number;
    height: number;
    willChangeTransform?: boolean;
    innerRef?: (ref: SVGSVGElement | null) => void;
}
/**
 * @internal
 */
export declare class SVGRoot extends Component<SVGRootProps & {
    children?: React.ReactNode;
}, {}> {
    render(): JSX.Element;
}
//# sourceMappingURL=SVGRoot.d.ts.map