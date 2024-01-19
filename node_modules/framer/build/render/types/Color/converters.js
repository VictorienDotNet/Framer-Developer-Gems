import HSLUV from "hsluv";
import { cssNames } from "./CSSNames.js";
import { ColorFormat, } from "./types.js";
import { isNumeric, percentToFraction } from "./Utils.js";
const { hsluvToRgb, rgbToHsluv: rgbToHsluvExternal } = HSLUV;
export function rgbToHsluv(r, g, b) {
    const [h, s, l] = rgbToHsluvExternal([r / 255, g / 255, b / 255]);
    return { h, s, l };
}
export function rgbaFromHusl(h, s, l, a = 1) {
    const rgb = hsluvToRgb([h, s, l]);
    return {
        r: rgb[0] * 255,
        g: rgb[1] * 255,
        b: rgb[2] * 255,
        a: a,
    };
}
export function hsvToStr(h, s, v, a) {
    const _h = Math.round(h);
    const _s = Math.round(s * 100);
    const _v = Math.round(v * 100);
    return a === undefined || a === 1
        ? "hsv(" + _h + ", " + _s + "%, " + _v + "%)"
        : "hsva(" + _h + ", " + _s + "%, " + _v + "%, " + a + ")";
}
export function rgbToRgb(r, g, b) {
    return {
        r: isNumeric(r) ? bound01(r, 255) * 255 : 0,
        g: isNumeric(g) ? bound01(g, 255) * 255 : 0,
        b: isNumeric(b) ? bound01(b, 255) * 255 : 0,
    };
}
export function rgbToHex(r, g, b, allow3Char) {
    const hex = [
        pad2(Math.round(r).toString(16)),
        pad2(Math.round(g).toString(16)),
        pad2(Math.round(b).toString(16)),
    ];
    if (allow3Char &&
        hex[0].charAt(0) === hex[0].charAt(1) &&
        hex[1].charAt(0) === hex[1].charAt(1) &&
        hex[2].charAt(0) === hex[2].charAt(1)) {
        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
    }
    return hex.join("");
}
export function rgbToHsl(r, g, b) {
    let l;
    let s;
    const _r = bound01(r, 255);
    const _g = bound01(g, 255);
    const _b = bound01(b, 255);
    const max = Math.max(_r, _g, _b);
    const min = Math.min(_r, _g, _b);
    let h = (s = l = (max + min) / 2);
    if (max === min) {
        h = s = 0;
    }
    else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case _r:
                h = (_g - _b) / d + (_g < _b ? 6 : 0);
                break;
            case _g:
                h = (_b - _r) / d + 2;
                break;
            case _b:
                h = (_r - _g) / d + 4;
                break;
        }
        h /= 6;
    }
    return { h: h * 360, s, l };
}
function hue2rgb(p, q, t) {
    if (t < 0) {
        t += 1;
    }
    if (t > 1) {
        t -= 1;
    }
    if (t < 1 / 6) {
        return p + (q - p) * 6 * t;
    }
    if (t < 1 / 2) {
        return q;
    }
    if (t < 2 / 3) {
        return p + (q - p) * (2 / 3 - t) * 6;
    }
    return p;
}
// HSL to RGB
export function hslToRgb(h, s, l) {
    let r;
    let g;
    let b;
    h = bound01(h, 360);
    s = bound01(s * 100, 100);
    l = bound01(l * 100, 100);
    if (s === 0) {
        r = g = b = l; // Achromatic
    }
    else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return { r: r * 255, g: g * 255, b: b * 255 };
}
export function rgbToHsv(r, g, b) {
    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    let h;
    const s = max === 0 ? 0 : d / max;
    const v = max;
    if (max === min) {
        h = 0; // achromatic
    }
    else {
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    return { h: h, s, v };
}
export function hsvToRgb(h, s, v) {
    h = bound01(h, 360) * 6;
    s = bound01(s * 100, 100);
    v = bound01(v * 100, 100);
    const i = Math.floor(h);
    const f = h - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    const mod = i % 6;
    const r = [v, q, p, p, t, v][mod];
    const g = [t, v, v, q, p, p][mod];
    const b = [p, p, t, v, v, q][mod];
    // @ts-ignore: Suppress the noUncheckedIndexedAccess error on this line. The
    // modulo result should range from 0~5, so cannot go out of bound of the
    // array.
    return { r: r * 255, g: g * 255, b: b * 255 };
}
function bound01(n, max) {
    let _max;
    let _n;
    if (typeof max === "string")
        _max = parseFloat(max);
    else
        _max = max;
    if (typeof n === "string") {
        if (isOnePointZero(n)) {
            n = "100%";
        }
        const processPercent = isPercentage(n);
        _n = Math.min(_max, Math.max(0, parseFloat(n)));
        // Automatically convert percentage into number
        if (processPercent) {
            _n = Math.floor(_n * _max) / 100;
        }
    }
    else {
        _n = n;
    }
    // Handle floating point rounding errors
    if (Math.abs(_n - _max) < 0.000001) {
        return 1;
    }
    // Convert into [0, 1] range if it isn't already
    return (_n % _max) / _max;
}
function isOnePointZero(n) {
    return typeof n === "string" && n.includes(".") && parseFloat(n) === 1;
}
function isPercentage(n) {
    return typeof n === "string" && n.includes("%");
}
function pad2(char) {
    if (char.length === 1) {
        return "0" + char;
    }
    else {
        return "" + char;
    }
}
const matchers = (function () {
    const cssInteger = "[-\\+]?\\d+%?";
    const cssNumber = "[-\\+]?\\d*\\.\\d+%?";
    const cssUnit = "(?:" + cssNumber + ")|(?:" + cssInteger + ")";
    const permissiveMatch3 = "[\\s|\\(]+(" + cssUnit + ")[,|\\s]+(" + cssUnit + ")[,|\\s]+(" + cssUnit + ")\\s*\\)?";
    const permissiveMatch4 = "[\\s|\\(]+(" + cssUnit + ")[,|\\s]+(" + cssUnit + ")[,|\\s]+(" + cssUnit + ")[,|\\s]+(" + cssUnit + ")\\s*\\)?";
    return {
        rgb: new RegExp("rgb" + permissiveMatch3),
        rgba: new RegExp("rgba" + permissiveMatch4),
        hsl: new RegExp("hsl" + permissiveMatch3),
        hsla: new RegExp("hsla" + permissiveMatch4),
        hsv: new RegExp("hsv" + permissiveMatch3),
        hsva: new RegExp("hsva" + permissiveMatch4),
        hex3: /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
        hex6: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
        hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
        hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
    };
})();
export function stringToObject(inputColor) {
    // Early return for gradients
    if (inputColor.includes("gradient("))
        return false;
    // Early return for variables
    if (inputColor.includes("var("))
        return false;
    const trimLeft = /^[\s,#]+/;
    const trimRight = /\s+$/;
    let color = inputColor.replace(trimLeft, "").replace(trimRight, "").toLowerCase();
    let named = false;
    if (cssNames[color]) {
        color = cssNames[color];
        named = true;
    }
    if (color === "transparent") {
        return {
            r: 0,
            g: 0,
            b: 0,
            a: 0,
            format: ColorFormat.NAME,
        };
    }
    let match;
    if ((match = matchers.rgb.exec(color))) {
        return {
            r: parseInt(match[1] ?? ""),
            g: parseInt(match[2] ?? ""),
            b: parseInt(match[3] ?? ""),
            a: 1,
            format: ColorFormat.RGB,
        };
    }
    if ((match = matchers.rgba.exec(color))) {
        return {
            r: parseInt(match[1] ?? ""),
            g: parseInt(match[2] ?? ""),
            b: parseInt(match[3] ?? ""),
            a: parseFloat(match[4] ?? ""),
            format: ColorFormat.RGB,
        };
    }
    if ((match = matchers.hsl.exec(color))) {
        return {
            h: parseInt(match[1] ?? ""),
            s: percentToFraction(match[2] ?? ""),
            l: percentToFraction(match[3] ?? ""),
            a: 1,
            format: ColorFormat.HSL,
        };
    }
    if ((match = matchers.hsla.exec(color))) {
        return {
            h: parseInt(match[1] ?? ""),
            s: percentToFraction(match[2] ?? ""),
            l: percentToFraction(match[3] ?? ""),
            a: parseFloat(match[4] ?? ""),
            format: ColorFormat.HSL,
        };
    }
    if ((match = matchers.hsv.exec(color))) {
        return {
            h: parseInt(match[1] ?? ""),
            s: percentToFraction(match[2] ?? ""),
            v: percentToFraction(match[3] ?? ""),
            a: 1,
            format: ColorFormat.HSV,
        };
    }
    if ((match = matchers.hsva.exec(color))) {
        return {
            h: parseInt(match[1] ?? ""),
            s: percentToFraction(match[2] ?? ""),
            v: percentToFraction(match[3] ?? ""),
            a: parseFloat(match[4] ?? ""),
            format: ColorFormat.HSV,
        };
    }
    if ((match = matchers.hex8.exec(color))) {
        return {
            r: parseIntFromHex(match[1] ?? ""),
            g: parseIntFromHex(match[2] ?? ""),
            b: parseIntFromHex(match[3] ?? ""),
            a: convertHexToDecimal(match[4] ?? ""),
            format: named ? ColorFormat.NAME : ColorFormat.HEX,
        };
    }
    if ((match = matchers.hex6.exec(color))) {
        return {
            r: parseIntFromHex(match[1] ?? ""),
            g: parseIntFromHex(match[2] ?? ""),
            b: parseIntFromHex(match[3] ?? ""),
            a: 1,
            format: named ? ColorFormat.NAME : ColorFormat.HEX,
        };
    }
    if ((match = matchers.hex4.exec(color))) {
        return {
            r: parseIntFromHex(`${match[1]}${match[1]}`),
            g: parseIntFromHex(`${match[2]}${match[2]}`),
            b: parseIntFromHex(`${match[3]}${match[3]}`),
            a: convertHexToDecimal(match[4] + "" + match[4]),
            format: named ? ColorFormat.NAME : ColorFormat.HEX,
        };
    }
    if ((match = matchers.hex3.exec(color))) {
        return {
            r: parseIntFromHex(`${match[1]}${match[1]}`),
            g: parseIntFromHex(`${match[2]}${match[2]}`),
            b: parseIntFromHex(`${match[3]}${match[3]}`),
            a: 1,
            format: named ? ColorFormat.NAME : ColorFormat.HEX,
        };
    }
    else {
        return false;
    }
}
function parseIntFromHex(hex) {
    return parseInt(hex, 16);
}
function convertHexToDecimal(h) {
    return parseIntFromHex(h) / 255;
}
//# sourceMappingURL=converters.js.map