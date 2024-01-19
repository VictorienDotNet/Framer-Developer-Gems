import process from "process";
import { safeWindow } from "../utils/safeWindow.js";
import { safeNavigator } from "./safeNavigator.js";
export const isBrowser = () => typeof document === "object";
export const isWebKit = () => safeNavigator?.userAgent.includes("AppleWebKit/") && !isChrome() && !isEdge();
export const webkitVersion = () => {
    let version = -1;
    const regexp = /AppleWebKit\/([\d.]+)/;
    const result = safeNavigator && regexp.exec(safeNavigator.userAgent);
    if (result && result[1]) {
        version = parseFloat(result[1]);
    }
    return version;
};
export const safariVersion = () => {
    let version = -1;
    const regexp = /Version\/([\d.]+)/;
    const result = safeNavigator && regexp.exec(safeNavigator.userAgent);
    if (result && result[1]) {
        version = parseFloat(result[1]);
    }
    return version;
};
export const isChrome = () => safeNavigator && /Chrome/.test(safeNavigator.userAgent) && /Google Inc/.test(safeNavigator.vendor) && !isEdge();
export const isSafari = () => safeNavigator && /Safari/.test(safeNavigator.userAgent) && /Apple Computer/.test(safeNavigator.vendor);
export const isFirefox = () => safeNavigator && /Firefox\/\d+\.\d+$/.test(safeNavigator.userAgent);
export const isFramerX = () => safeNavigator && /FramerX/.test(safeNavigator.userAgent);
export const isEdge = () => safeNavigator && /Edg\//.test(safeNavigator.userAgent);
export const isAndroid = () => safeNavigator && /(android)/i.test(safeNavigator.userAgent);
export const isIOS = () => safeNavigator && /(iPhone|iPod|iPad)/i.test(safeNavigator.platform);
export const isMacOS = () => safeNavigator && /Mac/.test(safeNavigator.platform);
export const isWindows = () => safeNavigator && /Win/.test(safeNavigator.platform);
export const isTouch = () => safeWindow.ontouchstart === null && safeWindow.ontouchmove === null && safeWindow.ontouchend === null;
export const isDesktop = () => deviceType() === "desktop";
export const isPhone = () => deviceType() === "phone";
export const isTablet = () => deviceType() === "tablet";
export const isMobile = () => isPhone() || isTablet();
export const isFileUrl = (url) => url.startsWith("file://");
export const isDataUrl = (url) => url.startsWith("data:");
export const isTest = () => process.env.NODE_ENV === "test";
// Prettier removes the extra parentheses, but without them, VS Code syntax
// highlighting goes haywire.
//
// prettier-ignore
export const isRelativeUrl = (url) => !(/^([a-zA-Z]{1,8}:\/\/).*$/.test(url));
export const isLocalServerUrl = (url) => /[a-zA-Z]{1,8}:\/\/127\.0\.0\.1/.test(url) || /[a-zA-Z]{1,8}:\/\/localhost/.test(url);
export const isLocalUrl = (url) => {
    if (isFileUrl(url))
        return true;
    if (isLocalServerUrl(url))
        return true;
    return false;
};
export const isLocalAssetUrl = (url, baseUrl) => {
    if (baseUrl === null)
        baseUrl = safeWindow.location.href;
    if (isDataUrl(url))
        return false;
    if (isLocalUrl(url))
        return true;
    if (isRelativeUrl(url) && isLocalUrl(baseUrl))
        return true;
    return false;
};
export const devicePixelRatio = () => safeWindow.devicePixelRatio;
export const isJP2Supported = function () {
    if (isFirefox())
        return false;
    return isWebKit();
};
export const isWebPSupported = () => isChrome();
export const deviceType = () => {
    // https://github.com/jeffmcmahan/device-detective/blob/master/bin/device-detect.js
    if (safeNavigator && /(tablet)|(iPad)|(Nexus 9)/i.test(safeNavigator.userAgent))
        return "tablet";
    if (safeNavigator && /(mobi)/i.test(safeNavigator.userAgent))
        return "phone";
    return "desktop";
};
export const deviceOS = () => {
    if (isMacOS())
        return "macos";
    if (isIOS())
        return "ios";
    if (isAndroid())
        return "android";
    if (isWindows())
        return "windows";
};
export const deviceFont = (os) => {
    // https://github.com/jonathantneal/system-font-css
    if (!os) {
        os = deviceOS();
    }
    const fonts = {
        apple: "-apple-system, BlinkMacSystemFont, SF Pro Text, SF UI Text, Helvetica Neue",
        google: "Roboto, Helvetica Neue",
        microsoft: "Segoe UI, Helvetica Neue",
    };
    if (os === "macos")
        return fonts.apple;
    if (os === "ios")
        return fonts.apple;
    if (os === "android")
        return fonts.google;
    if (os === "windows")
        return fonts.microsoft;
    return fonts.apple;
};
// XXX: Workaround for https://github.com/microsoft/rushstack/issues/1029
/** @internal */
export const environment = {
    isWebKit,
    webkitVersion,
    isChrome,
    isSafari,
    isFirefox,
    isFramerX,
    isEdge,
    isAndroid,
    isIOS,
    isMacOS,
    isWindows,
    isTouch,
    isDesktop,
    isPhone,
    isTablet,
    isMobile,
    isFileUrl,
    isDataUrl,
    isRelativeUrl,
    isLocalServerUrl,
    isLocalUrl,
    isLocalAssetUrl,
    devicePixelRatio,
    isJP2Supported,
    isWebPSupported,
    deviceType,
    deviceOS,
    deviceFont,
    safariVersion,
};
//# sourceMappingURL=environment.js.map