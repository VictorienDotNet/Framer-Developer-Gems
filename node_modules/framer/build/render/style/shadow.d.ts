import type { MotionStyle } from "framer-motion";
import type { InternalID } from "../../utils/internalId.js";
import type { BoxShadowProperties, TextShadowProperties } from "../traits/Shadow.js";
import React from "react";
import { Rect } from "../types/Rect.js";
import { BoxShadow, Shadow } from "../types/Shadow.js";
export declare function shadowsAsFilter(shadows: Readonly<Shadow[]>): string[];
export declare function collectTextShadowsForProps(props: Partial<TextShadowProperties>, style: MotionStyle): void;
export declare function collectBoxShadowsForProps(props: Partial<BoxShadowProperties>, style: MotionStyle): void;
/** @internal */
export declare function shadowForShape(boxShadows: BoxShadow[], rect: Rect, shapeId: InternalID, fillAlpha: number, strokeAlpha: number, strokeWidth: number | undefined, strokeClipId: InternalID, svgStrokeAttributes: React.SVGAttributes<SVGElement>): {
    definition: JSX.Element[];
    outsetElement: JSX.Element | null;
    insetElement: JSX.Element | null;
    needsStrokeClip: boolean;
};
export declare function calcMaxRealisticShadowBlur(distance: number, focus: number): number;
export declare function calcRealisticShadowSpread(diffusion: number): number;
/** @internal */
export declare function localShadowFrame(shadow: BoxShadow | Shadow, frame: Rect, isSVG?: boolean): {
    x: number;
    y: number;
    width: number;
    height: number;
} | null;
//# sourceMappingURL=shadow.d.ts.map