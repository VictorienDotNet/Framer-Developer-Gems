import React, { Component } from "react";
export class LinearGradientElement extends Component {
    render() {
        const { id, stops, x1, x2, y1, y2 } = this.props;
        return (React.createElement("linearGradient", { id: id, x1: x1, x2: x2, y1: y1, y2: y2 }, stops.map((stop, idx) => {
            return React.createElement("stop", { key: idx, offset: stop.position, stopColor: stop.color, stopOpacity: stop.alpha });
        })));
    }
}
export class RadialGradientElement extends Component {
    render() {
        const { centerAnchorX, centerAnchorY, id, widthFactor, heightFactor, stops } = this.props;
        return (React.createElement("radialGradient", { id: id, cy: centerAnchorY, cx: centerAnchorX, r: widthFactor, gradientTransform: `translate(${centerAnchorX}, ${centerAnchorY}) scale(1 ${heightFactor / widthFactor}) translate(-${centerAnchorX}, -${centerAnchorY})` }, stops.map((stop, idx) => {
            return React.createElement("stop", { key: idx, offset: stop.position, stopColor: stop.color, stopOpacity: stop.alpha });
        })));
    }
}
//# sourceMappingURL=GradientElement.js.map