import React, { createContext, useContext, useRef } from "react";
import { isEqual } from "../render/utils/isEqual.js";
/**
 * This context is used to pass down component presets from the RichTextNode to
 * the component embeds in rich text in the CMS.
 */
const Context = /* @__PURE__ */ createContext({});
export function ComponentPresetsProvider({ presets, children }) {
    const lastPresets = useRef(presets);
    if (!isEqual(presets, lastPresets.current, false)) {
        lastPresets.current = presets;
    }
    return React.createElement(Context.Provider, { value: lastPresets.current }, children);
}
export function ComponentPresetsConsumer({ componentIdentifier, children }) {
    const componentPresets = useContext(Context);
    const presetProps = componentPresets[componentIdentifier] ?? {};
    return children(presetProps);
}
//# sourceMappingURL=ComponentPresetsContext.js.map