import { safeWindow } from "../utils/safeWindow.js";
export function pointForEvent(event, customTarget = null) {
    let target;
    if (customTarget instanceof HTMLElement) {
        target = customTarget;
    }
    if (!target && event.target instanceof HTMLElement) {
        target = event.target;
    }
    if (!target) {
        return { x: event.pageX, y: event.pageY };
    }
    // Safari
    if ("webkitConvertPointFromPageToNode" in safeWindow) {
        let webkitPoint = new safeWindow.WebKitPoint(event.pageX, event.pageY);
        webkitPoint = safeWindow.webkitConvertPointFromPageToNode(target, webkitPoint);
        return { x: webkitPoint.x, y: webkitPoint.y };
    }
    // const t1 = performance.now()
    // All other browsers
    // TODO: This does not work with rotate yet
    // TODO: This doens't work with Chrome if the target is the Body tag.
    const rect = target.getBoundingClientRect();
    const width = parseFloat(target.style.width);
    const height = parseFloat(target.style.height);
    const scale = {
        x: width ? width / rect.width : 1,
        y: height ? height / rect.height : 1,
    };
    const point = {
        x: scale.x * (event.pageX - rect.left - target.clientLeft + target.scrollLeft),
        y: scale.y * (event.pageY - rect.top - target.clientTop + target.scrollTop),
    };
    return point;
}
//# sourceMappingURL=events.js.map