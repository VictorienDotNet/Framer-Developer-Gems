import React from "react";
import { FrameWithMotion } from "../render/presentation/Frame/FrameWithMotion.js";
import { RenderEnvironment, RenderTarget } from "../render/types/RenderEnvironment.js";
/** @internal */
export function EmptyState({ title = "", description = "Click and drag the connector to any frame on the canvas →", children, size, hide, insideUserCodeComponent = false, position = "absolute", }) {
    const { target } = RenderEnvironment;
    const childCount = React.Children.count(children);
    if (insideUserCodeComponent && childCount === 0) {
        return React.createElement(FrameWithMotion, { ...size, "data-name": "placeholder" });
    }
    if (target !== RenderTarget.canvas)
        return null;
    if (hide)
        return null;
    if (childCount !== 0)
        return null;
    return (React.createElement(FrameWithMotion, { key: "empty-state", className: "framerInternalUI-canvasPlaceholder", top: 0, left: 0, bottom: 0, right: 0, style: { position, ...size } },
        React.createElement("div", { style: {
                display: "flex",
                alignItems: "center",
                lineHeight: "1.4",
                height: "100%",
                width: "100%",
            } },
            React.createElement("div", { style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    width: "100%",
                    // Use a mask to fade out the right edge of the content as it gets cropped.
                    WebkitMaskImage: `linear-gradient(90deg, black, black calc(100% - 12px * ${scaleFactor}), transparent)`,
                } },
                React.createElement(Title, null, title),
                React.createElement(Description, null, description)))));
}
const scaleFactor = "var(--framerInternalCanvas-canvasPlaceholderContentScaleFactor, 1)";
export function Title({ children }) {
    return (React.createElement("span", { style: {
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
            flexGrow: 1,
            flexShrink: 0,
            fontWeight: 600,
            marginBottom: "5px",
        } }, children));
}
function Description({ children }) {
    return (React.createElement("span", { style: {
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
            flexGrow: 1,
            flexShrink: 0,
            fontWeight: 400,
            maxWidth: "200px",
        } }, children));
}
//# sourceMappingURL=EmptyState.js.map