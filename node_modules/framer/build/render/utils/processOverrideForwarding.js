import React from "react";
export function processOverrideForwarding(props, children) {
    if (!children) {
        children = props.children;
        if (!children)
            return { props, children };
    }
    let _forwardedOverrides = props._forwardedOverrides;
    const extractions = props._overrideForwardingDescription;
    if (extractions) {
        _forwardedOverrides = undefined;
        for (const key in extractions) {
            const propName = extractions[key];
            const value = props[propName];
            if (value !== undefined) {
                if (!_forwardedOverrides) {
                    _forwardedOverrides = {};
                    props = { ...props };
                }
                _forwardedOverrides[key] = props[propName];
                delete props[propName];
            }
        }
    }
    if (!_forwardedOverrides)
        return { props, children };
    children = React.Children.map(children, (child) => {
        if (!React.isValidElement(child))
            return child;
        return React.cloneElement(child, { _forwardedOverrides });
    });
    return { props, children };
}
//# sourceMappingURL=processOverrideForwarding.js.map