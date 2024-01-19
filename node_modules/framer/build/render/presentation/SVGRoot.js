import React, { Component } from "react";
import { Layer } from "./Layer.js";
/**
 * @internal
 */
export class SVGRoot extends Component {
    render() {
        const { children, frame, innerRef } = this.props;
        const { width, height } = frame;
        const fx = Math.floor(frame.x);
        const fy = Math.floor(frame.y);
        /**
         * @TODO These styles need to animate if changed by a Generated Variant.
         * However, we cannot use `animate` since that will block the children
         * from reacting to the active variant. We also have to consider canvas
         * performance.
         */
        const svgStyle = {
            position: "absolute",
            width: Math.ceil(width),
            height: Math.ceil(height),
            overflow: "visible",
            display: "block",
            transform: `translate(${fx}px, ${fy}px)`,
        };
        Layer.applyWillChange(this.props, svgStyle, false);
        return (React.createElement("svg", { width: "100%", height: "100%", xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink", style: svgStyle, ref: innerRef }, children));
    }
}
//# sourceMappingURL=SVGRoot.js.map