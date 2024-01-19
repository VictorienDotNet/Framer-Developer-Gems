/**
 * This serves as the public entrypoint for the Framer module which is published
 * to npm. Currently it contains all the API's that can be used in Smart
 * Components(SC) and Code Components (CM - Modules not legacy).
 *
 * Looking forward this public entrypoint is focused on catering to users using
 * the handshake feature, that is using SC and CM in the wild.
 *
 * NB: this entrypoint must not be used internally in the framer application.
 *
 * NOTE: if you find that a API is missing from this list please don't hesitate
 * to reach out to us!
 *
 * @module
 */
export * from "framer-motion";
export { withMeasuredSize } from "./components/hoc/withMeasuredSize.js";
export { useIsInCurrentNavigationTarget } from "./components/NavigationContainerContext.js";
export { Page } from "./components/Page/EmulatedPage.js";
export { Scroll } from "./components/Scroll/Scroll.js";
export { Stack } from "./components/Stack/Stack.js";
export { ComponentPresetsConsumer, ComponentPresetsProvider } from "./modules/ComponentPresetsContext.js";
export { cx } from "./modules/cx.js";
export { LazyValue } from "./modules/LazyValue.js";
export { Link } from "./modules/Link.js";
export { useActiveVariantCallback } from "./modules/useActiveVariantCallback.js";
export { useAddVariantProps } from "./modules/useAddVariantProps.js";
export { useDataRecord } from "./modules/useDataRecord.js";
export { useGamepad } from "./modules/useGamepad.js";
export { useHotkey } from "./modules/useHotkey.js";
export { useNavigate } from "./modules/useNavigate.js";
export { useOnAppear, useOnVariantChange } from "./modules/useOnVariantChange.js";
export { useOverlayState } from "./modules/useOverlayState.js";
export { useQueryData } from "./modules/useQueryData.js";
export { useSafariGapFix } from "./modules/useSafariGapFix.js";
export { CycleVariantState, useVariantState } from "./modules/useVariantState.js";
export { withCSS } from "./modules/withCSS.js";
export { fontStore } from "./render/fonts/fontStore.js";
export { FrameWithMotion } from "./render/presentation/Frame/FrameWithMotion.js";
export { Image } from "./render/presentation/Image.js";
export { RichText } from "./render/presentation/RichText.js";
export { SVG } from "./render/presentation/SVG.js";
export { Text } from "./render/presentation/Text.js";
export { Vector } from "./render/presentation/Vector.js";
export { VectorGroup } from "./render/presentation/VectorGroup.js";
export { Color } from "./render/types/Color/Color.js";
export { ControlType } from "./render/types/PropertyControls.js";
export type { ArrayControlDescription, ArrayItemControlDescription, BaseControlDescription, BooleanControlDescription, ColorControlDescription, ComponentInstanceDescription, ControlDescription, EnumControlDescription, EventHandlerControlDescription, FileControlDescription, FusedNumberControlDescription, ImageControlDescription, NumberControlDescription, ObjectControlDescription, ObjectPropertyControlDescription, PageScopeControlDescription, PropertyControls, SegmentedEnumControlDescription, StringControlDescription, TransitionControlDescription, } from "./render/types/PropertyControls.js";
export { RenderTarget } from "./render/types/RenderEnvironment.js";
export { transformTemplate } from "./render/utils/transformTemplate.js";
export { useLocale, useLocaleCode, useLocaleInfo, useLocalizationInfo, useRouteAnchor, useRouteHandler, } from "./router/index.js";
export { addFonts, getFonts } from "./utils/addFonts.js";
export { addPropertyControls, getPropertyControls } from "./utils/addPropertyControls.js";
/**
 * @public
 * @deprecated `Frame` has been deprecated. Please use `motion.div`
 */
export declare function Frame(): void;
//# sourceMappingURL=index.d.ts.map