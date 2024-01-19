// NOTE: This file is a copy of `framerjs/shared/src/assert.ts` this was done to
// prevent pulling in files from outside library.
/**
 * Throws an error when the condition is falsy, optionally pass in a message to
 * describe the error.
 *
 * Best to use asserts where data is about to be stored. Then errors are caught
 * early, close to the cause. Otherwise data with broken expectation might hang
 * around, only to cause errors when used later on, with no pointer back to what
 * caused that bad state.
 *
 * Note that when an assert fails, consider that a fatal error caused by buggy
 * code. The program should halt, or perhaps do some kind of high level
 * recovery, and the bug should be reported and fixed. Asserts are not well
 * suited to use as defensive programming, but are good to use to quickly
 * highlight mistakes while writing new code.
 *
 * Also note asserts should not have side effects, the program should continue
 * to work when asserts are compiled away. Because asserts might be compiled
 * away in production code.
 *
 * And finally, both the condition should be cheap, and the message should not
 * do string interpolation, instead you can pass in multiple parts of the
 * message.
 */
export function assert(condition, ...msg) {
    if (condition)
        return;
    const e = Error("Assertion Error" + (msg.length > 0 ? ": " + msg.join(" ") : ""));
    // Hack the stack so the assert call itself disappears. Works in jest and in chrome.
    if (e.stack) {
        try {
            const lines = e.stack.split("\n");
            if (lines[1]?.includes("assert")) {
                lines.splice(1, 1);
                e.stack = lines.join("\n");
            }
            else if (lines[0]?.includes("assert")) {
                lines.splice(0, 1);
                e.stack = lines.join("\n");
            }
        }
        catch {
            // nothing
        }
    }
    throw e;
}
/**
 * Asserts that a code path is never entered. Additionally, asserts that the provided
 * value is evaluated to `never` by the type system, which means all possible discrete
 * types have been exhaustively checked by the time this statement is reached.
 */
export function assertNever(x, error) {
    throw error || new Error(x ? `Unexpected value: ${x}` : "Application entered invalid state");
}
//# sourceMappingURL=assert.js.map