import type { Locale } from "../router/index.js";
import { LazyValue } from "./LazyValue.js";
/**
 * This file defines a query hook to query the CMS with SQL. The query is
 * defined in an AST form of the SQLite select statement
 * https://www.sqlite.org/lang_select.html.
 *
 * Currently, not every feature is implemented. When implementing a new feature
 * it's best to look at the SQLite documentation and add the necessary AST
 * nodes.
 *
 * Features that are not supported by SQLite can be implemented by using a
 * function call. For example STARTS_WITH(title, "Hello"), ENDS_WITH(title,
 * "world"), and CONTAINS(answer, "42").
 */
export type Collection = Record<string, LazyValue<unknown> | unknown>[];
interface LocalizedCollection {
    read(locale?: Locale): Collection;
    preload(locale?: Locale): Promise<void> | undefined;
}
interface From {
    type: "Collection";
    locale?: Locale;
    data: Collection | LocalizedCollection;
}
/** A DeepWeakMap is a WeakMap of WeakMaps. */
export declare class DeepWeakMap<Key1 extends object, Key2 extends object, Value> {
    private readonly map1;
    get(key1: Key1, key2: Key2): Value | undefined;
    set(key1: Key1, key2: Key2, value: Value): WeakMap<Key2, Value>;
}
/**
 * An identifier that can be resolved within a specific context. Currently, only
 * fields (columns) of an item (row) can be resolved:
 * - id
 * - name
 * - title
 */
interface Identifier {
    type: "Identifier";
    name: string;
}
/**
 * A literal value:
 * - true
 * - "string"
 * - 123
 */
interface LiteralValue {
    type: "LiteralValue";
    value: unknown;
}
/**
 * A function call:
 * - STARTS_WITH(title, "Hello")
 * - ENDS_WITH(title, "world")
 * - CONTAINS(name, "Smith")
 */
interface FunctionCall {
    type: "FunctionCall";
    functionName: string;
    arguments: Expression[];
}
/**
 * A case expression:
 * CASE city
 *   WHEN "Amsterdam" THEN 921402
 *   WHEN "Berlin" THEN 3677472
 *   ELSE 0
 * END
 */
interface Case {
    type: "Case";
    value?: Expression;
    conditions: Condition[];
    else?: Expression;
}
interface Condition {
    type: "Condition";
    when: Expression;
    then: Expression;
}
/**
 * A unary operation:
 * - NOT true
 * - NOT featured
 */
interface UnaryOperation {
    type: "UnaryOperation";
    operator: UnaryOperator;
    value: Expression;
}
export declare enum UnaryOperator {
    Not = "not"
}
/**
 * A binary operation:
 * - true AND true
 * - true OR false
 * - true == true.
 * - 13.37 < 1337
 */
interface BinaryOperation {
    type: "BinaryOperation";
    operator: BinaryOperator;
    left: Expression;
    right: Expression;
}
export declare enum BinaryOperator {
    And = "and",
    Or = "or",
    Equals = "==",
    NotEquals = "!=",
    LessThan = "<",
    LessThanOrEqual = "<=",
    GreaterThan = ">",
    GreaterThanOrEqual = ">="
}
/**
 * A type cast:
 * - CAST(0 as BOOLEAN)
 * - CAST(42 as STRING)
 * - CAST("42" as NUMBER)
 */
interface TypeCast {
    type: "TypeCast";
    dataType: string;
    value: Expression;
}
export type Expression = Identifier | LiteralValue | FunctionCall | Case | UnaryOperation | BinaryOperation | TypeCast;
type SelectExpression = Expression & {
    alias?: string;
};
export declare enum OrderDirection {
    Ascending = "asc",
    Descending = "desc"
}
type OrderExpression = Expression & {
    direction?: OrderDirection;
};
export interface Query {
    from: From;
    select: SelectExpression[];
    where?: Expression;
    orderBy?: OrderExpression[];
    limit?: Expression;
    offset?: Expression;
}
/** @internal */
export declare function useQueryData(query: Query): Collection;
interface ExpressionContext {
    resolveIdentifier(identifier: string): unknown;
}
export declare function evaluateExpression(expression: Expression, context: ExpressionContext): unknown;
/** Utility function to create a WHERE expression from path variables. */
export declare function getWhereExpressionFromPathVariables(pathVariables: Record<string, unknown>): Identifier | LiteralValue | FunctionCall | Case | UnaryOperation | BinaryOperation | TypeCast | {
    type: string;
    value: boolean;
};
export {};
//# sourceMappingURL=useQueryData.d.ts.map