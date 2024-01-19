import type { Size } from "../types/Size.js";
/**
 * @public
 */
export interface WithFractionOfFreeSpace {
    /**
     * All free space in the parent, in px.
     * @internal
     */
    freeSpaceInParent: Size;
    /**
     * The sum of all "fr" values in siblings wishing to consume free space. Each free space consuming child must divide its own "fr" value by this value.
     * @internal
     */
    freeSpaceUnitDivisor: Size;
}
//# sourceMappingURL=FreeSpace.d.ts.map