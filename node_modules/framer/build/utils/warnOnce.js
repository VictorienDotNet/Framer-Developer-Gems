/* eslint-disable no-console */
const warningMessages = new Set();
/** Report a warning to the console, but only once. The first string becomes the
 * key to suppress this and other warnings, so make sure it is fairly unique.
 *
 * Note, it is best to not use string interpolation, instead pass in multiple
 * fragments.
 */
export function warnOnce(keyMessage, ...rest) {
    if (warningMessages.has(keyMessage))
        return;
    warningMessages.add(keyMessage);
    console.warn(keyMessage, ...rest);
}
//# sourceMappingURL=warnOnce.js.map