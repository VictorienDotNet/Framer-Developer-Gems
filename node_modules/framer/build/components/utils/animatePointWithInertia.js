import { animateValue, frame } from "framer-motion";
var AnimationPhase;
(function (AnimationPhase) {
    AnimationPhase[AnimationPhase["None"] = 0] = "None";
    AnimationPhase[AnimationPhase["Running"] = 1] = "Running";
    AnimationPhase[AnimationPhase["Completed"] = 2] = "Completed";
    AnimationPhase[AnimationPhase["Cancelled"] = 3] = "Cancelled";
})(AnimationPhase || (AnimationPhase = {}));
function isRunningAnimation(...phases) {
    let runningAny = false;
    let cancelledAny = false;
    phases.forEach(phase => {
        runningAny = runningAny || phase === AnimationPhase.Running;
        cancelledAny = cancelledAny || phase === AnimationPhase.Cancelled;
    });
    return runningAny && !cancelledAny;
}
function didFinishAnimations(...phases) {
    return phases.every(phase => phase === AnimationPhase.None || phase === AnimationPhase.Completed);
}
const timeConstant = 400;
export function animatePointWithInertia({ from, velocity, onUpdate, onComplete, onStop, }) {
    const latest = from;
    let animationPhaseX = AnimationPhase.None;
    let animationPhaseY = AnimationPhase.None;
    const animations = [];
    const updateHandler = () => {
        if (isRunningAnimation(animationPhaseX, animationPhaseY)) {
            onUpdate(latest);
        }
    };
    const completionHandler = () => {
        if (didFinishAnimations(animationPhaseX, animationPhaseY)) {
            onComplete();
        }
    };
    if (velocity.x) {
        animationPhaseX = AnimationPhase.Running;
        animations.push(animateValue({
            keyframes: [from.x],
            velocity: -velocity.x,
            timeConstant,
            onUpdate: value => {
                latest.x = value;
                frame.update(updateHandler, false, true);
            },
            onComplete: () => {
                if (animationPhaseX !== AnimationPhase.Running) {
                    throw Error("animation x should be running when completing");
                }
                animationPhaseX = AnimationPhase.Completed;
                completionHandler();
            },
        }));
    }
    if (velocity.y) {
        animationPhaseY = AnimationPhase.Running;
        animations.push(animateValue({
            keyframes: [from.y],
            velocity: -velocity.y,
            timeConstant,
            onUpdate: value => {
                latest.y = value;
                frame.update(updateHandler, false, true);
            },
            onComplete: () => {
                if (animationPhaseY !== AnimationPhase.Running) {
                    throw Error("animation y should be running when completing");
                }
                animationPhaseY = AnimationPhase.Completed;
                completionHandler();
            },
        }));
    }
    if (!isRunningAnimation(animationPhaseX, animationPhaseY)) {
        completionHandler();
    }
    return {
        stop: () => {
            if (!isRunningAnimation(animationPhaseX, animationPhaseY))
                return;
            animations.forEach(animation => animation.stop());
            animationPhaseX = animationPhaseX === AnimationPhase.Running ? AnimationPhase.Cancelled : animationPhaseX;
            animationPhaseY = animationPhaseY === AnimationPhase.Running ? AnimationPhase.Cancelled : animationPhaseY;
            onStop();
        },
    };
}
//# sourceMappingURL=animatePointWithInertia.js.map