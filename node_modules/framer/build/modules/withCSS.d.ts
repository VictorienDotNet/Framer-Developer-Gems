import React from "react";
export declare const styleTagSSRMarker: {
    "data-framer-css-ssr": boolean;
};
/**
 * Render a React component with css that will be injected into the document's
 * head when the component is first rendered. The escapedCSS argument can either
 * be a string where each line is a css rule, or an array of css rule strings.
 *
 * @public
 */
export declare const withCSS: <T extends object>(Component: React.ComponentType<T>, escapedCSS: string | string[], componentSerializationId?: string) => React.ForwardRefExoticComponent<React.PropsWithoutRef<T> & React.RefAttributes<unknown>>;
//# sourceMappingURL=withCSS.d.ts.map