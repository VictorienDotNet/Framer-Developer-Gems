/**
 * Variant / Node Id / React Prop / Val
 *
 * @public
 */
export type VariantProps = Record<string, Record<string, Record<string, unknown>>>;
/**
 * Returns combines React props from a hash map based on the active variants.
 *
 * @public
 */
export declare function useAddVariantProps(baseVariant: string | undefined, gestureVariant: string | undefined, variantProps: VariantProps): (id: string) => Record<string, unknown>;
//# sourceMappingURL=useAddVariantProps.d.ts.map