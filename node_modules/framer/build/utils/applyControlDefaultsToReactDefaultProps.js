import { ControlType, } from "../render/types/PropertyControls.js";
import { isArray, isBoolean, isFunction, isNumber, isObject, isString, isUndefined } from "./utils.js";
function isReactComponent(component) {
    // Before we were using `instanceof React.Component` instead of `isObject` but unfortunately
    // that check isn't compatible with `React.forwardRef`.
    return isObject(component) || isFunction(component);
}
const optionalKey = "optional";
function controlIsOptional(control) {
    return !!control && optionalKey in control && control[optionalKey] === true;
}
function shouldBeNever(_) { }
function getControlDefaultValue(control) {
    try {
        switch (control.type) {
            case ControlType.String:
            case ControlType.Color:
            case ControlType.Date:
            case ControlType.Link:
                return isString(control.defaultValue) ? control.defaultValue : undefined;
            case ControlType.Boolean:
                return isBoolean(control.defaultValue) ? control.defaultValue : undefined;
            case ControlType.Enum:
                if (isUndefined(control.defaultValue))
                    return undefined;
                return control.options.includes(control.defaultValue) ? control.defaultValue : undefined;
            case ControlType.FusedNumber:
            case ControlType.Number:
                return isNumber(control.defaultValue) ? control.defaultValue : undefined;
            case ControlType.Transition:
                return isObject(control.defaultValue) ? control.defaultValue : undefined;
            case ControlType.Font:
                return isObject(control.defaultValue) ? control.defaultValue : undefined;
            case ControlType.Object: {
                const value = isObject(control.defaultValue) ? control.defaultValue : {};
                if (isObject(control.controls)) {
                    applyControlDefaultsToDefaultProps(value, control.controls);
                }
                return value;
            }
            case ControlType.Array:
                return isArray(control.defaultValue) ? control.defaultValue : undefined;
            case ControlType.File:
            case ControlType.Image:
            case ControlType.RichText:
            case ControlType.PageScope:
            case ControlType.EventHandler:
            case ControlType.SegmentedEnum:
            case ControlType.ResponsiveImage:
            case ControlType.ComponentInstance:
                return undefined; // No default
            default:
                // We are not asserting because we never want this to crash. It's run while a user is coding.
                shouldBeNever(control);
                return undefined;
        }
    }
    catch {
        return undefined;
    }
}
function applyControlDefaultsToDefaultProps(defaultProps, controls) {
    for (const controlKey in controls) {
        const control = controls[controlKey];
        if (!control)
            continue;
        // Ignore if a value is already set
        const currentDefault = defaultProps[controlKey];
        if (!isUndefined(currentDefault))
            continue;
        // Ignore if the value needs to support undefined
        if (controlIsOptional(control))
            continue;
        // Get default value from control
        const defaultValue = getControlDefaultValue(control);
        if (isUndefined(defaultValue))
            continue;
        defaultProps[controlKey] = defaultValue;
    }
}
function getDefaultProps(component) {
    if (isObject(component.defaultProps)) {
        return component.defaultProps;
    }
    const defaultProps = {};
    component.defaultProps = defaultProps;
    return defaultProps;
}
export function applyControlDefaultsToReactDefaultProps(component, controls) {
    if (!isReactComponent(component))
        return;
    const defaultProps = getDefaultProps(component);
    applyControlDefaultsToDefaultProps(defaultProps, controls);
}
//# sourceMappingURL=applyControlDefaultsToReactDefaultProps.js.map