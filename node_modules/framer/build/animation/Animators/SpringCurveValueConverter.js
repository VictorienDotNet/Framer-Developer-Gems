const epsilon = 0.001;
const minDuration = 0.01;
const maxDuration = 10.0;
const minDamping = Number.MIN_VALUE;
const maxDamping = 1;
// Newton's method
function approximateRoot(func, derivative, initialGuess, times = 12) {
    let result = initialGuess;
    for (let i = 1, end = times, asc = 1 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
        result = result - func(result) / derivative(result);
    }
    return result;
}
function angularFrequency(undampedFrequency, dampingRatio) {
    return undampedFrequency * Math.sqrt(1 - Math.pow(dampingRatio, 2));
}
export const SpringCurveValueConverter = {
    computeDampingRatio: (tension, friction, mass = 1) => {
        return friction / (2 * Math.sqrt(mass * tension));
    },
    // Tries to compute the duration of a spring,
    // but can't for certain velocities and if dampingRatio >= 1
    // In those cases it will return null
    computeDuration: (tension, friction, velocity = 0, mass = 1) => {
        let duration;
        const dampingRatio = SpringCurveValueConverter.computeDampingRatio(tension, friction);
        const undampedFrequency = Math.sqrt(tension / mass);
        // This is basically duration extracted out of the envelope functions
        if (dampingRatio < 1) {
            const a = Math.sqrt(1 - Math.pow(dampingRatio, 2));
            const b = velocity / (a * undampedFrequency);
            const c = dampingRatio / a;
            const d = -((b - c) / epsilon);
            if (d <= 0) {
                return null;
            }
            duration = Math.log(d) / (dampingRatio * undampedFrequency);
        }
        else {
            return null;
        }
        return duration;
    },
    computeDerivedCurveOptions: (dampingRatio, duration, velocity = 0, mass = 1) => {
        let derivative, envelope;
        dampingRatio = Math.max(Math.min(dampingRatio, maxDamping), minDamping);
        duration = Math.max(Math.min(duration, maxDuration), minDuration);
        if (dampingRatio < 1) {
            envelope = function (envelopeUndampedFrequency) {
                const exponentialDecay = envelopeUndampedFrequency * dampingRatio;
                const currentDisplacement = exponentialDecay * duration;
                const a = exponentialDecay - velocity;
                const b = angularFrequency(envelopeUndampedFrequency, dampingRatio);
                const c = Math.exp(-currentDisplacement);
                return epsilon - (a / b) * c;
            };
            derivative = function (derivativeUndampedFrequency) {
                const exponentialDecay = derivativeUndampedFrequency * dampingRatio;
                const currentDisplacement = exponentialDecay * duration;
                const d = currentDisplacement * velocity + velocity;
                const e = Math.pow(dampingRatio, 2) * Math.pow(derivativeUndampedFrequency, 2) * duration;
                const f = Math.exp(-currentDisplacement);
                const g = angularFrequency(Math.pow(derivativeUndampedFrequency, 2), dampingRatio);
                const factor = -envelope(derivativeUndampedFrequency) + epsilon > 0 ? -1 : 1;
                return (factor * ((d - e) * f)) / g;
            };
        }
        else {
            envelope = function (envelopeUndampedFrequency) {
                const a = Math.exp(-envelopeUndampedFrequency * duration);
                const b = (envelopeUndampedFrequency - velocity) * duration + 1;
                return -epsilon + a * b;
            };
            derivative = function (derivativeUndampedFrequency) {
                const a = Math.exp(-derivativeUndampedFrequency * duration);
                const b = (velocity - derivativeUndampedFrequency) * Math.pow(duration, 2);
                return a * b;
            };
        }
        const result = {
            tension: 100,
            friction: 10,
            velocity,
        };
        const initialGuess = 5 / duration;
        const undampedFrequency = approximateRoot(envelope, derivative, initialGuess);
        if (!isNaN(undampedFrequency)) {
            result.tension = Math.pow(undampedFrequency, 2) * mass;
            result.friction = dampingRatio * 2 * Math.sqrt(mass * result.tension);
        }
        return result;
    },
};
//# sourceMappingURL=SpringCurveValueConverter.js.map