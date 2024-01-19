function hasProp(o, prop) {
    return Object.prototype.hasOwnProperty.call(o, prop);
}
function withEquals(o) {
    if (!hasProp(o, "equals"))
        return false;
    return typeof o.equals === "function";
}
function valueEqual(a, b) {
    if (a === b)
        return true;
    // True if a and b are NaN, otherwise false
    return a !== a && b !== b;
}
function arrayShallowEqual(a, b) {
    const length = a.length;
    if (length !== b.length)
        return false;
    for (let i = length; i-- !== 0;) {
        if (!valueEqual(a[i], b[i]))
            return false;
    }
    return true;
}
function arrayDeepEqual(a, b) {
    const length = a.length;
    if (length !== b.length)
        return false;
    for (let i = length; i-- !== 0;) {
        if (!equal(a[i], b[i], true))
            return false;
    }
    return true;
}
function mapShallowEqual(a, b) {
    if (a.size !== b.size)
        return false;
    for (const [key, aValue] of a.entries()) {
        if (!valueEqual(aValue, b.get(key)))
            return false;
    }
    return true;
}
function mapDeepEqual(a, b) {
    if (a.size !== b.size)
        return false;
    for (const [key, aValue] of a.entries()) {
        if (!equal(aValue, b.get(key), true))
            return false;
    }
    return true;
}
function setEqual(a, b) {
    if (a.size !== b.size)
        return false;
    for (const aValue of a.keys()) {
        if (!b.has(aValue))
            return false;
    }
    return true;
}
function objectShallowEqual(a, b) {
    const keys = Object.keys(a);
    if (keys.length !== Object.keys(b).length)
        return false;
    for (const key of keys) {
        if (!hasProp(b, key))
            return false;
        if (key === "_owner" && hasProp(a, "$$typeof") && a.$$typeof) {
            // React-specific: avoid traversing React elements' _owner.
            continue;
        }
        if (!valueEqual(a[key], b[key]))
            return false;
    }
    return true;
}
function objectDeepEqual(a, b) {
    const keys = Object.keys(a);
    if (keys.length !== Object.keys(b).length)
        return false;
    for (const key of keys) {
        if (!hasProp(b, key))
            return false;
        if (key === "_owner" && hasProp(a, "$$typeof") && a.$$typeof) {
            // React-specific: avoid traversing React elements' _owner.
            continue;
        }
        if (!equal(a[key], b[key], true))
            return false;
    }
    return true;
}
// Adapted from react-fast-compare (https://github.com/FormidableLabs/react-fast-compare)
function equal(a, b, deep) {
    if (a === b)
        return true;
    // True if a and b are both NaN, otherwise false.
    if (!a || !b)
        return a !== a && b !== b;
    const typeA = typeof a;
    const typeB = typeof b;
    if (typeA !== typeB)
        return false;
    if (typeA !== "object")
        return false;
    // Arrays
    const aIsArray = Array.isArray(a);
    const bIsArray = Array.isArray(b);
    if (aIsArray && bIsArray) {
        if (deep) {
            return arrayDeepEqual(a, b);
        }
        else {
            return arrayShallowEqual(a, b);
        }
    }
    else if (aIsArray !== bIsArray) {
        return false;
    }
    // Maps
    const aIsMap = a instanceof Map;
    const bIsMap = b instanceof Map;
    if (aIsMap && bIsMap) {
        if (deep) {
            return mapDeepEqual(a, b);
        }
        else {
            return mapShallowEqual(a, b);
        }
    }
    else if (aIsMap !== bIsMap) {
        return false;
    }
    // Sets
    const aIsSet = a instanceof Set;
    const bIsSet = b instanceof Set;
    if (aIsSet && bIsSet) {
        return setEqual(a, b);
    }
    else if (aIsSet !== bIsSet) {
        return false;
    }
    // Date
    const dateA = a instanceof Date;
    const dateB = b instanceof Date;
    if (dateA && dateB) {
        return a.getTime() === b.getTime();
    }
    else if (dateA !== dateB) {
        return false;
    }
    // Regex
    const regexpA = a instanceof RegExp;
    const regexpB = b instanceof RegExp;
    if (regexpA && regexpB) {
        return a.toString() === b.toString();
    }
    else if (regexpA !== regexpB) {
        return false;
    }
    if (withEquals(a) && withEquals(b)) {
        return a.equals(b);
    }
    if (deep) {
        return objectDeepEqual(a, b);
    }
    else {
        return objectShallowEqual(a, b);
    }
}
/** @internal */
export function isEqual(a, b, deep = true) {
    try {
        return equal(a, b, deep);
    }
    catch (error) {
        if (error instanceof Error && error.message.match(/stack|recursion/i)) {
            // eslint-disable-next-line no-console
            console.warn("Warning: isEqual does not handle circular references.", error.name, error.message);
            return false;
        }
        throw error;
    }
}
//# sourceMappingURL=isEqual.js.map