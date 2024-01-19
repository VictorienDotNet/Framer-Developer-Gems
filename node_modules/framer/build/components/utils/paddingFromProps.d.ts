export interface PaddingProps {
    padding?: number;
    paddingPerSide?: boolean;
    paddingTop?: number;
    paddingRight?: number;
    paddingBottom?: number;
    paddingLeft?: number;
}
/**
 * @internal
 */
export declare function hasPaddingPerSide(props: Partial<PaddingProps>): boolean;
/**
 * @internal
 */
export declare function paddingFromProps(props: Partial<PaddingProps>): {
    top: number;
    bottom: number;
    left: number;
    right: number;
};
/**
 * @internal
 */
export declare function makePaddingString({ top, left, bottom, right, }: {
    left: number;
    top: number;
    bottom: number;
    right: number;
}): string;
//# sourceMappingURL=paddingFromProps.d.ts.map