/// <reference types="google.fonts" />
import type { ComponentType } from "react";
import type { ComponentLoader } from "../render/componentLoader/index.js";
import type { FontshareFont } from "../render/fonts/FontshareSource.js";
import type { Action, ActionControls } from "../render/types/Action.js";
import type { BackgroundImage } from "../render/types/BackgroundImage.js";
import type { Size } from "../render/types/Size.js";
/**
 * @internal
 */
export type AssetSize = "auto" | "small" | "medium" | "large" | "full";
/**
 * @internal
 * This type is duplicated in AssetResolver.ts:
 * https://github.com/framer/FramerStudio/blob/f7a636cc5b461e06b87b768bdf2c7b353b4f6bde/src/app/assets/src/types/AssetResolver.ts#L8
 */
export interface AssetContext {
    preferredSize?: AssetSize;
    pixelSize?: number;
    isFramerResourceURL?: boolean;
    isExport?: boolean;
}
/**
 * @internal
 */
export type AssetResolver = (identifier: string | undefined, context: AssetContext) => string | undefined;
/**
 * The Runtime lives in ./Source/Runtime and implements Vekter-specific
 * functionality. Because the implementation of this functionality might change,
 * we don't want to make it part of Framer Library. Some functions, however, are
 * exposed to the user as exports from `"framer"`.
 *
 * This file provides a way for the runtime to inject the functionality into
 * Framer Library. This should make it easier to keep Vekter compatible with
 * multiple Framer Library versions.
 */
/**
 * This interface contains the functions injected by the runtime. Adding a new
 * function to this interface is fine. but:
 *
 * BE CAREFUL UPDATING THE TYPES OF EXISTING FUNCTIONS
 *
 * Because these types are only checked at compile time, they only can provide a
 * guarantee that old versions of the Library will keep working if they don't
 * change. If you do need to change existing types, the runtime needs to make
 * sure it provides backwards compatibility for old versions of Framer Library.
 * @internal
 */
export interface Runtime {
    RenderPlaceholder: ComponentType<{
        error: {
            error: unknown;
            file?: string;
        };
    }>;
    addActionControls<Options extends {
        [key: string]: any;
    }>(action: Action<Options>, title: string, controls: ActionControls<Options>): void;
    assetResolver: AssetResolver;
    componentLoader: ComponentLoader;
    queueMeasureRequest(id: string, element: Element, children: Element[]): void;
    fetchGoogleFontsList(): Promise<google.fonts.WebfontFamily[]>;
    fetchFontshareFontsList(): Promise<FontshareFont[]>;
    useImageElement(image: BackgroundImage, containerSize?: Size, nodeId?: string): HTMLImageElement;
    useImageSource(image: BackgroundImage, containerSize?: Size, nodeId?: string): string;
}
/**
 * This proxy makes sure that any key on the runtime object will return a
 * function that logs a warning to the console. Functions for which a
 * implementation is provided are available through this object, e.g.
 * `runtime.addActionControls()`
 * @internal
 */
export declare const runtime: Runtime;
/**
 * This function is used by the `initializeRuntime()` function of the runtime to
 * provide the implementation of the functions defined in the `Runtime`
 * interface.
 * @internal
 */
export declare function _injectRuntime(injectedRuntime: Partial<Runtime>): void;
//# sourceMappingURL=runtimeInjection.d.ts.map