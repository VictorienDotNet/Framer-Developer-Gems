import process from "process";
import React from "react";
import { Animatable, isAnimatable } from "../../../animation/Animatable/index.js";
import { ObservableObject } from "../../../data/ObservableObject.js";
import { safeWindow } from "../../../utils/safeWindow.js";
import { backgroundImageFromProps } from "../../style/backgroundImageFromProps.js";
import { Border } from "../../style/BorderComponent.js";
import { collectVisualStyleFromProps } from "../../style/collectVisualStyleFromProps.js";
import { collectTransformFromProps, transformDefaults } from "../../traits/Transform.js";
import { BackgroundImage } from "../../types/BackgroundImage.js";
import { Color } from "../../types/Color/Color.js";
import { constraintDefaults, ConstraintValues, isConstraintSupportingChild, } from "../../types/Constraints.js";
import { ConstraintsContext, ParentSizeState, ProvideParentSize } from "../../types/NewConstraints.js";
import { RenderEnvironment, RenderTarget } from "../../types/RenderEnvironment.js";
import { isFiniteNumber } from "../../utils/isFiniteNumber.js";
import { Layer } from "../Layer.js";
/** @internal */
export function cssBackgroundSize(size) {
    switch (size) {
        case "fit":
            return "contain";
        case "stretch":
            return "100% 100%";
        default:
            return "cover";
    }
}
function collectBackgroundImageFromProps(props, style) {
    const image = backgroundImageFromProps(props);
    if (image) {
        style.backgroundImage = `url("${image.src}")`;
        style.backgroundSize = cssBackgroundSize(image.fit);
        style.backgroundRepeat = "no-repeat";
        style.backgroundPosition = "center";
    }
}
function toPixelString(value) {
    return isFiniteNumber(value) ? `${value}px` : value;
}
function applyLayoutProp(style, props, key) {
    if (props[key] !== undefined) {
        const value = Animatable.get(props[key], undefined);
        style[key] = toPixelString(value);
    }
}
/**
 * @public
 */
