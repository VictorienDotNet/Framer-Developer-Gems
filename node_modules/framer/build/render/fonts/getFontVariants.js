import { isString } from "../../utils/utils.js";
/** @internal */
export function getFontVariants(currentVariant, variants, parseVariant) {
    if (variants.length === 0)
        return {};
    const currentVariantInfo = parseVariant(currentVariant);
    if (!currentVariantInfo)
        return {};
    const { weight: currentWeight, style: currentStyle } = currentVariantInfo;
    const variantByWeightAndStyle = new Map();
    const boldVariantByStyle = new Map();
    variants.forEach(variant => {
        const variantName = isString(variant) ? variant : variant.name.toLocaleLowerCase();
        const variantInfo = parseVariant(variantName);
        if (!variantInfo)
            return;
        variantByWeightAndStyle.set(`${variantInfo.weight}-${variantInfo.style}`, variantName);
        if (variantInfo.weight <= currentWeight)
            return;
        if (!boldVariantByStyle.has(variantInfo.style)) {
            boldVariantByStyle.set(variantInfo.style, variantName);
        }
    });
    // Follow the relative weights convention when possible. If those weights aren't available, load the "next" bolder variant
    // More in https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight
    let variantBold = boldVariantByStyle.get(currentStyle);
    let variantBoldItalic = boldVariantByStyle.get("italic") ?? boldVariantByStyle.get("oblique");
    if (currentVariantInfo.weight <= 300) {
        variantBold = variantByWeightAndStyle.get(`400-${currentStyle}`) ?? variantBold;
        variantBoldItalic =
            variantByWeightAndStyle.get("400-italic") ?? variantByWeightAndStyle.get("400-oblique") ?? variantBoldItalic;
    }
    else if (currentVariantInfo.weight <= 500) {
        variantBold = variantByWeightAndStyle.get(`700-${currentStyle}`) ?? variantBold;
        variantBoldItalic =
            variantByWeightAndStyle.get("700-italic") ?? variantByWeightAndStyle.get("700-oblique") ?? variantBoldItalic;
    }
    else {
        variantBold = variantByWeightAndStyle.get(`900-${currentStyle}`) ?? variantBold;
        variantBoldItalic =
            variantByWeightAndStyle.get("900-italic") ?? variantByWeightAndStyle.get("900-oblique") ?? variantBoldItalic;
    }
    // Follow the `font-style: italic` defaults logic as stated in
    // https://developer.mozilla.org/en-US/docs/Web/CSS/font-style
    const variantItalic = variantByWeightAndStyle.get(`${currentWeight}-italic`) ??
        variantByWeightAndStyle.get(`${currentWeight}-oblique`);
    return { variantBold, variantItalic, variantBoldItalic };
}
//# sourceMappingURL=getFontVariants.js.map