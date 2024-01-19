import type React from "react";
/**
 * Describes a single font used by a component.
 *
 * This should have enough data to construct a corresponding [FontFace] object
 * or a CSS `@font-face` rule.
 *
 * [FontFace]: https://drafts.csswg.org/css-font-loading/#fontface-interface
 *
 * @public
 */
export interface ComponentFont {
    url: string;
    family: string;
    /**
     * Provides an alternative way to determine the font's URL in local modules,
     * by resolving `moduleAsset.url` (e.g., `assets/font.otf`) against the base
     * URL of the module given by the `localModuleIdentifier`.
     *
     * This exists to solve [a very specific problem with fonts in exported
     * prototypes][1], so even if we decide to make `addFonts` public, this
     * should probably stay internal.
     *
     * [1]: https://framer-team.slack.com/archives/C01UY26JGBB/p1623924715174900
     *
     * @internal
     */
    moduleAsset?: {
        url: string;
        localModuleIdentifier?: string;
    };
    style?: string;
    weight?: string;
    stretch?: string;
    unicodeRange?: string;
}
/** @public */
export declare function addFonts(component: React.ComponentType<unknown>, fonts: ComponentFont[]): void;
/** @public */
export declare function getFonts(component: React.ComponentType<unknown>): ComponentFont[];
//# sourceMappingURL=addFonts.d.ts.map