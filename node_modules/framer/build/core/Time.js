import { safeWindow } from "../utils/safeWindow.js";
// const performance = safeWindow.performance || {
//   offset: Date.now(),
//   now: () => Date.now() - this.offset
// };
const _raf = (f) => {
    setTimeout(f, 1 / 60);
};
const __raf = safeWindow["requestAnimationFrame"] || _raf;
export const raf = (f) => __raf(f);
//# sourceMappingURL=Time.js.map