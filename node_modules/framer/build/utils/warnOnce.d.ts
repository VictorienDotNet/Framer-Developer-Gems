/** Report a warning to the console, but only once. The first string becomes the
 * key to suppress this and other warnings, so make sure it is fairly unique.
 *
 * Note, it is best to not use string interpolation, instead pass in multiple
 * fragments.
 */
export declare function warnOnce(keyMessage: string, ...rest: unknown[]): void;
//# sourceMappingURL=warnOnce.d.ts.map