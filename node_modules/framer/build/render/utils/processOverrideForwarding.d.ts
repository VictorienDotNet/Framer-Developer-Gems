import React from "react";
/**
 * Modifies children to forward overrides of design components to their childern.
 * _overrideForwardingDescription is created by FrameNode and contains all the values of forwarded overrides
 * They are extracted here and passed into _forwardedOverrides of the children, or added to an already existing _forwardedOverrides prop
 */
interface ProcessOverrideForwardingReturnType {
    props: any;
    children: React.ReactNode | undefined;
}
export declare function processOverrideForwarding(props: any, children?: React.ReactNode): ProcessOverrideForwardingReturnType;
export {};
//# sourceMappingURL=processOverrideForwarding.d.ts.map