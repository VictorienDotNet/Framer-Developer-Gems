import { MotionValue } from "framer-motion";
import React from "react";
/** @public */
export type BorderStyle = "solid" | "dashed" | "dotted" | "double";
/** @internal */
export interface BorderProperties {
    borderWidth: number | Partial<{
        top: number;
        bottom: number;
        left: number;
        right: number;
    }>;
    borderColor: string;
    borderStyle: BorderStyle;
    border?: string | MotionValue<string>;
    layoutId?: string | undefined;
}
/** @internal */
export declare function collectBorderStyleForProps(props: Partial<BorderProperties>, style: React.CSSProperties, collapseEqualBorders?: boolean): void;
export declare function Border(props: Partial<BorderProperties>): JSX.Element | null;
//# sourceMappingURL=BorderComponent.d.ts.map