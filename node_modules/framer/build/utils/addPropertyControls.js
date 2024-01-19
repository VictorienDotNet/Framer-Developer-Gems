import { applyControlDefaultsToReactDefaultProps } from "./applyControlDefaultsToReactDefaultProps.js";
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
export function addPropertyControls(component, propertyControls) {
    Object.assign(component, { propertyControls });
    applyControlDefaultsToReactDefaultProps(component, propertyControls);
}
/**
 * Get the property controls for a component
 * @param component - The component to retrieve the property controls for
 * @returns The property controls for the given component
 * @internal
 */
export function getPropertyControls(component) {
    // We need to cast the component here because the function accepts any component type by design
    return component.propertyControls;
}
//# sourceMappingURL=addPropertyControls.js.map