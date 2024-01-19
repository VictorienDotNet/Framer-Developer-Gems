import { resolveMotionValue } from "framer-motion";
import { Animatable } from "../../animation/Animatable/Animatable.js";
import { isFiniteNumber } from "../../render/utils/isFiniteNumber.js";
import { RenderEnvironment, RenderTarget } from "../types/RenderEnvironment.js";
const { getNumber } = Animatable;
export const transformDefaults = {
    z: 0,
    rotation: 0,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    scale: 1,
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
    skew: 0,
    skewX: 0,
    skewY: 0,
    originX: 0.5,
    originY: 0.5,
    originZ: 0,
};
function getRotation(rotation, rotate) {
    if (typeof rotate === "string") {
        rotate = parseFloat(rotate);
    }
    return isFiniteNumber(rotate) ? rotate : getNumber(rotation);
}
export function collectTransformFromProps(props, rect, style) {
    const motionStyle = style;
    // 3d properties
    const x = typeof rect.x === "number" ? `${rect.x}px` : rect.x;
    const y = typeof rect.y === "number" ? `${rect.y}px` : rect.y;
    const z = getNumber(props.z);
    const scaleZ = getNumber(props.scaleZ);
    const originZ = getNumber(props.originZ);
    const rotationZ = getRotation(props.rotationZ, resolveMotionValue(motionStyle.rotateZ));
    const rotationX = getRotation(props.rotationX, resolveMotionValue(motionStyle.rotateX));
    const rotationY = getRotation(props.rotationY, resolveMotionValue(motionStyle.rotateY));
    const scale = getNumber(props.scale);
    const scaleX = getNumber(props.scaleX);
    const scaleY = getNumber(props.scaleY);
    const skew = getNumber(props.skew);
    const skewX = getNumber(props.skewX);
    const skewY = getNumber(props.skewY);
    const rotation = getRotation(props.rotation, resolveMotionValue(motionStyle.rotate));
    // while exporting, using 3d transforms reduces artefacts in filters
    const force3d = RenderEnvironment.target === RenderTarget.export;
    if (force3d || z !== 0 || scaleZ !== 1 || originZ !== 0 || rotationZ !== 0 || rotationX !== 0 || rotationY !== 0) {
        style.transform = `
            ${`translate3d(${x}, ${y}, ${z}px)`}
            scale3d(${scaleX * scale}, ${scaleY * scale}, ${scaleZ})
            skew(${skew}deg,${skew}deg)
            skewX(${skewX}deg)
            skewY(${skewY}deg)
            translateZ(${originZ}px)
            rotateX(${rotationX}deg)
            rotateY(${rotationY}deg)
            rotateZ(${(rotation + rotationZ).toFixed(4)}deg)
            translateZ(${-originZ}px)`;
    }
    else {
        style.transform = `
            ${`translate(${x}, ${y})`}
            scale(${scaleX * scale}, ${scaleY * scale})
            skew(${skew}deg,${skew}deg)
            skewX(${skewX}deg)
            skewY(${skewY}deg)
            rotate(${rotation.toFixed(4)}deg)`;
    }
    const transformOrigin = `${getNumber(props.originX) * 100}% ${getNumber(props.originY) * 100}%`;
    style.transformOrigin = transformOrigin;
    style.WebkitTransformOrigin = transformOrigin;
}
//# sourceMappingURL=Transform.js.map