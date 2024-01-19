import type { AnimationInterface } from "../../animation/Drivers/AnimationDriver.js";
import type { FramerEvent } from "../../events/FramerEvent.js";
import type { ConstraintPercentage } from "../../render/types/Constraints.js";
import type { Point } from "../../render/types/Point.js";
import type { WithMouseWheelHandler, WithPanHandlers } from "./WithEvents.js";
import React from "react";
import { Animatable } from "../../animation/Animatable/Animatable.js";
import { InertialScrollAnimator } from "../../animation/Animators/InertialScrollAnimator.js";
import { MainLoopAnimationDriver } from "../../animation/Drivers/MainLoopDriver.js";
import { Rect } from "../../render/types/Rect.js";
export declare const DraggingContext: React.Context<{
    dragging: boolean;
}>;
/**
 * @internal
 */
export type Axis = "x" | "y";
export type Handler = () => void;
export type DragHandler<Draggable> = (draggable: Draggable) => void;
export type DragEventHandler<Draggable> = (event: FramerEvent, draggable: Draggable) => void;
/**
 * @internal
 */
export type ScrollAnimation = MainLoopAnimationDriver<InertialScrollAnimator, number, any>;
export interface DragEvents<Draggable> {
    onMove: (point: Point, draggable: Draggable) => void;
    /**
     * @internal
     */
    onDragDirectionLockStart: (axis: Axis, draggable: Draggable) => void;
    onDragAnimationStart: (animation: {
        x: AnimationInterface;
        y: AnimationInterface;
    }, draggable: Draggable) => void;
    onDragAnimationEnd: (animation: {
        x: AnimationInterface;
        y: AnimationInterface;
    }, draggable: Draggable) => void;
    onDragSessionStart: DragEventHandler<Draggable>;
    onDragSessionMove: DragEventHandler<Draggable>;
    onDragSessionEnd: DragEventHandler<Draggable>;
    onDragStart: DragEventHandler<Draggable>;
    onDragWillMove: DragEventHandler<Draggable>;
    onDragDidMove: DragEventHandler<Draggable>;
    onDragEnd: DragEventHandler<Draggable>;
}
export interface DraggableSpecificProps<Draggable> extends Partial<DragEvents<Draggable>> {
    momentum: boolean;
    momentumOptions: {
        friction: number;
        tolerance: number;
    };
    momentumVelocityMultiplier: number;
    speedX: number;
    speedY: number;
    bounce: boolean;
    bounceOptions: {
        friction: number;
        tension: number;
        tolerance: number;
    };
    directionLock: boolean;
    directionLockThreshold: {
        x: number;
        y: number;
    };
    overdrag: boolean;
    overdragScale: number;
    pixelAlign: boolean;
    velocityTimeout: number;
    velocityScale: number;
    horizontal: boolean;
    vertical: boolean;
    constraints: Partial<Rect>;
    mouseWheel: boolean;
}
export interface DraggableProps<Draggable> extends DraggableSpecificProps<Draggable> {
    enabled: boolean;
}
export interface WithDraggingComponentTypeConstraints extends WithPanHandlers, WithMouseWheelHandler {
    left: number | Animatable<number> | null;
    top: number | Animatable<number> | null;
    width: number | ConstraintPercentage | Animatable<number>;
    height: number | ConstraintPercentage | Animatable<number>;
}
export declare function WithDragging<TOriginalProps extends Partial<WithDraggingComponentTypeConstraints>>(Component: React.ComponentType<TOriginalProps & Partial<DraggableProps<any>>>): React.ComponentClass<TOriginalProps & Partial<DraggableProps<any>>>;
//# sourceMappingURL=WithDragging.d.ts.map