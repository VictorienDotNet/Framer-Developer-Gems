// https://stackoverflow.com/a/7616484
export const hash = (value) => {
    let hasher = 0, i, chr;
    if (value.length === 0)
        return hasher;
    for (i = 0; i < value.length; i++) {
        chr = value.charCodeAt(i);
        hasher = (hasher << 5) - hasher + chr;
        hasher |= 0; // Convert to 32bit integer
    }
    return hasher;
};
//# sourceMappingURL=string.js.map