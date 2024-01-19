import { Component } from "react";
import { isEqual } from "../utils/isEqual.js";
import { forceLayerBackingWithCSSProperties, forceLayerBackingWithMotionStyle } from "../utils/setLayerBacked.js";
import { resetSetStyle } from "../utils/useWebkitFixes.js";
/**
 * @public
 */
export class Layer extends Component {
    static defaultProps = {};
    static applyWillChange(props, style, usingMotionStyle) {
        if (props.willChangeTransform) {
            if (usingMotionStyle) {
                forceLayerBackingWithMotionStyle(style);
            }
            else {
                forceLayerBackingWithCSSProperties(style);
            }
        }
    }
    layerElement = null;
    setLayerElement = (element) => {
        this.layerElement = element;
    };
    /** @internal */
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps._needsMeasure || this.state !== nextState || !isEqual(this.props, nextProps);
    }
    /** @internal */
    componentDidUpdate(prevProps) {
        // Workarounds for WebKit bugs
        // Some styles have to be toggled to take effect in certain situations.
        // Not using type safety, uses lots of internal knowledge for efficiency
        // To use this as a hook, see useWebKitFixes
        if (this.props["clip"] && this.props["radius"] === 0 && prevProps["radius"] !== 0) {
            resetSetStyle(this.layerElement, "overflow", "hidden", false);
        }
    }
}
//# sourceMappingURL=Layer.js.map