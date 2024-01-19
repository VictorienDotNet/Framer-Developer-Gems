import { useDomEvent } from "framer-motion";
import { useCallback, useRef } from "react";
import { debounce } from "../../render/utils/debounce.js";
import { clamp } from "../../utils/math.js";
export function useWheelScroll(ref, { enabled, initial, prev, direction, constraints, offsetX, offsetY, onScrollStart, onScroll, onScrollEnd, }) {
    const isWheelScrollActive = useRef(false);
    const getPointData = useCallback(() => {
        const point = getPoint(offsetX, offsetY);
        const data = {
            point,
            velocity: { x: offsetX.getVelocity(), y: offsetY.getVelocity() },
            offset: { x: point.x - initial.x, y: point.y - initial.y },
            delta: { x: point.x - prev.x, y: point.y - prev.y },
        };
        prev.x = point.x;
        prev.y = point.y;
        return data;
    }, []);
    let handler;
    if (enabled) {
        function clampX(v) {
            return constraints.current === null ? v : clamp(v, constraints.current.left, constraints.current.right);
        }
        function clampY(v) {
            return constraints.current === null ? v : clamp(v, constraints.current.top, constraints.current.bottom);
        }
        function updateX(delta) {
            offsetX.stop();
            offsetX.set(clampX(offsetX.get() - delta));
        }
        function updateY(delta) {
            offsetY.stop();
            offsetY.set(clampY(offsetY.get() - delta));
        }
        const debouncedOnScrollEnd = debounce(() => {
            onScrollEnd && onScrollEnd(getPointData());
            isWheelScrollActive.current = false;
        }, 200);
        handler = (e) => {
            e.preventDefault();
            if (!isWheelScrollActive.current) {
                const x = offsetX.get();
                const y = offsetY.get();
                initial.x = x;
                initial.y = y;
                prev.x = x;
                prev.y = y;
                onScrollStart && onScrollStart(getPointData());
                isWheelScrollActive.current = true;
            }
            switch (direction) {
                case "horizontal":
                    updateX(e.deltaX);
                    break;
                case "vertical":
                    updateY(e.deltaY);
                    break;
                default:
                    updateX(e.deltaX);
                    updateY(e.deltaY);
            }
            onScroll && onScroll(getPointData());
            debouncedOnScrollEnd();
        };
    }
    // Appending event directly to DOM as React doesn't have an API for non-passive wheel events.
    useDomEvent(ref, "wheel", handler, { passive: false });
}
function getPoint(x, y) {
    return { x: x.get(), y: y.get() };
}
//# sourceMappingURL=useWheelScroll.js.map