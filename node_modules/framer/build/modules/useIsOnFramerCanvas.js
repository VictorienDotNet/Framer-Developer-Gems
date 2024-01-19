import { RenderTarget } from "../render/types/RenderEnvironment.js";
/**
 * Returns a constant value based on whether the caller is mounted in a Framer
 * Canvas environment.
 *
 * @public
 */
export function useIsOnFramerCanvas() {
    return RenderTarget.current() === RenderTarget.canvas;
}
//# sourceMappingURL=useIsOnFramerCanvas.js.map