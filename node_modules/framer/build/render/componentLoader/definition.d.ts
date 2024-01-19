import type React from "react";
import type { Override } from "../../deprecated/WithOverride.js";
import type { ActionControls } from "../types/Action.js";
import type { PropertyControls } from "../types/PropertyControls.js";
/**
 * @internal
 * TODO: delete this type when all the framer runtime logic is extracted to src/app/runtime
 */
export type ComponentIdentifier = string;
/**
 * @internal
 * TODO: delete this type when all the framer runtime logic is extracted to src/app/runtime
 */
export interface ComponentMap {
    [name: string]: ComponentDefinition;
}
/**
 * @internal
 * TODO: delete this type when all the framer runtime logic is extracted to src/app/runtime
 */
export type ErrorDefinition = ComponentDefinition<{}> & {
    error: string;
    fileDoesNotExist?: boolean;
};
/**
 * @internal
 */
export interface ComponentLoader {
    /**
     * @internal
     */
    componentsForPackage(packageIdentifier: PackageIdentifier): ComponentDefinition[];
    /**
     * @internal
     */
    componentForIdentifier(identifier: ComponentIdentifier): ComponentDefinition | null;
    /**
     * @internal
     */
    errorForIdentifier(identifier: ComponentIdentifier): ErrorDefinition | null;
    /**
     * Identifiers of the components that are in the current project
     * or in packages that are direct dependencies of the project.
     * @internal
     */
    componentIdentifiers(): ComponentIdentifier[];
    /**
     * @internal
     */
    forEachComponent(cb: (component: ComponentDefinition) => boolean | void): void;
}
/**
 * NOTE: Also defined as ComponentType in the Server project.
 * @internal
 * TODO: delete this type when all the framer runtime logic is extracted to src/app/runtime
 */
export type ComponentType = "component" | "master" | "override" | "action" | "hoc" | "screen" | "responsiveScreen" | "prototype" | "data";
/**
 * @internal
 * TODO: delete this type when all the framer runtime logic is extracted to src/app/runtime
 */
export type PackageIdentifier = string;
/**
 * @internal
 * TODO: delete this type when all the framer runtime logic is extracted to src/app/runtime
 */
export interface ComponentDefinition<P = any> {
    class: React.ComponentType<P> | JSON | Override<any>;
    /** Package depth of this component. 0 if part of project, 1 if a direct dependency, greater otherwise. */
    depth: number;
    file: string;
    identifier: ComponentIdentifier;
    name: string;
    /** Identifier of the package that contains this component (one package can contain multiple components). */
    packageIdentifier: PackageIdentifier;
    properties: PropertyControls<P> | ActionControls<P>;
    type: ComponentType;
    defaults?: P;
}
/**
 * @internal
 */
export type SandboxReactComponentDefinition<P = any> = ComponentDefinition<P> & {
    class: React.ComponentType<P>;
};
/**
 * @internal
 */
export type ReactComponentDefinition = Omit<SandboxReactComponentDefinition, "class">;
/**
 * @internal
 */
export type DesignComponentDefinition = ComponentDefinition & {
    class: Record<string, unknown>;
};
/**
 * @internal
 */
export type TokenIdentifier = string;
/**
 * @internal
 */
export interface TokenDefinition {
    __class: string;
    id: TokenIdentifier;
    name: string;
    value: string;
}
/**
 * @internal
 */
export interface TokenMap {
    [key: string]: TokenDefinition;
}
/**
 * @internal
 * @deprecated use the same function from `@framerjs/framer-runtime` instead
 */
export declare function isDesignDefinition(d: ComponentDefinition): d is DesignComponentDefinition;
/**
 * @internal
 * @deprecated use the same function from `@framerjs/framer-runtime` instead
 */
export declare function isOverride(d: ComponentDefinition): boolean;
/**
 * @internal
 * @deprecated use the same function from `@framerjs/framer-runtime` instead
 */
export declare function isReactDefinition<P = any>(d: ComponentDefinition<P>): d is SandboxReactComponentDefinition<P>;
//# sourceMappingURL=definition.d.ts.map