import { ObservableObject } from "./ObservableObject.js";
/**
 * @internal
 */
const data = /* @__PURE__ */ (() => {
    /**
     * Allows data to be shared between Frames using Code Overrides.
     * Any changes to the `Data` instance will cause the preview to update and code
     * overrides will re-render. In this example, we’re updating the `scale` property on `press`, setting it to `0.5`.
     * ```jsx
     * import { Data, Override } from "framer"
     *
     * const data = Data({
     *    scale: 0.5,
     * })
     *
     * export function WhileTap(): Override {
     *    return {
     *        whileTap: {
     *            scale: data.scale,
     *        },
     *    }
     * }
     *
     * ```
     * @param initial - The initial value of the data to be set.
     * @returns the data object for use across components.
     * @public
     */
    function Data(initial = {}) {
        // Because of the second boolean is set to false we already know that everything will have the same type as the input
        const _data = ObservableObject(initial, false, false);
        Data.addData(_data);
        return _data;
    }
    /**
     * @internal
     */
    Data._stores = [];
    /** @internal */
    Data.addData = (_data) => {
        Data._stores.push(_data);
    };
    /** @internal */
    Data.reset = () => {
        Data._stores.forEach(target => ObservableObject.resetObject(target));
    };
    /** @internal */
    Data.addObserver = (target, observer) => {
        return ObservableObject.addObserver(target, observer);
    };
    return Data;
})();
export const Data = data;
//# sourceMappingURL=Data.js.map