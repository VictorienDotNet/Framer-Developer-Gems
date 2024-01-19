import { roundedNumberString } from "./roundedNumber.js";
/** @internal */
export function transformString(transform) {
    if (transform === undefined) {
        return undefined;
    }
    const { x, y, rotation, width, height } = transform;
    let result;
    if (x !== 0 || y !== 0) {
        result = `translate(${roundedNumberString(x, 3)} ${roundedNumberString(y, 3)})`;
    }
    if (rotation !== 0) {
        const roundedRotation = roundedNumberString(rotation, 4);
        const roundedWidth = roundedNumberString(width / 2, 3);
        const roundedHeight = roundedNumberString(height / 2, 3);
        const rotationString = `rotate(${roundedRotation} ${roundedWidth} ${roundedHeight})`;
        result = result ? `${result} ${rotationString}` : rotationString;
    }
    return result;
}
//# sourceMappingURL=transformString.js.map