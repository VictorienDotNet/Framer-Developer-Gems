import React, { Component } from "react";
import { imageUrlForAsset } from "../utils/imageUrlForAsset.js";
export class ImagePatternElement extends Component {
    render() {
        const { id, path, transform } = this.props;
        const xlinkHref = imageUrlForAsset(path);
        return (React.createElement("pattern", { id: id, width: "100%", height: "100%", patternContentUnits: "objectBoundingBox" },
            React.createElement("image", { key: xlinkHref, width: 1, height: 1, xlinkHref: xlinkHref, preserveAspectRatio: "none", transform: transform })));
    }
}
//# sourceMappingURL=ImagePatternElement.js.map