import { useRef } from "react";
import { isEqual } from "../render/utils/isEqual.js";
import { isArray, isNumber, isObject, isString, isUndefined, isValidDate } from "../utils/utils.js";
import { LazyValue } from "./LazyValue.js";
/** A DeepWeakMap is a WeakMap of WeakMaps. */
export class DeepWeakMap {
    map1 = new WeakMap();
    get(key1, key2) {
        const map2 = this.map1.get(key1);
        return map2?.get(key2);
    }
    set(key1, key2, value) {
        const map2 = this.map1.get(key1) ?? new WeakMap();
        this.map1.set(key1, map2);
        return map2.set(key2, value);
    }
}
export var UnaryOperator;
(function (UnaryOperator) {
    UnaryOperator["Not"] = "not";
})(UnaryOperator || (UnaryOperator = {}));
export var BinaryOperator;
(function (BinaryOperator) {
    BinaryOperator["And"] = "and";
    BinaryOperator["Or"] = "or";
    BinaryOperator["Equals"] = "==";
    BinaryOperator["NotEquals"] = "!=";
    BinaryOperator["LessThan"] = "<";
    BinaryOperator["LessThanOrEqual"] = "<=";
    BinaryOperator["GreaterThan"] = ">";
    BinaryOperator["GreaterThanOrEqual"] = ">=";
})(BinaryOperator || (BinaryOperator = {}));
export var OrderDirection;
(function (OrderDirection) {
    OrderDirection["Ascending"] = "asc";
    OrderDirection["Descending"] = "desc";
})(OrderDirection || (OrderDirection = {}));
// Extract the data from collection module.
function useData(from) {
    const { data, locale } = from;
    // The collection is not localized. Return the data directly.
    if (isArray(data))
        return data;
    // The collection is localized. Preload the locale.
    const promise = data.preload(locale);
    if (promise)
        throw promise;
    return data.read(locale);
}
// Insert "index" field into data.
const indexCache = new WeakMap();
function useInsertIndex(data) {
    const cached = indexCache.get(data);
    if (cached)
        return cached;
    const result = data.map((item, index) => {
        return { ...item, index };
    });
    indexCache.set(data, result);
    return result;
}
// Handle "WHERE …" expression.
const whereCache = /* @__PURE__ */ new DeepWeakMap();
function useExecuteWhere(data, where) {
    if (!where)
        return data;
    const cached = whereCache.get(data, where);
    if (cached)
        return cached;
    const result = data.filter(item => {
        return evaluateExpression(where, {
            resolveIdentifier(identifier) {
                return item[identifier];
            },
        });
    });
    whereCache.set(data, where, result);
    return result;
}
// Handle "ORDER BY …" expression.
const orderByCache = /* @__PURE__ */ new DeepWeakMap();
function useExecuteOrderBy(data, orderBy) {
    if (!orderBy)
        return data;
    const cached = orderByCache.get(data, orderBy);
    if (cached)
        return cached;
    const result = [...data].sort((leftItem, rightItem) => {
        let order = 0;
        for (const expression of orderBy) {
            const leftValue = evaluateExpression(expression, {
                resolveIdentifier(identifier) {
                    return leftItem[identifier];
                },
            });
            const rightValue = evaluateExpression(expression, {
                resolveIdentifier(identifier) {
                    return rightItem[identifier];
                },
            });
            if (isNumber(leftValue) && isNumber(rightValue)) {
                order = leftValue - rightValue;
            }
            if (isString(leftValue) && isString(rightValue)) {
                order = leftValue.localeCompare(rightValue, "en");
            }
            if (order !== 0) {
                return expression.direction === OrderDirection.Descending ? -order : order;
            }
        }
        if (isNumber(leftItem.index) && isNumber(rightItem.index)) {
            return leftItem.index - rightItem.index;
        }
        return 0;
    });
    orderByCache.set(data, orderBy, result);
    return result;
}
// Handle "OFFSET …" expression.
const offsetCache = /* @__PURE__ */ new DeepWeakMap();
function useExecuteOffset(data, offset) {
    if (!offset)
        return data;
    const cached = offsetCache.get(data, offset);
    if (cached)
        return cached;
    const offsetValue = evaluateExpression(offset, {
        resolveIdentifier() {
            // We can't resolve an identifier in this place yet. In the
            // future we should be able to resolve something like COUNT(*)
            // or SUM(population).
            throw new Error("Can't resolve identifier");
        },
    });
    const result = isNumber(offsetValue) ? data.slice(offsetValue) : data;
    offsetCache.set(data, offset, result);
    return result;
}
// Handle "LIMIT …" expression.
const limitCache = /* @__PURE__ */ new DeepWeakMap();
function useExecuteLimit(data, limit) {
    if (!limit)
        return data;
    const cached = limitCache.get(data, limit);
    if (cached)
        return cached;
    const limitValue = evaluateExpression(limit, {
        resolveIdentifier() {
            throw new Error("Can't resolve identifier");
        },
    });
    const result = isNumber(limitValue) ? data.slice(0, limitValue) : data;
    limitCache.set(data, limit, result);
    return result;
}
// Handle "SELECT …" expression.
const selectCache = /* @__PURE__ */ new DeepWeakMap();
function useExecuteSelect(data, select) {
    const cached = selectCache.get(data, select);
    if (cached)
        return cached;
    const preloadPromise = preloadExpressions(select, data);
    // Throw promise which React will catch and wait until it's resolved before
    // attempting re-rendering. This is an unofficial API, currently used
    // internally by `React.lazy`.
    if (preloadPromise)
        throw preloadPromise;
    const result = data.map(item => {
        const selected = {};
        for (const expression of select) {
            const name = expression.alias ?? stringifyExpression(expression);
            selected[name] = evaluateExpression(expression, {
                resolveIdentifier(identifier) {
                    const value = item[identifier];
                    if (LazyValue.is(value)) {
                        return value.read();
                    }
                    return value;
                },
            });
        }
        return selected;
    });
    selectCache.set(data, select, result);
    return result;
}
function preloadExpressions(expressions, data) {
    // Get all the identifiers that are used by the expressions so we don't have
    // to iterate over the whole expression in the for loop below.
    const identifiers = [];
    for (const expression of expressions) {
        extractIdentifiers(identifiers, expression);
    }
    // If we don't have any identifiers in the expressions there is no need to
    // preload anything.
    if (identifiers.length === 0)
        return;
    // Collect a promise for every lazy value that needs to be preloaded.
    const preloadPromises = [];
    for (const item of data) {
        for (const identifier of identifiers) {
            const value = item[identifier];
            if (!LazyValue.is(value))
                continue;
            const promise = value.preload();
            if (!promise)
                continue;
            preloadPromises.push(promise);
        }
    }
    // Return a promise that resolves when all the lazy values are preloaded.
    if (preloadPromises.length === 0)
        return;
    return Promise.all(preloadPromises);
}
function extractIdentifiers(identifiers, expression) {
    if (expression.type === "Identifier") {
        identifiers.push(expression.name);
    }
    if (expression.type === "FunctionCall") {
        for (const argument of expression.arguments) {
            extractIdentifiers(identifiers, argument);
        }
    }
    if (expression.type === "Case") {
        if (expression.value) {
            extractIdentifiers(identifiers, expression.value);
        }
        for (const condition of expression.conditions) {
            extractIdentifiers(identifiers, condition.when);
            extractIdentifiers(identifiers, condition.then);
        }
        if (expression.else) {
            extractIdentifiers(identifiers, expression.else);
        }
    }
    if (expression.type === "UnaryOperation") {
        extractIdentifiers(identifiers, expression.value);
    }
    if (expression.type === "BinaryOperation") {
        extractIdentifiers(identifiers, expression.left);
        extractIdentifiers(identifiers, expression.right);
    }
    if (expression.type === "TypeCast") {
        extractIdentifiers(identifiers, expression.value);
    }
}
/** @internal */
export function useQueryData(query) {
    const queryRef = useRef();
    // Save a stable reference to the query if it hasn't changed so the useMemo
    // below works correctly. TODO: This doesn't work with suspense.
    if (queryRef.current && isEqual(queryRef.current, query)) {
        query = queryRef.current;
    }
    else {
        queryRef.current = query;
    }
    let result = useData(query.from);
    // We can't use useMemo here as it doesn't work if the component suspends.
    // To cache the steps we store the result of each step on the previous
    // result object with a WeakMap instead.
    result = useInsertIndex(result);
    result = useExecuteWhere(result, query.where);
    result = useExecuteOrderBy(result, query.orderBy);
    result = useExecuteOffset(result, query.offset);
    result = useExecuteLimit(result, query.limit);
    result = useExecuteSelect(result, query.select);
    return result;
}
export function evaluateExpression(expression, context) {
    switch (expression.type) {
        case "Identifier":
            return context.resolveIdentifier(expression.name);
        case "LiteralValue":
            return expression.value;
        case "FunctionCall":
            return evaluateFunctionCall(expression, context);
        case "Case":
            return evaluateCase(expression, context);
        case "UnaryOperation":
            return evaluateUnaryOperation(expression, context);
        case "BinaryOperation":
            return evaluateBinaryOperation(expression, context);
        case "TypeCast":
            return evaluateTypeCast(expression, context);
        default:
            throw new Error(`Unsupported expression: ${JSON.stringify(expression)}`);
    }
}
function evaluateFunctionCall(expression, context) {
    function getArgument(index) {
        const argument = expression.arguments[index];
        if (argument) {
            return evaluateExpression(argument, context);
        }
    }
    switch (expression.functionName) {
        case "CONTAINS": {
            const value = getArgument(0);
            const search = getArgument(1);
            if (isString(value) && isString(search)) {
                return value.toLowerCase().includes(search.toLowerCase());
            }
            return false;
        }
        case "STARTS_WITH": {
            const value = getArgument(0);
            const search = getArgument(1);
            if (isString(value) && isString(search)) {
                return value.toLowerCase().startsWith(search.toLowerCase());
            }
            return false;
        }
        case "ENDS_WITH": {
            const value = getArgument(0);
            const search = getArgument(1);
            if (isString(value) && isString(search)) {
                return value.toLowerCase().endsWith(search.toLowerCase());
            }
            return false;
        }
        default: {
            throw new Error(`Unsupported function: ${expression.functionName}`);
        }
    }
}
function evaluateCase(expression, context) {
    const value = expression.value && evaluateExpression(expression.value, context);
    for (const condition of expression.conditions) {
        const when = evaluateExpression(condition.when, context);
        // If there is a value given in the case expression we check for
        // equality. Otherwise, we check if the condition is truthy.
        if (expression.value ? isLooseEqual(when, value) : when) {
            return evaluateExpression(condition.then, context);
        }
    }
    if (expression.else) {
        return evaluateExpression(expression.else, context);
    }
}
function evaluateUnaryOperation(expression, context) {
    const value = evaluateExpression(expression.value, context);
    switch (expression.operator) {
        case UnaryOperator.Not: {
            return !value;
        }
        default: {
            throw new Error(`Unsupported unary operation: ${expression.operator}`);
        }
    }
}
function evaluateBinaryOperation(expression, context) {
    const left = evaluateExpression(expression.left, context);
    const right = evaluateExpression(expression.right, context);
    switch (expression.operator) {
        case BinaryOperator.And: {
            return Boolean(left && right);
        }
        case BinaryOperator.Or: {
            return Boolean(left || right);
        }
        case BinaryOperator.Equals: {
            return isLooseEqual(left, right);
        }
        case BinaryOperator.NotEquals: {
            return !isLooseEqual(left, right);
        }
        case BinaryOperator.LessThan: {
            if (isNumber(left) && isNumber(right)) {
                return left < right;
            }
            if (isValidDate(left) && isValidDate(right)) {
                return left < right;
            }
            return false;
        }
        case BinaryOperator.LessThanOrEqual: {
            if (isNumber(left) && isNumber(right)) {
                return left <= right;
            }
            if (isValidDate(left) && isValidDate(right)) {
                return left <= right;
            }
            return false;
        }
        case BinaryOperator.GreaterThan: {
            if (isNumber(left) && isNumber(right)) {
                return left > right;
            }
            if (isValidDate(left) && isValidDate(right)) {
                return left > right;
            }
            return false;
        }
        case BinaryOperator.GreaterThanOrEqual: {
            if (isNumber(left) && isNumber(right)) {
                return left >= right;
            }
            if (isValidDate(left) && isValidDate(right)) {
                return left >= right;
            }
            return false;
        }
        default: {
            throw new Error(`Unsupported binary operation: ${expression.operator}`);
        }
    }
}
function evaluateTypeCast(expression, context) {
    const value = evaluateExpression(expression.value, context);
    switch (expression.dataType) {
        case "BOOLEAN": {
            return Boolean(value);
        }
        case "NUMBER": {
            if (isNumber(value) && isFinite(value)) {
                return value;
            }
            if (isString(value)) {
                const parsed = parseFloat(value);
                if (isFinite(parsed)) {
                    return parsed;
                }
            }
            return 0;
        }
        case "DATE": {
            if (value instanceof Date)
                return value;
            if (!isString(value) && !isNumber(value)) {
                return undefined;
            }
            return new Date(value);
        }
        case "STRING": {
            return String(value);
        }
        default: {
            throw new Error(`Unsupported type cast: ${expression.dataType}`);
        }
    }
}
/**
 * Creates a string representation of an expression. This is used if there is no
 * alias in a select expression.
 */
