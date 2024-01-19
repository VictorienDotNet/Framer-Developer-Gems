import FontFaceObserver from "fontfaceobserver";
import { isString } from "../../utils/utils.js";
const FONT_LOADING_TIMEOUT = 5000; // Amount of ms to wait when detecting if a font is ready
const MAX_RETRIES = 3; // Max number of times to retry font loading in case network error occurs
export class FontLoadingError extends Error {
    constructor(message) {
        super(message);
        this.name = "FontLoadingError";
    }
}
const fontRequests = new Map();
const fontReadyPromises = new Map();
/** @internal  */
export const loadFont = (data, doc) => loadFontWithRetries(data, doc);
async function loadFontWithRetries(data, doc, attempt = 0) {
    const { family, url, stretch, unicodeRange } = data;
    const weight = data.weight || 500;
    const style = data.style || "normal";
    const requestId = `${family}-${style}-${weight}-${url}`;
    if (!fontRequests.has(requestId) || attempt > 0) {
        const fontFace = new FontFace(family, `url(${url})`, {
            weight: isString(weight) ? weight : weight?.toString(),
            style,
            stretch,
            unicodeRange,
        });
        const readyPromise = fontFace
            // Load the font
            .load()
            .then(() => {
            // Add the font to the document
            doc.fonts.add(fontFace);
            // Wait until it's fully ready
            return isFontReady(family, style, weight);
        })
            .catch(e => {
            if (e.name !== "NetworkError") {
                throw e;
            }
            // In case of a network error; retry
            if (attempt < MAX_RETRIES) {
                return loadFontWithRetries(data, doc, attempt + 1);
            }
            // Throw error when retry limit has been reached
            throw new FontLoadingError(`Font loading failed after ${attempt} retries due to network error: ${JSON.stringify({
                family,
                style,
                weight,
                url,
                stretch,
                unicodeRange,
            })}`);
        });
        fontRequests.set(requestId, readyPromise);
    }
    await fontRequests.get(requestId);
}
/** @internal  */
export async function isFontReady(family, style, weight) {
    const readyPromiseId = `${family}-${style}-${weight}`;
    if (!fontReadyPromises.has(readyPromiseId)) {
        const observer = new FontFaceObserver(family, {
            style,
            weight,
        });
        const readyPromise = observer.load(null, FONT_LOADING_TIMEOUT);
        fontReadyPromises.set(readyPromiseId, readyPromise);
    }
    try {
        await fontReadyPromises.get(readyPromiseId);
    }
    catch (e) {
        throw new FontLoadingError(`Failed to check if font is ready (${FONT_LOADING_TIMEOUT}ms timeout exceeded): ${JSON.stringify({
            family,
            style,
            weight,
        })}`);
    }
}
/**
 * @internal
 * Util function for use in tests to clear state between test cases
 * */
export function _clearCache() {
    fontRequests.clear();
    fontReadyPromises.clear();
}
//# sourceMappingURL=loadFont.js.map