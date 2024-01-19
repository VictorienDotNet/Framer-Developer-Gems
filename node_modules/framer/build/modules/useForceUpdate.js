import React from "react";
/**
 * @public
 */
export function useForceUpdate() {
    const [_, setForcedRenderCount] = React.useState(0);
    return React.useCallback(() => setForcedRenderCount(v => v + 1), []);
}
//# sourceMappingURL=useForceUpdate.js.map