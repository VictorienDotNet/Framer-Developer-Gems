import type React from "react";
import type { PropertyControls } from "../render/types/PropertyControls.js";
type HigherOrderComponent<Props> = (Component: React.ComponentType<Props>, props?: Props) => React.ComponentType<Props>;
/**
 * Extends component with property controls
 *
 * ```typescript
 * export const MyComponent = props => <h1>{props.header}</h1>
 *
 * addPropertyControls(MyComponent, {
 *   header:  { type: ControlType.String, title: "Header" },
 * })
 *
 * ```
 * @public
 */
export declare function addPropertyControls<Props = any>(component: React.ComponentType<Props> | React.ForwardRefExoticComponent<Props> | HigherOrderComponent<Props>, propertyControls: PropertyControls<Props>): void;
/**
 * Get the property controls for a component
 * @param component - The component to retrieve the property controls for
 * @returns The property controls for the given component
 * @internal
 */
export declare function getPropertyControls<Props = any>(component: React.ComponentType<Props> | React.ForwardRefExoticComponent<Props>): PropertyControls<Props> | undefined;
export {};
//# sourceMappingURL=addPropertyControls.d.ts.map