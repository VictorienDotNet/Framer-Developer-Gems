import type React from "react";
export type ReactElementType = string | React.JSXElementConstructor<any>;
export declare function isReactElement<P, T extends ReactElementType = ReactElementType>(test: React.ReactChild): test is React.ReactElement<P, T>;
export declare function isReactChild(test: React.ReactNode): test is React.ReactChild;
//# sourceMappingURL=type-guards.d.ts.map