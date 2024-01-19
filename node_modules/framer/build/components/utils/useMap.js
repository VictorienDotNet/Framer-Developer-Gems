import { useConstant } from "./useConstant.js";
function newMap() {
    return new Map();
}
/** Returns a constant instance of a Map */
export function useMap() {
    return useConstant(newMap);
}
//# sourceMappingURL=useMap.js.map