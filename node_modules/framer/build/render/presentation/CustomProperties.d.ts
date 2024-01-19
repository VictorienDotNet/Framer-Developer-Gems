import React, { PureComponent } from "react";
/**
 * Takes a CSS variable and attempts to lookup the value. Useful for retrieving
 * the original value when provided with a variable for animations or manipulation.
 * @returns the value string or null if not found.
 */
type CustomPropertiesLookup = (variable: string) => string | null;
/**
 * Provides a lookup function `CustomPropertiesLookup` to consumers.
 * @internal
 */
export declare const CustomPropertiesContext: React.Context<CustomPropertiesLookup>;
/**
 * Takes a CSS properties map of custom property to value and inserts them into the DOM.
 * Also sets up a CustomPropertiesContext provider to make a lookup function available
 * to all children.
 * @internal
 *
 * @privateRemarks
 * This component was at the heart of a serious panning performance issue. Ensure any
 * refactoring never updates `value` every render.
 */
export declare class CustomProperties extends PureComponent<{
    children?: React.ReactNode;
    customProperties: {
        [property: string]: string;
    };
}> {
    lookup: (variable: string) => string | null;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=CustomProperties.d.ts.map