function stringifyExpression(expression) {
    switch (expression.type) {
        case "Identifier": {
            return expression.name;
        }
        default: {
            throw new Error(`Can't stringify expression: ${JSON.stringify(expression)}`);
        }
    }
}
/**
 * Checks for equality of two values with the exception that:
 * - null and undefined are equal
 * - strings are case insensitive
 */
function isLooseEqual(left, right) {
    // If both values are nullish (null or undefined) return true.
    if (left == null && right == null) {
        return true;
    }
    if (isString(left) && isString(right)) {
        return left.toLowerCase() === right.toLowerCase();
    }
    if (isValidDate(left) && isValidDate(right)) {
        return left.getTime() === right.getTime();
    }
    return left === right;
}
/** Utility function to create a WHERE expression from path variables. */
export function getWhereExpressionFromPathVariables(pathVariables) {
    const entries = Object.entries(pathVariables).filter(([, value]) => {
        if (isUndefined(value))
            return false;
        if (isObject(value))
            return false;
        return true;
    });
    const expressions = entries.map(([name, value]) => ({
        type: "BinaryOperation",
        operator: BinaryOperator.Equals,
        left: {
            type: "TypeCast",
            value: {
                type: "Identifier",
                name,
            },
            dataType: "STRING",
        },
        right: {
            type: "LiteralValue",
            value: String(value),
        },
    }));
    if (expressions.length === 0) {
        return {
            type: "LiteralValue",
            value: false,
        };
    }
    return expressions.reduce((result, expression) => ({
        type: "BinaryOperation",
        operator: BinaryOperator.And,
        left: result,
        right: expression,
    }));
}
//# sourceMappingURL=useQueryData.js.map