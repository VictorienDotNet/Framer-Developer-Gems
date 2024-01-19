import { warnOnce } from "../utils/warnOnce.js";
const mockWithWarning = (message) => {
    return () => {
        warnOnce(message);
    };
};
/** This stores the injected implementations */
const implementation = {
    // We need a default implementation for useImageSource and useImageElement as it is used for rendering image backgrounds which would break otherwise.
    // The default value is used for HTML export and when using the library without Framer.
    useImageSource(image) {
        return image.src ?? "";
    },
    useImageElement(image, rect, nodeId) {
        const element = new Image();
        element.src = runtime.useImageSource(image, rect, nodeId);
        // srcSet doesn't need resolving via useImageSource, since these are
        // currently only used in generated components, where resolution happens
        // during code-generation.
        if (image.srcSet)
            element.srcset = image.srcSet;
        return element;
    },
};
let isRuntimeInjected = false;
const runtimeProxy = {
    get(target, key, reciever) {
        if (Reflect.has(target, key)) {
            return Reflect.get(target, key, reciever);
        }
        if (isRuntimeInjected) {
            return mockWithWarning(`${String(key)} is not available in this version of Framer.`);
        }
        else {
            return mockWithWarning(`${String(key)} is only available inside of Framer. https://www.framer.com/`);
        }
    },
};
/**
 * This proxy makes sure that any key on the runtime object will return a
 * function that logs a warning to the console. Functions for which a
 * implementation is provided are available through this object, e.g.
 * `runtime.addActionControls()`
 * @internal
 */
export const runtime = new Proxy(implementation, runtimeProxy);
/**
 * This function is used by the `initializeRuntime()` function of the runtime to
 * provide the implementation of the functions defined in the `Runtime`
 * interface.
 * @internal
 */
export function _injectRuntime(injectedRuntime) {
    Object.assign(implementation, injectedRuntime);
    isRuntimeInjected = true;
}
//# sourceMappingURL=runtimeInjection.js.map