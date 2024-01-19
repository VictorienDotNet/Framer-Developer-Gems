export function extractStyleFromProps(props, name, styleRef, into) {
    if (into === undefined) {
        into = name;
    }
    if (props[name] !== undefined) {
        // @ts-ignore Work around a “union type that is too complex to represent” error
        styleRef[into] = props[name];
        return;
    }
}
//# sourceMappingURL=extractStyleFromProps.js.map