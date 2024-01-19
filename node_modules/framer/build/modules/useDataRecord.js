import { useMemo } from "react";
import { isObject } from "../utils/utils.js";
/**
 * Returns a record from the collection which matches all the given variables.
 *
 * @internal
 * @deprecated Use useQueryData instead.
 */
export function useDataRecord(collection, variables) {
    return useMemo(() => {
        if (!Array.isArray(collection)) {
            return null;
        }
        if (!variables) {
            return null;
        }
        const pageRecord = collection.find(record => {
            return Object.entries(variables).every(([key, value]) => {
                const recordValue = record[key];
                // null, undefined, and objects never match
                if (value === undefined || recordValue === undefined || isObject(value) || isObject(recordValue)) {
                    return false;
                }
                return String(value) === String(recordValue);
            });
        });
        return pageRecord ?? null;
    }, [collection, variables]);
}
//# sourceMappingURL=useDataRecord.js.map