/** Copy of nodeIDFromString() in Vekter NodeID.ts module */
export function nodeIdFromString(str) {
    return str.replace(/^id_/, "").replace(/\\/g, "");
}
//# sourceMappingURL=nodeIdFromString.js.map