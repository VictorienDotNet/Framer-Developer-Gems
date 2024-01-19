/**
 * @internal
 */
export class AnimationDriver {
    animator;
    updateCallback;
    finishedCallback;
    constructor(animator, updateCallback, finishedCallback) {
        this.animator = animator;
        this.updateCallback = updateCallback;
        this.finishedCallback = finishedCallback;
        if (!this.animator.isReady()) {
            // eslint-disable-next-line no-console
            console.warn("AnimationDriver initialized with animator that isn't ready");
        }
    }
    update = (frame, elapsed) => {
        if (this.animator.isFinished()) {
            this.finish();
        }
        else {
            const value = this.animator.next(elapsed);
            this.updateCallback(value);
        }
    };
    finish() {
        if (this.finishedCallback) {
            this.finishedCallback(this.animator.isFinished());
        }
    }
    isFinished() {
        return this.animator.isFinished();
    }
}
//# sourceMappingURL=AnimationDriver.js.map