export const DeprecatedFrame = /* @__PURE__ */ (() => {
    class DeprecatedFrameInner extends Layer {
        static supportsConstraints = true;
        static defaultFrameSpecificProps = {
            ...constraintDefaults,
            ...transformDefaults,
            opacity: 1,
            background: Color("rgba(0, 170, 255, 0.3)"),
            visible: true,
            borderWidth: 0,
            borderColor: "#222",
            borderStyle: "solid",
        };
        static defaultProps = {
            ...Layer.defaultProps,
            ...DeprecatedFrameInner.defaultFrameSpecificProps,
        };
        static rect(props) {
            const constraintValues = ConstraintValues.fromProperties(props);
            const parentSizeInfo = props.parentSize
                ? { sizing: props.parentSize, positioning: props.parentSize, viewport: null }
                : null;
            return ConstraintValues.toRect(constraintValues, parentSizeInfo, null, true);
        }
        get rect() {
            return DeprecatedFrameInner.rect(this.props);
        }
        element = null;
        imageDidChange = false;
        state = {
            size: null,
        };
        static getDerivedStateFromProps(nextProps, prevState) {
            const size = DeprecatedFrameInner.updatedSize(nextProps, prevState);
            const { target } = RenderEnvironment;
            const nextBackgroundImageSrc = nextProps.background && BackgroundImage.isImageObject(nextProps.background)
                ? nextProps.background.src
                : null;
            if (nextBackgroundImageSrc) {
                return {
                    size: size,
                };
            }
            if (prevState.size) {
                if (target === RenderTarget.preview) {
                    return null;
                }
                if (prevState.size.width === size.width && prevState.size.height === size.height) {
                    return null;
                }
            }
            return {
                size: size,
            };
        }
        static updatedSize(props, state) {
            const rect = DeprecatedFrameInner.rect(props);
            let size = state.size;
            const newSize = { width: rect.width, height: rect.height };
            const { target } = RenderEnvironment;
            if (!size) {
                if (target === RenderTarget.preview) {
                    size = ObservableObject(newSize, true);
                }
                else {
                    size = newSize;
                }
            }
            else {
                if (isAnimatable(size.width) && isAnimatable(size.height)) {
                    size.width.set(newSize.width);
                    size.height.set(newSize.height);
                }
                else {
                    size = newSize;
                }
            }
            return size;
        }
        getStyle() {
            const rect = this.rect;
            const style = {
                display: "block",
                position: "absolute",
                width: `${rect.width}px`,
                height: `${rect.height}px`,
                pointerEvents: undefined,
                userSelect: "none",
            };
            let left = Animatable.get(this.props.left, undefined);
            let top = Animatable.get(this.props.top, undefined);
            Object.assign(style, this.props._initialStyle);
            const hasParentSize = this.context.parentSize !== ParentSizeState.Disabled;
            const perspective = Animatable.get(this.props.perspective, undefined);
            style.perspective = perspective;
            style.WebkitPerspective = perspective;
            let backfaceVisibility = undefined;
            const backfaceVisible = Animatable.get(this.props.backfaceVisible, undefined);
            if (backfaceVisible === true) {
                backfaceVisibility = "visible";
            }
            else if (backfaceVisible === false) {
                backfaceVisibility = "hidden";
            }
            style.backfaceVisibility = backfaceVisibility;
            style.WebkitBackfaceVisibility = backfaceVisibility;
            const preserve3d = Animatable.get(this.props.preserve3d, undefined);
            if (preserve3d === true) {
                style.transformStyle = "preserve-3d";
            }
            else if (preserve3d === false) {
                style.transformStyle = "flat";
            }
            /**
             * If we don't have ParentSizeState, we can't correctly figure out x/y position based
             * on the parent size and this component's width/height. So we can apply right and bottom
             * directly and let the DOM layout figure out the rest.
             */
            if (!hasParentSize) {
                applyLayoutProp(style, this.props, "right");
                applyLayoutProp(style, this.props, "bottom");
                // If `left` and `top` have been provided here as a percentage from Vekter,
                // these percentages are calculated from the center of the div
                const width = Animatable.get(this.props.width, undefined);
                const stringWidth = toPixelString(width);
                const height = Animatable.get(this.props.height, undefined);
                const stringHeight = toPixelString(height);
                if (typeof left === "string" && left.endsWith("%") && this.props.right === null) {
                    left = `calc(${left} - calc(${stringWidth}} / 2))`;
                    style.width = stringWidth;
                }
                if (typeof top === "string" && top.endsWith("%") && this.props.bottom === null) {
                    top = `calc(${top} - calc(${stringHeight} / 2))`;
                    style.height = stringHeight;
                }
                // If pinned to both, reset physical dimensions
                if (top !== undefined && style.bottom !== undefined) {
                    style.height = undefined;
                    top = toPixelString(Animatable.get(this.props.top, undefined));
                }
                else {
                    style.height = stringHeight;
                }
                if (left !== undefined && style.right !== undefined) {
                    style.width = undefined;
                    left = toPixelString(Animatable.get(this.props.left, undefined));
                }
                else {
                    style.width = stringWidth;
                }
            }
            const transformRect = { ...rect };
            if (typeof left !== "undefined") {
                transformRect.x = left;
            }
            if (typeof top !== "undefined") {
                transformRect.y = top;
            }
            collectTransformFromProps(this.props, transformRect, style);
            collectVisualStyleFromProps(this.props, style);
            collectBackgroundImageFromProps(this.props, style);
            Layer.applyWillChange(this.props, style, false);
            // TODO disable style overrides in strict mode
            if (this.props.style) {
                Object.assign(style, this.props.style);
            }
            return style;
        }
        updateStyle = () => {
            if (!this.element) {
                return;
            }
            Object.assign(this.element.style, this.getStyle());
        };
        setElement = (element) => {
            this.element = element;
            this.setLayerElement(element);
        };
        // XXX internal state
        propsObserver;
        propsObserverCancel;
        sizeObserver;
        sizeObserverCancel;
        componentDidMount() {
            const { target } = RenderEnvironment;
            if (target === RenderTarget.preview) {
                this.propsObserver = ObservableObject(this.props, true);
                this.propsObserverCancel = ObservableObject.addObserver(this.propsObserver, this.onPropsChange);
                if (this.props.parentSize &&
                    isAnimatable(this.props.parentSize.width) &&
                    isAnimatable(this.props.parentSize.height)) {
                    this.sizeObserver = ObservableObject(this.props.parentSize, true);
                    this.sizeObserverCancel = ObservableObject.addObserver(this.sizeObserver, this.onSizeChange);
                }
            }
        }
        componentDidUpdate() {
            const { target } = RenderEnvironment;
            this.propsObserverCancel && this.propsObserverCancel();
            this.sizeObserverCancel && this.sizeObserverCancel();
            if (target === RenderTarget.preview) {
                this.propsObserver = ObservableObject(this.props, true);
                this.propsObserverCancel = ObservableObject.addObserver(this.propsObserver, this.onPropsChange);
                if (this.props.parentSize &&
                    isAnimatable(this.props.parentSize.width) &&
                    isAnimatable(this.props.parentSize.height)) {
                    this.sizeObserver = ObservableObject(this.props.parentSize, true);
                    this.sizeObserverCancel = ObservableObject.addObserver(this.sizeObserver, this.onSizeChange);
                }
            }
        }
        onPropsChange = (props) => {
            const rect = DeprecatedFrameInner.rect(Animatable.objectToValues(props.value));
            if (this.state.size && isAnimatable(this.state.size.width) && isAnimatable(props.value.width)) {
                this.state.size.width.set(rect.width);
            }
            if (this.state.size && isAnimatable(this.state.size.height) && isAnimatable(props.value.height)) {
                this.state.size.height.set(rect.height);
            }
            this.updateStyle();
        };
        onSizeChange = () => {
            this.updateStyle();
        };
        componentWillUnmount() {
            this.propsObserverCancel && this.propsObserverCancel();
            this.propsObserverCancel = undefined;
            this.sizeObserverCancel && this.sizeObserverCancel();
            this.sizeObserverCancel = undefined;
        }
        render() {
            if (process.env.NODE_ENV !== "production" && safeWindow["perf"])
                safeWindow["perf"].nodeRender();
            const { visible, id, className } = this.props;
            if (!visible) {
                return null;
            }
            const style = this.getStyle();
            const rect = this.rect;
            const parentSize = { width: rect.width, height: rect.height };
            return (React.createElement("div", { id: id, style: style, ref: this.setElement, className: className },
                React.createElement(ProvideParentSize, { parentSize: parentSize }, this.layoutChildren()),
                React.createElement(Border, { ...this.props })));
        }
        layoutChildren() {
            let _forwardedOverrides = this.props._forwardedOverrides;
            const extractions = this.props._overrideForwardingDescription;
            if (extractions) {
                let added = false;
                _forwardedOverrides = {};
                for (const [key, value] of Object.entries(extractions)) {
                    added = true;
                    _forwardedOverrides[key] = this.props[value];
                }
                if (!added) {
                    _forwardedOverrides = undefined;
                }
            }
            let children = React.Children.map(this.props.children, (child) => {
                if (isConstraintSupportingChild(child)) {
                    return React.cloneElement(child, {
                        parentSize: this.state.size,
                        _forwardedOverrides,
                    });
                }
                else if (_forwardedOverrides && child) {
                    return React.cloneElement(child, { _forwardedOverrides });
                }
                else {
                    return child;
                }
            });
            // We wrap raw strings in a default style to display
            if (children && children.length === 1 && typeof children[0] === "string") {
                children = [React.createElement(Center, { key: "0" }, children)];
            }
            return children;
        }
    }
    DeprecatedFrameInner.contextType = ConstraintsContext;
    return DeprecatedFrameInner;
})();
export function Center(props) {
    const style = Object.assign({}, {
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Helvetica",
    }, props.style || {});
    return React.createElement("div", { style: style }, props.children);
}
//# sourceMappingURL=DeprecatedFrame.js.map