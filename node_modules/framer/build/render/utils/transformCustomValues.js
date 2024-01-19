import { complex, invariant, px } from "framer-motion";
import { Color } from "../../render/types/Color/Color.js";
const isCustomValue = (v) => {
    return Boolean(v && typeof v === "object" && v.mix && v.toValue);
};
const isColorProp = (key) => key === "background" || key.endsWith("color") || key.endsWith("Color");
const resolveSingleCustomValue = (key, v) => {
    if (v && typeof v === "object") {
        invariant(isCustomValue(v), "Motion styles must be numbers, strings, or an instance with a `toValue` and `mix` methods.");
        return v.toValue();
    }
    else if (isColorProp(key) && typeof v === "string" && Color.isColor(v)) {
        return Color(v).toValue();
    }
    return v;
};
const resolveCustomValues = (key, v) => {
    if (Array.isArray(v)) {
        const numValues = v.length;
        const resolved = [];
        for (let i = 0; i < numValues; i++) {
            resolved.push(resolveSingleCustomValue(key, v[i]));
        }
        return resolved;
    }
    else {
        return resolveSingleCustomValue(key, v);
    }
};
const customValueHandlers = {
    size: {
        set: (inputValues, outputValues, value) => {
            if (inputValues.height === undefined) {
                outputValues.height = value;
            }
            if (inputValues.width === undefined) {
                outputValues.width = value;
            }
        },
        type: px,
    },
    radius: {
        set: (inputValues, outputValues, value) => {
            outputValues.borderRadius = value;
        },
        type: px,
    },
    shadow: {
        set: (inputValues, outputValues, value) => {
            outputValues.boxShadow = value;
        },
        type: complex,
    },
};
/**
 * Transform custom values
 *
 * Resolves value types like `Color` into animatable value types like rgba strings.
 *
 * Converts special values like `radius` and `size` into DOM values like `width`/`height`/`borderRadius`
 *
 * @param values
 */
export const transformValues = (values) => {
    const transformedValues = {};
    for (const key in values) {
        const resolved = resolveCustomValues(key, values[key]);
        const valueHandler = customValueHandlers[key];
        if (valueHandler) {
            // If this is a special value type like `radius`, convert it
            // And if this value type has a default (ie 'px') and its provided as a number, convert it.
            const isDefaultType = valueHandler.type && typeof values[key] === "number";
            const value = isDefaultType ? valueHandler.type.transform(values[key]) : values[key];
            valueHandler.set(values, transformedValues, value);
        }
        else {
            // Otherwise just set it
            transformedValues[key] = resolved;
        }
    }
    return transformedValues;
};
//# sourceMappingURL=transformCustomValues.js.map