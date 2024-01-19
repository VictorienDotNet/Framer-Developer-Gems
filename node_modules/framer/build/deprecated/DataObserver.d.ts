import type { Cancel } from "../animation/Animatable/Animatable.js";
import React, { Component } from "react";
/**
 * @deprecated
 * @internal
 */
export interface Props {
}
/**
 * @deprecated
 * @internal
 */
export interface State {
    update: number;
}
/**
 * @deprecated
 * @internal
 */
export declare const DataObserverContext: React.Context<{
    update: number;
}>;
/**
 * Makes the component re-render when `Data` changes
 * @returns `true` if observing succeeds (context is provided), `false` when it fails
 * @public
 */
export declare function useObserveData(): boolean;
/**
 * @deprecated
 * @internal
 */
export declare class DataObserver extends Component<Props & {
    children?: React.ReactNode;
}, State> {
    observers: Cancel[];
    state: {
        update: number;
    };
    taskAdded: boolean;
    frameTask: () => void;
    observer: () => void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
//# sourceMappingURL=DataObserver.d.ts.map