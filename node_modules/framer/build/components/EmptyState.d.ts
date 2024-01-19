import React from "react";
export interface Props {
    children: React.ReactNode;
    size: {
        width?: string | number;
        height?: string | number;
    };
    title?: string;
    description?: string;
    hide?: boolean;
    insideUserCodeComponent?: boolean;
    position?: React.CSSProperties["position"];
}
/** @internal */
export declare function EmptyState({ title, description, children, size, hide, insideUserCodeComponent, position, }: Props): JSX.Element | null;
export declare function Title({ children }: {
    children?: React.ReactNode;
}): JSX.Element;
//# sourceMappingURL=EmptyState.d.ts.map