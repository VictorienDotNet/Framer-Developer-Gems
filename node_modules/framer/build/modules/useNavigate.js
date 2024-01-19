import { useRouter } from "../router/index.js";
import { useIsOnFramerCanvas } from "./useIsOnFramerCanvas.js";
/**
 * A wrapper around the Router API to provide backwards compatibilty for
 * generated components that depend on the `useNavigate` export from "framer",
 * instead of the `useRoute` that is currently used
 *
 * @internal
 */
export function useNavigate() {
    const { navigate } = useRouter();
    const onCanvas = useIsOnFramerCanvas();
    if (!navigate)
        return () => { };
    return (target) => {
        if (onCanvas)
            return;
        navigate(target);
        // Return false to prevent smart components from proceeding with their event execution.
        return false;
    };
}
//# sourceMappingURL=useNavigate.js.map