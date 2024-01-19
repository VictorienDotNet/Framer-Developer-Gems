import { runtime } from "../../utils/runtimeInjection.js";
import { RenderTarget } from "../types/RenderEnvironment.js";
// #region copied from src/app/assets/src/assetReference.ts to remove dependency on assets.
// This includes the comma that separates the media type from the data.
const mediaType = "framer/asset-reference,";
export function isAssetReference(value) {
    return value.startsWith(`data:${mediaType}`);
}
// #endregion
/**
 * @internal
 */
export function imageUrlForAsset(asset, pixelSize) {
    if (/^\w+:/.test(asset) && !isAssetReference(asset))
        return asset;
    if (typeof pixelSize !== "number")
        pixelSize = undefined;
    else if (pixelSize <= 512)
        pixelSize = 512;
    else if (pixelSize <= 1024)
        pixelSize = 1024;
    else if (pixelSize <= 2048)
        pixelSize = 2048;
    else
        pixelSize = 4096;
    const isExport = RenderTarget.current() === RenderTarget.export;
    return runtime.assetResolver(asset, { pixelSize, isExport }) ?? "";
}
//# sourceMappingURL=imageUrlForAsset.js.map