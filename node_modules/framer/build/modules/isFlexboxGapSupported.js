let isFlexboxGapSupportedCached;
/* @internal */
export function isFlexboxGapSupported() {
    if (isFlexboxGapSupportedCached !== undefined) {
        return isFlexboxGapSupportedCached;
    }
    // Source: https://github.com/Modernizr/Modernizr/blob/master/feature-detects/css/flexgap.js
    // create flex container with row-gap set
    const flex = document.createElement("div");
    Object.assign(flex.style, {
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        rowGap: "1px",
    });
    // create two elements inside it
    flex.appendChild(document.createElement("div"));
    flex.appendChild(document.createElement("div"));
    // append to the DOM (needed to obtain scrollHeight)
    document.body.appendChild(flex);
    const isSupported = flex.scrollHeight === 1; // flex container should be 1px high from the row-gap
    if (flex.parentNode) {
        flex.parentNode.removeChild(flex);
    }
    isFlexboxGapSupportedCached = isSupported;
    return isSupported;
}
//# sourceMappingURL=isFlexboxGapSupported.js.map