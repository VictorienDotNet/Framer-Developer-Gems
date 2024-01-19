/** @public */
export interface Shadow {
    color: string;
    x: number;
    y: number;
    blur: number;
}
/** @public */
export declare const Shadow: {
    is: (shadow: any) => shadow is Shadow;
};
export interface RealisticShadow {
    type: "realistic";
    diffusion: number;
    focus: number;
}
/** @public */
export interface BoxShadow {
    type?: "box" | "realistic";
    inset: boolean;
    color: string;
    x: number;
    y: number;
    blur: number;
    spread: number;
    diffusion: number;
    focus: number;
}
/** @public */
export declare const BoxShadow: {
    is: (shadow: any) => shadow is BoxShadow;
    toCSS: (shadow: BoxShadow) => string;
};
//# sourceMappingURL=Shadow.d.ts.map