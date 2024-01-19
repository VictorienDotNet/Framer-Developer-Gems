declare class WebKitPoint {
    x: number;
    y: number;
    constructor(x: number, y: number);
}
declare global {
    interface Window {
        WebKitPoint?: typeof WebKitPoint;
        webkitConvertPointFromPageToNode?(node: Node, pt: WebKitPoint): WebKitPoint;
    }
}
export interface EventLike {
    pageX: number;
    pageY: number;
    target: EventTarget | null;
}
export declare function pointForEvent(event: EventLike, customTarget?: EventTarget | null): {
    x: number;
    y: number;
};
export {};
//# sourceMappingURL=events.d.ts.map