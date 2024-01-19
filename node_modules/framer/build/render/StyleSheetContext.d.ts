import React from "react";
/** @internal */
export interface StylesheetContextValue {
    readonly sheet: CSSStyleSheet;
    readonly cache: Set<string>;
}
/** @internal */
export declare const StyleSheetContext: React.Context<StylesheetContextValue | undefined>;
//# sourceMappingURL=StyleSheetContext.d.ts.map