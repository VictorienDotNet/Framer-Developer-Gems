import { isFlexboxGapSupported } from "./isFlexboxGapSupported.js";
/**
 * @internal
 */
export const flexboxGapNotSupportedClass = "flexbox-gap-not-supported";
let initialized = false;
/**
 * @internal
 */
export function installFlexboxGapWorkaroundIfNeeded() {
    if (initialized)
        return;
    initialized = true;
    if (isFlexboxGapSupported())
        return;
    document.body.classList.add(flexboxGapNotSupportedClass);
}
//# sourceMappingURL=workaroundFlexboxGapNotSupported.js.map