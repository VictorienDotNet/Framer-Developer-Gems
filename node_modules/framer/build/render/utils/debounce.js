import { safeWindow } from "../../utils/safeWindow.js";
/** @internal */
export function debounce(fn, time) {
    let timeout;
    const debounced = (...args) => {
        safeWindow.clearTimeout(timeout);
        timeout = safeWindow.setTimeout(fn, time, ...args);
    };
    const cancel = () => {
        safeWindow.clearTimeout(timeout);
    };
    debounced.cancel = cancel;
    return debounced;
}
//# sourceMappingURL=debounce.js.map