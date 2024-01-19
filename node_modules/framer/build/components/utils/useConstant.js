import { useRef } from "react";
// Only init the constant once
export function useConstant(init) {
    const ref = useRef(null);
    if (ref.current === null) {
        ref.current = init();
    }
    return ref.current;
}
//# sourceMappingURL=useConstant.js.map