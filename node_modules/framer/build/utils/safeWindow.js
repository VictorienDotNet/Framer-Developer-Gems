const mockWindow = {
    addEventListener: () => { },
    removeEventListener: () => { },
    dispatchEvent: () => false,
    ResizeObserver: undefined,
    onpointerdown: false,
    onpointermove: false,
    onpointerup: false,
    ontouchstart: false,
    ontouchmove: false,
    ontouchend: false,
    onmousedown: false,
    onmousemove: false,
    onmouseup: false,
    devicePixelRatio: 1,
    scrollX: 0,
    scrollY: 0,
    location: {
        href: "",
    },
    setTimeout: () => 0,
    clearTimeout: () => { },
    setInterval: () => 0,
    clearInterval: () => { },
    requestAnimationFrame: () => 0,
    cancelAnimationFrame: () => { },
    getSelection: () => null,
    matchMedia: (query) => {
        return {
            matches: false,
            media: query,
            onchange: () => { },
            addEventListener: () => { },
            removeEventListener: () => { },
            addListener: () => { },
            removeListener: () => { },
            dispatchEvent: () => false,
        };
    },
    innerHeight: 0,
    SVGSVGElement: {},
};
/**
 * Creates a server-safe reference to `window`, returning a mock if none is available.
 *
 * @internal
 */
// eslint-disable-next-line no-undef
export const safeWindow = typeof window === "undefined" ? mockWindow : window;
//# sourceMappingURL=safeWindow.js.map