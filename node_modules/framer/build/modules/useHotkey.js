import React from "react";
import { useOnCurrentTargetChange } from "../components/NavigationTargetContext.js";
import { useConstant } from "../components/utils/useConstant.js";
const modifierDefaults = {
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
};
function createShortcutDefinition(shortcut) {
    const keys = shortcut.split("+");
    const key = keys.pop();
    if (!key)
        return undefined;
    const modifiers = {};
    for (const modifier of keys) {
        modifiers[`${modifier}Key`] = true;
    }
    return {
        ...modifierDefaults,
        ...modifiers,
        key,
    };
}
/** @internal */
export function useHotkey(shortcut, callback) {
    const inTarget = React.useRef(true);
    const shortcutDefinition = useConstant(() => createShortcutDefinition(shortcut));
    useOnCurrentTargetChange((isCurrentTarget, isOverlayed) => {
        inTarget.current = isCurrentTarget && !isOverlayed;
        return () => (inTarget.current = false);
    });
    const eventHandler = React.useCallback((event) => {
        if (!shortcutDefinition)
            return;
        if (!inTarget.current)
            return;
        if (!Object.keys(shortcutDefinition).every(key => shortcutDefinition[key] === event[key]))
            return;
        event.preventDefault();
        callback();
    }, [shortcutDefinition, callback]);
    React.useEffect(() => {
        document.addEventListener("keydown", eventHandler);
        return () => document.removeEventListener("keydown", eventHandler);
    }, [eventHandler]);
}
//# sourceMappingURL=useHotkey.js.map