import React from "react";
type PresetProps = Record<string, unknown>;
type ComponentPresets = Record<string, PresetProps>;
interface ProviderProps {
    presets: ComponentPresets;
    children?: React.ReactNode;
}
export declare function ComponentPresetsProvider({ presets, children }: ProviderProps): JSX.Element;
interface ConsumerProps {
    componentIdentifier: string;
    children: (props: PresetProps) => React.ReactNode;
}
export declare function ComponentPresetsConsumer({ componentIdentifier, children }: ConsumerProps): React.ReactNode;
export {};
//# sourceMappingURL=ComponentPresetsContext.d.ts.map