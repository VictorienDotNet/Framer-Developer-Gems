import { MainLoop } from "../../core/Loop.js";
import { RenderEnvironment, RenderTarget } from "../../render/types/RenderEnvironment.js";
import { AnimationDriver } from "./AnimationDriver.js";
/**
 * @internal
 */
export class MainLoopAnimationDriver extends AnimationDriver {
    play() {
        if (RenderEnvironment.target !== RenderTarget.preview) {
            // If we're not in preview mode, don't use the animator,
            // but just call the done callback directly
            this.finishedCallback && this.finishedCallback(false);
            return;
        }
        MainLoop.on("update", this.update);
    }
    cancel() {
        MainLoop.off("update", this.update);
    }
    finish() {
        MainLoop.off("update", this.update);
        super.finish();
    }
}
//# sourceMappingURL=MainLoopDriver.js.map