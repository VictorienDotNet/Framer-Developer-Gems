import type { FrameProps } from "../render/presentation/Frame/FrameWithMotion.js";
import React from "react";
/** @public */
export type OverrideObject<T extends object = any> = Partial<T>;
/** @public */
export type OverrideFunction<P extends object = any> = (props: P) => Partial<P>;
/** @public */
export type Override<T extends object = FrameProps & {
    [key: string]: any;
}> = OverrideObject<T> | OverrideFunction<T>;
/**
 * @deprecated No longer used by Framer because built into preview. From version ## TODO: add correct version
 * @internal
 */
export declare function WithOverride<T extends object>(Component: React.ComponentType<T>, override: Override<T>): React.ComponentType<T>;
//# sourceMappingURL=WithOverride.d.ts.map