import hoistNonReactStatic from "hoist-non-react-statics";
import React, { useContext } from "react";
import { convertColorProps } from "./convertColorProps.js";
import { DataObserverContext } from "./DataObserver.js";
/**
 * @deprecated No longer used by Framer because built into preview. From version ## TODO: add correct version
 * @internal
 */
export function WithOverride(Component, override) {
    const useOverride = typeof override === "function"
        ? (props) => override(convertColorProps(props))
        : () => convertColorProps(override);
    const ComponentWithOverride = function (props) {
        useContext(DataObserverContext);
        const overrideProps = useOverride(props);
        const { style, ...rest } = props;
        return React.createElement(Component, { ...rest, ...overrideProps, _initialStyle: style });
    };
    hoistNonReactStatic(ComponentWithOverride, Component);
    ComponentWithOverride["displayName"] = `WithOverride(${Component.displayName || Component.name})`;
    return ComponentWithOverride;
}
//# sourceMappingURL=WithOverride.js.map