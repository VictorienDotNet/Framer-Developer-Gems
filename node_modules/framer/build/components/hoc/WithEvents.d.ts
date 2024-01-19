import React from "react";
import { FramerEvent } from "../../events/FramerEvent.js";
export type EventHandler = (event: FramerEvent) => void;
export interface WithPanHandlers {
    onPanStart: EventHandler;
    onPan: EventHandler;
    onPanEnd: EventHandler;
}
export interface WithTapHandlers {
    onTapStart: EventHandler;
    onTap: EventHandler;
    onTapEnd: EventHandler;
}
export interface WithMouseHandlers {
    onMouseDown: EventHandler;
    onClick: EventHandler;
    onMouseUp: EventHandler;
    onMouseEnter: EventHandler;
    onMouseLeave: EventHandler;
}
export interface WithMouseWheelHandler {
    onMouseWheelStart: EventHandler;
    onMouseWheel: EventHandler;
    onMouseWheelEnd: EventHandler;
}
export interface WithEventsProperties extends WithPanHandlers, WithTapHandlers, WithMouseHandlers, WithMouseWheelHandler {
}
export interface WithElement {
    element: HTMLElement | null;
}
export interface MayHaveStyle {
    style?: React.CSSProperties;
}
export declare function WithEvents<T, BaseProps extends React.ClassAttributes<T> & Partial<WithEventsProperties> & MayHaveStyle>(BaseComponent: React.ComponentType<BaseProps>): React.ComponentClass<BaseProps & Partial<WithEventsProperties>>;
//# sourceMappingURL=WithEvents.d.ts.map