import { isFiniteNumber } from "../../render/utils/isFiniteNumber.js";
import { isMotionValue } from "../../render/utils/isMotionValue.js";
import { useIsomorphicLayoutEffect } from "../../useIsomorphicLayoutEffect.js";
export function useUpdateScrollOffset(ref, side, offset, cancelEmulatedTouchScrollAnimation) {
    useIsomorphicLayoutEffect(() => {
        if (isMotionValue(offset)) {
            const updateScrollLeft = () => {
                cancelEmulatedTouchScrollAnimation?.();
                const element = ref.current;
                if (element)
                    element[side] = Math.abs(offset.get());
            };
            updateScrollLeft();
            return offset.on("change", updateScrollLeft);
        }
        else if (isFiniteNumber(offset)) {
            const element = ref.current;
            if (!element)
                return;
            cancelEmulatedTouchScrollAnimation?.();
            element[side] = Math.abs(offset);
        }
    }, 
    // We only want to update on contentOffset changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [offset]);
}
//# sourceMappingURL=useUpdateScrollOffset.js.map