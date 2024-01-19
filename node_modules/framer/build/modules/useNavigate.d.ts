/**
 * A wrapper around the Router API to provide backwards compatibilty for
 * generated components that depend on the `useNavigate` export from "framer",
 * instead of the `useRoute` that is currently used
 *
 * @internal
 */
export declare function useNavigate(): (() => void) | ((target: string) => false | undefined);
//# sourceMappingURL=useNavigate.d.ts.map