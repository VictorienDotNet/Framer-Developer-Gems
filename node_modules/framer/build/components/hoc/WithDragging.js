import hoistNonReactStatic from "hoist-non-react-statics";
import React from "react";
import { Animatable, isAnimatable } from "../../animation/Animatable/Animatable.js";
import { InertialScrollAnimator } from "../../animation/Animators/InertialScrollAnimator.js";
import { MainLoopAnimationDriver } from "../../animation/Drivers/MainLoopDriver.js";
import { Rect } from "../../render/types/Rect.js";
import { isFiniteNumber } from "../../render/utils/isFiniteNumber.js";
import { clamp } from "../../utils/math.js";
export const DraggingContext = React.createContext({ dragging: false });
export function WithDragging(Component) {
    class WithDraggingHOC extends React.Component {
        static draggingDefaultProps = {
            momentum: true,
            momentumOptions: { friction: 2.1, tolerance: 1 },
            momentumVelocityMultiplier: 800,
            speedX: 1,
            speedY: 1,
            bounce: true,
            bounceOptions: { friction: 40, tension: 200, tolerance: 1 },
            directionLock: false,
            directionLockThreshold: { x: 10, y: 10 },
            overdrag: true,
            overdragScale: 0.5,
            pixelAlign: true,
            velocityTimeout: 100,
            velocityScale: 890,
            horizontal: true,
            vertical: true,
            enabled: true,
            constraints: {},
            mouseWheel: false,
        };
        static defaultProps = Object.assign({}, Component.defaultProps, WithDraggingHOC.draggingDefaultProps);
        state = {
            isDragging: false,
        };
        x = Animatable(0);
        y = Animatable(0);
        constructor(props, defaultProps) {
            super(props, defaultProps);
            const x = this.props.left;
            const y = this.props.top;
            if (!x) {
                // TODO: 0 should come from Component.defaultProps
                this.x = Animatable(0);
            }
            else if (isAnimatable(x)) {
                this.x = x;
            }
            else {
                this.x = Animatable(x);
            }
            if (!y) {
                // TODO: 0 should come from Component.defaultProps
                this.y = Animatable(0);
            }
            else if (isAnimatable(y)) {
                this.y = y;
            }
            else {
                this.y = Animatable(y);
            }
            this.x.onUpdate(this.onChangePosition);
            this.y.onUpdate(this.onChangePosition);
            const constraints = this.props.constraints;
            if (constraints) {
                this.constraints = constraints;
            }
        }
        UNSAFE_componentWillReceiveProps(props) {
            if (this.props.left !== props.left && isFiniteNumber(props.left)) {
                this.x.set(props.left);
            }
            if (this.props.top !== props.top && isFiniteNumber(props.top)) {
                this.y.set(props.top);
            }
            const constraints = props.constraints;
            if (constraints) {
                this.constraints = constraints;
            }
        }
        onChangePosition = (change, transaction) => {
            if (change.value === change.oldValue) {
                return;
            }
            if (this.props.onMove) {
                this.props.onMove(this.point, this);
            }
        };
        get point() {
            return { x: this.x.get(), y: this.y.get() };
        }
        setPoint(point, axis = null) {
            switch (axis) {
                case "x":
                    this.x.set(point.x);
                    break;
                case "y":
                    this.y.set(point.y);
                    break;
                case null:
                    this.x.set(point.x);
                    this.y.set(point.y);
                    break;
            }
        }
        getValue(axis) {
            switch (axis) {
                case "x":
                    return this.x.get();
                case "y":
                    return this.y.get();
            }
        }
        get width() {
            const width = this.props.width;
            if (!width) {
                // TODO this should come from the Dragged props' defaults
                return 100;
            }
            if (isAnimatable(width)) {
                return width.get();
            }
            if (typeof width === "string") {
                return parseFloat(width);
            }
            return width;
        }
        get height() {
            const height = this.props.height;
            if (!height) {
                // TODO this should come from the Dragged props' defaults
                return 100;
            }
            if (isAnimatable(height)) {
                return height.get();
            }
            if (typeof height === "string") {
                return parseFloat(height);
            }
            return height;
        }
        isMoving = false;
        isAnimating = false;
        directionLockAxis = null;
        layerStartPoint;
        correctedLayerStartPoint;
        previousPoint;
        _constraints = null;
        animation;
        get constraints() {
            return this._constraints;
        }
        set constraints(value) {
            if (value !== null && typeof value === "object") {
                this._constraints = {
                    x: value.x || 0,
                    y: value.y || 0,
                    width: value.width || 0,
                    height: value.height || 0,
                };
            }
            else {
                this._constraints = null;
            }
            if (this._constraints) {
                this.updateAnimationConstraints(this._constraints);
            }
        }
        get constraintsOffset() {
            if (!this.constraints) {
                return { x: 0, y: 0 };
            }
            const { minX, minY, maxX, maxY } = this.calculateConstraints(this._constraints);
            const point = this.point;
            const constrainedPoint = { x: clamp(point.x, minX, maxX), y: clamp(point.y, minY, maxY) };
            const offset = { x: point.x - constrainedPoint.x, y: point.y - constrainedPoint.y };
            return offset;
        }
        get isBeyondConstraints() {
            const constraintsOffset = this.constraintsOffset;
            if (constraintsOffset.x !== 0) {
                return true;
            }
            if (constraintsOffset.y !== 0) {
                return true;
            }
            return false;
        }
        panStart = (event) => {
            if (!this.props.enabled) {
                return;
            }
            // LayerDraggable._globalDidDrag = false
            // Only reset isMoving if this was not animating when we were clicking
            // so we can use it to detect a click versus a drag.
            this.isMoving = this.isAnimating;
            // Stop any animations influencing the position, but no others.
            // this.layer.animations().forEach(animation => {
            //     props = animation.props
            //     if (props.hasOwnProperty("x") || props.hasOwnProperty("y")) {
            //         return animation.stop()
            //     }
            // })
            this.stopAnimation();
            this.resetdirectionLock();
            // Store original layer position
            this.layerStartPoint = this.point;
            this.correctedLayerStartPoint = this.point;
            // // If we are beyond bounds, we need to correct for the scaled clamping from the last drag,
            // // hence the 1 / overdragScale
            if (this._constraints && this.props.bounce) {
                this.correctedLayerStartPoint = this.constrainPosition(this.correctedLayerStartPoint, this._constraints, 1 / this.props.overdragScale);
            }
            this.previousPoint = this.correctedLayerStartPoint;
            if (!this.state.isDragging) {
                this.setState({ isDragging: true });
            }
            if (this.props.onDragSessionStart) {
                this.props.onDragSessionStart(event, this);
            }
        };
        pan = (event) => {
            const { enabled, speedX, speedY, directionLock, overdragScale, vertical, horizontal, pixelAlign, onDragStart, onDragWillMove, onDragDidMove, onDragSessionMove, } = this.props;
            if (!enabled) {
                return;
            }
            let point = { ...this.previousPoint };
            point.x += event.delta.x * speedX;
            point.y += event.delta.y * speedY;
            // Save the point for the next update so we have the unrounded, unconstrained value
            this.previousPoint = { ...point };
            // // Constraints and overdrag
            if (this._constraints) {
                point = this.constrainPosition(point, this._constraints, overdragScale);
            }
            // // Direction lock
            if (directionLock) {
                if (this.directionLockAxis === null) {
                    const offset = event.offset;
                    offset.x = offset.x * speedX;
                    offset.y = offset.y * speedY;
                    this.updatedirectionLock(offset);
                    return;
                }
                else {
                    if (this.directionLockAxis === "y") {
                        point.x = this.layerStartPoint.x;
                    }
                    if (this.directionLockAxis === "x") {
                        point.y = this.layerStartPoint.y;
                    }
                }
            }
            // Update the dragging status
            if (!this.state.isDragging) {
                this.setState({ isDragging: true });
                this.isMoving = true;
                if (onDragStart) {
                    onDragStart(event, this);
                }
            }
            if (onDragWillMove) {
                onDragWillMove(event, this);
            }
            // // Align every drag to pixels
            if (pixelAlign) {
                point.x = Math.round(point.x);
                point.y = Math.round(point.y);
            }
            if (!horizontal && !vertical) {
                // Don't move over any axis
                return;
            }
            let axis = null;
            if (horizontal && !vertical) {
                axis = "x";
            }
            else if (vertical && !horizontal) {
                axis = "y";
            }
            this.setPoint(point, axis);
            if (onDragDidMove) {
                onDragDidMove(event, this);
            }
            if (onDragSessionMove) {
                onDragSessionMove(event, this);
            }
        };
        panEnd = (event) => {
            if (!this.props.enabled) {
                return;
            }
            // LayerDraggable._globalDidDrag = false
            // Start the simulation prior to emitting the DragEnd event.
            // This way, if the user calls layer.animate on DragEnd, the simulation will
            // be canceled by the user's animation (if the user animates x and/or y).
            this.startAnimation(event);
            const { onDragSessionEnd, onDragEnd } = this.props;
            if (this.state.isDragging) {
                if (onDragEnd) {
                    onDragEnd(event, this);
                }
            }
            if (onDragSessionEnd) {
                onDragSessionEnd(event, this);
            }
            // Set isDragging after DragEnd is fired, so that calls to calculateVelocity()
            // still returns dragging velocity - both in case the user calls calculateVelocity(),
            // (which would return a stale value before the simulation had finished one tick)
            // and because @_start currently calls calculateVelocity().
            if (this.state.isDragging) {
                this.setState({ isDragging: false });
            }
            // reset isMoving if not animating, otherwise animation start/stop will reset it
            this.isMoving = this.isAnimating;
        };
        // Mouse Wheel
        mouseWheelStart = (event) => {
            this.correctedLayerStartPoint = this.point;
            this.previousPoint = this.correctedLayerStartPoint;
            this.stopAnimation();
        };
        mouseWheel = (event) => {
            const { enabled, speedX, speedY, vertical, horizontal, pixelAlign, onDragWillMove, onDragDidMove, mouseWheel, } = this.props;
            if (!mouseWheel || !enabled) {
                return;
            }
            let point = { ...this.point };
            point.x -= event.delta.x * speedX;
            point.y -= event.delta.y * speedY;
            // // Constraints and overdrag
            if (this._constraints) {
                point = this.constrainPosition(point, this._constraints, 0, false);
            }
            if (onDragWillMove) {
                onDragWillMove(event, this);
            }
            // // Align every drag to pixels
            if (pixelAlign) {
                point.x = Math.round(point.x);
                point.y = Math.round(point.y);
            }
            if (!horizontal && !vertical) {
                // Don't move over any axis
                return;
            }
            let axis = null;
            if (horizontal && !vertical) {
                axis = "x";
            }
            else if (vertical && !horizontal) {
                axis = "y";
            }
            this.setPoint(point, axis);
            if (onDragDidMove) {
                onDragDidMove(event, this);
            }
        };
        mouseWheelEnd = (event) => { };
        clampAndScale(value, min, max, scale, scaleAllowed) {
            if (!scaleAllowed) {
                return clamp(value, min, max);
            }
            if (value < min) {
                value = min + (value - min) * scale;
            }
            if (value > max) {
                value = max + (value - max) * scale;
            }
            return value;
        }
        calculateConstraints(bounds) {
            if (!bounds) {
                return { minX: Infinity, maxX: Infinity, minY: Infinity, maxY: Infinity };
            }
            // Correct the constraints if the layer size exceeds the constraints
            if (bounds.width < this.width) {
                bounds.width = this.width;
            }
            if (bounds.height < this.height) {
                bounds.height = this.height;
            }
            const constraints = {
                minX: Rect.minX(bounds),
                maxX: Rect.maxX(bounds),
                minY: Rect.minY(bounds),
                maxY: Rect.maxY(bounds),
            };
            // It makes sense to take the dimensions of the object into account
            constraints.maxX -= this.width;
            constraints.maxY -= this.height;
            return constraints;
        }
        constrainPosition(proposedPoint, bounds, scale, overdrag = this.props.overdrag) {
            const { maxX, maxY, minX, minY } = this.calculateConstraints(this._constraints);
            const point = {
                x: this.clampAndScale(proposedPoint.x, minX, maxX, scale, overdrag),
                y: this.clampAndScale(proposedPoint.y, minY, maxY, scale, overdrag),
            };
            if (this.props.speedX === 0 || this.props.horizontal === false) {
                point.x = proposedPoint.x;
            }
            if (this.props.speedY === 0 || this.props.vertical === false) {
                point.y = proposedPoint.y;
            }
            return point;
        }
        /* private */ updatedirectionLock(correctedDelta) {
            if (Math.abs(correctedDelta.y) > this.props.directionLockThreshold.y) {
                this.directionLockAxis = "y";
            }
            else if (Math.abs(correctedDelta.x) > this.props.directionLockThreshold.x) {
                this.directionLockAxis = "x";
            }
            if (this.directionLockAxis !== null) {
                if (this.props.onDragDirectionLockStart) {
                    this.props.onDragDirectionLockStart(this.directionLockAxis, this);
                }
            }
        }
        resetdirectionLock() {
            this.directionLockAxis = null;
        }
        // Inertial scroll animation
        setupAnimation() {
            if (this.animation) {
                return;
            }
            this.animation = { x: this.setupAnimationForAxis("x"), y: this.setupAnimationForAxis("y") };
            this.updateAnimationConstraints(this._constraints);
        }
        setupAnimationForAxis(axis) {
            const properties = {};
            properties[axis] = true;
            const animator = new InertialScrollAnimator({
                momentum: this.props.momentumOptions,
                bounce: this.props.bounceOptions,
            });
            const updateCallback = (value) => {
                this.onAnimationStep(axis, value);
            };
            const doneCallback = () => {
                this.onAnimationStop(axis);
            };
            return new MainLoopAnimationDriver(animator, updateCallback, doneCallback);
        }
        updateAnimationConstraints(constraints) {
            // This is where we let the animators know about our constraints
            if (!this.animation) {
                return;
            }
            if (constraints) {
                const { minX, minY, maxX, maxY } = this.calculateConstraints(constraints);
                this.animation.x.animator.setLimits(minX, maxX);
                this.animation.y.animator.setLimits(minY, maxY);
            }
            else {
                this.animation.x.animator.setLimits(-Infinity, +Infinity);
                this.animation.y.animator.setLimits(-Infinity, +Infinity);
            }
        }
        onAnimationStep = (axis, value) => {
            if (axis === "x" && this.props.horizontal === false) {
                return;
            }
            if (axis === "y" && this.props.vertical === false) {
                return;
            }
            let delta = 0;
            if (this.constraints) {
                if (this.props.bounce) {
                    delta = value - this.getValue(axis);
                }
                else {
                    const { minX, minY, maxX, maxY } = this.calculateConstraints(this._constraints);
                    if (axis === "x") {
                        delta = clamp(value, minX, maxX) - this.getValue(axis);
                    }
                    if (axis === "y") {
                        delta = clamp(value, minY, maxY) - this.getValue(axis);
                    }
                }
            }
            else {
                delta = value - this.getValue(axis);
            }
            const updatePoint = this.point;
            if (axis === "x") {
                updatePoint[axis] = updatePoint[axis] + delta;
            }
            if (axis === "y") {
                updatePoint[axis] = updatePoint[axis] + delta;
            }
            this.setPoint(updatePoint, axis);
        };
        onAnimationStop = (axis) => {
            if (axis === "x" && this.props.horizontal === false) {
                return;
            }
            if (axis === "y" && this.props.vertical === false) {
                return;
            }
            if (!this.animation) {
                return;
            }
            // Round the end position to whole pixels
            if (this.props.pixelAlign) {
                const point = this.point;
                point.x = Math.round(point.x);
                point.y = Math.round(point.y);
                this.setPoint(point, axis);
            }
            // See if both animators are stopped
            if (this.animation.x.isFinished() && this.animation.y.isFinished()) {
                return this.stopAnimation();
            }
        };
        startAnimation(event) {
            // The types of animation that we can have are:
            // 1) Momentum inside constraints
            // 2) Momentum inside constraints to outside constraints bounce
            // 3) Release outside constraints bounce
            // 4) Momentum without constraints
            const { momentum, bounce, momentumVelocityMultiplier, speedX, speedY, overdrag, onDragAnimationStart } = this.props;
            if (!(momentum || bounce)) {
                return;
            }
            if (this.isBeyondConstraints === false && momentum === false) {
                return;
            }
            if (this.isBeyondConstraints === false && this.state.isDragging === false) {
                return;
            }
            // If overdrag is disabled, we need to not have a bounce animation
            // when the cursor is outside of the dragging bounds for an axis.
            const { minX, minY, maxX, maxY } = this.calculateConstraints(this._constraints);
            const startAnimationX = overdrag === true || (this.point.x > minX && this.point.x < maxX);
            const startAnimationY = overdrag === true || (this.point.y > minY && this.point.y < maxY);
            if (startAnimationX === startAnimationY && startAnimationY === false) {
                return;
            }
            const velocity = event.velocity(0.1);
            let velocityX = velocity.x * momentumVelocityMultiplier * speedX;
            let velocityY = velocity.y * momentumVelocityMultiplier * speedY;
            if (this.directionLockAxis === "x") {
                velocityY = 0;
            }
            if (this.directionLockAxis === "y") {
                velocityX = 0;
            }
            this.setupAnimation();
            this.isAnimating = true;
            this.isMoving = true;
            if (!this.animation) {
                return;
            }
            this.animation.x.animator.setState({ x: this.point.x, v: velocityX });
            if (startAnimationX) {
                this.animation.x.play();
            }
            this.animation.y.animator.setState({ x: this.point.y, v: velocityY });
            if (startAnimationY) {
                this.animation.y.play();
            }
            if (onDragAnimationStart) {
                onDragAnimationStart(this.animation, this);
            }
        }
        stopAnimation = () => {
            this.isAnimating = false;
            this.isMoving = false;
            if (!this.animation) {
                return;
            }
            this.animation.x.cancel();
            this.animation.y.cancel();
            if (this.props.onDragAnimationEnd) {
                this.props.onDragAnimationEnd(this.animation, this);
            }
            this.animation = null;
        };
        wrapHandler(ownHandler, originalHandler) {
            if (!originalHandler) {
                return ownHandler;
            }
            return (event) => {
                ownHandler(event);
                originalHandler(event);
            };
        }
        render() {
            const { onPanStart, onPan, onPanEnd, onMouseWheelStart, onMouseWheel, onMouseWheelEnd, ...attributes } = this.props;
            const originalProps = { ...attributes };
            Object.keys(WithDraggingHOC.draggingDefaultProps).forEach(key => {
                delete originalProps[key];
            });
            originalProps.onPanStart = this.wrapHandler(this.panStart, onPanStart);
            originalProps.onPan = this.wrapHandler(this.pan, onPan);
            originalProps.onPanEnd = this.wrapHandler(this.panEnd, onPanEnd);
            originalProps.onMouseWheelStart = this.wrapHandler(this.mouseWheelStart, onMouseWheelStart);
            originalProps.onMouseWheel = this.wrapHandler(this.mouseWheel, onMouseWheel);
            originalProps.onMouseWheelEnd = this.wrapHandler(this.mouseWheelEnd, onMouseWheelEnd);
            originalProps.left = this.x;
            originalProps.top = this.y;
            return (React.createElement(DraggingContext.Provider, { value: { dragging: this.state.isDragging } },
                React.createElement(Component, { ...originalProps })));
        }
    }
    const withDragging = WithDraggingHOC;
    hoistNonReactStatic(withDragging, Component);
    // We are casting it here, because Typescript 3.7 gave us a bunch of trouble
    // when trying to make the component props actually have this type. Therefor
    // the type of the props of the component are without TOriginalProps, and we
    // cast it here to include it.
    return withDragging;
}
//# sourceMappingURL=WithDragging.js.map