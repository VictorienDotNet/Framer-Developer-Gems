import type { Transition } from "framer-motion";
/** @public */
export type PropertyControls<ComponentProps = any, ArrayTypes = any> = {
    [K in keyof ComponentProps]?: ControlDescription<Partial<ComponentProps>>;
};
/**
 * Object sub type
 * Currently not supported: component instance, and event handler.
 * @public
 */
export type ObjectPropertyControlDescription<P = any> = NumberControlDescription<P> | EnumControlDescription<P> | BooleanControlDescription<P> | StringControlDescription<P> | RichTextControlDescription<P> | ColorControlDescription<P> | SegmentedEnumControlDescription<P> | ImageControlDescription<P> | ResponsiveImageControlDescription<P> | FileControlDescription<P> | TransitionControlDescription<P> | LinkControlDescription<P> | DateControlDescription<P> | ArrayControlDescription<P> | ObjectControlDescription<P> | FusedNumberControlDescription<P> | FontControlDescription<P> | PageScopeControlDescription<P>;
/**
 * Array sub type
 * @public
 */
export type ArrayItemControlDescription<P = any> = Omit<NumberControlDescription<P>, "hidden" | "description"> | Omit<EnumControlDescription<P>, "hidden" | "description"> | Omit<BooleanControlDescription<P>, "hidden" | "description"> | Omit<StringControlDescription<P>, "hidden" | "description"> | Omit<RichTextControlDescription<P>, "hidden" | "description"> | Omit<ColorControlDescription<P>, "hidden" | "description" | "optional"> | Omit<SegmentedEnumControlDescription<P>, "hidden" | "description"> | Omit<ImageControlDescription<P>, "hidden" | "description"> | Omit<ResponsiveImageControlDescription<P>, "hidden" | "description"> | Omit<FileControlDescription<P>, "hidden" | "description"> | Omit<ComponentInstanceDescription<P>, "hidden" | "description"> | Omit<TransitionControlDescription<P>, "hidden" | "description"> | Omit<LinkControlDescription<P>, "hidden" | "description"> | Omit<DateControlDescription<P>, "hidden" | "description"> | Omit<ObjectControlDescription<P>, "hidden" | "description" | "optional">;
/** @public */
export type ControlDescription<P = any> = NumberControlDescription<P> | EnumControlDescription<P> | BooleanControlDescription<P> | StringControlDescription<P> | RichTextControlDescription<P> | ColorControlDescription<P> | FusedNumberControlDescription<P> | SegmentedEnumControlDescription<P> | ImageControlDescription<P> | ResponsiveImageControlDescription<P> | FileControlDescription<P> | ComponentInstanceDescription<P> | ArrayControlDescription<P> | EventHandlerControlDescription<P> | TransitionControlDescription<P> | LinkControlDescription<P> | DateControlDescription<P> | ObjectControlDescription<P> | FontControlDescription<P> | PageScopeControlDescription<P>;
/**
 * Used by the {@link PropertyControls} and specifies the type of user interface for receiving
 * input. Each field has a distinct set of properties though they all accept `title` and `hidden`
 * properties.
 *
 * @remarks
 * ```javascript
 * export function MyComponent({ title }) {
 *   return <Frame size={"100%"}>{title}</Frame>
 * }
 *
 * addPropertyControls(MyComponent, {
 *   title: {
 *     type: ControlType.String,
 *     title: "Title",
 *     hidden: (props) => true
 *   },
 * }
 * ```
 * @public
 */
export declare enum ControlType {
    /**
     * A control that displays an on / off checkbox. The associated property will be `true` or `false`,
     * depending on the state of the checkbox. Includes an optional `defaultValue`, which is set to `true` by default. You can also customize the labels displayed in the property panel with the `enabledTitle` and `disabledTitle` properties.
     *
     * @remarks
     * ```javascript
     * export function MyComponent(props) {
     *   return <Frame size={"100%"}>{props.showText ? "Hello World" : null}</Frame>
     * }
     *
     * addPropertyControls(MyComponent, {
     *   showText: {
     *     type: ControlType.Boolean,
     *     title: "Show Text",
     *     defaultValue: true,
     *     enabledTitle: "On",
     *     disabledTitle: "Off",
     *   },
     * })
     * ```
     */
    Boolean = "boolean",
    /**
     * A control that accepts any numeric value. This will be provided directly as a property.
     * Will display an input field with a range slider by default. The
     * `displayStepper` option can be enabled to include a stepper control instead.
     *
     * @remarks
     * ```javascript
     * export function MyComponent(props) {
     *   return <Frame rotateZ={props.rotation} size={"100%"}>{rotation}</Frame>
     * }
     *
     * addPropertyControls(MyComponent, {
     *   rotation: {
     *     type: ControlType.Number,
     *     defaultValue: 0,
     *     min: 0,
     *     max: 360,
     *     unit: "deg",
     *     step: 0.1,
     *     displayStepper: true,
     *   },
     * })
     * ```
     */
    Number = "number",
    /**
     * A control that accepts plain text values. This will be provided directly as a property.
     * Will display an input field with an optional placeholder value.
     * If `obscured` attribute is set to true a password input field will be used instead of a regular text input
     * so that the value in the input will be visually obscured, yet still be available as plain text inside the component.
     * `displayTextArea` can be enabled to display a multi-line input area instead.
     *
     * @remarks
     * ```javascript
     * export function MyComponent(props) {
     *   return <Frame>{props.title} — {props.body}</Frame>
     * }
     *
     * addPropertyControls(MyComponent, {
     *   title: {
     *     type: ControlType.String,
     *     defaultValue: "Framer",
     *     placeholder: "Type something…",
     *   },
     *   body: {
     *     type: ControlType.String,
     *     defaultValue: "Lorem ipsum dolor sit amet.",
     *     placeholder: "Type something…",
     *     displayTextArea: true,
     *   },
     * })
     * ```
     */
    String = "string",
    /**
     * @internal
     * This is used by framer internally. Use at your own risk. Will contain a string with html
     * markup containing h1, h2, etc., paragraphs, and inline styles.
     */
    RichText = "richtext",
    /**
     * A control that can be used to take a single number or four distinct
     * numeric input fields. The typical use case for this control is for visual
     * properties like border, padding or margin. It will display an input field
     * to accept a single value, alongside a segmented control allowing four
     * distinct values to be provided.
     *
     * You can also set the default value for each valueKey as well as the
     * toggleKey by setting their values on `defaultProps`.
     *
     *
     * ```javascript
     * export function MyComponent({
     *   radius = 50,
     *   topLeft,
     *   topRight,
     *   bottomRight,
     *   bottomLeft,
     *   isMixed = false,
     * }) {
     *   const borderRadius = isMixed
     *     ? `${topLeft}px ${topRight}px ${bottomRight}px ${bottomLeft}px`
     *     : `${radius}px`
     *   return <Frame background={"red"} borderRadius={borderRadius} size={"100%"}></Frame>
     * }
     *
     * addPropertyControls(MyComponent, {
     *   radius: {
     *     type: ControlType.FusedNumber,
     *     title: "Radius",
     *     defaultValue: 50,
     *     toggleKey: "isMixed",
     *     toggleTitles: ["All", "Individual"],
     *     valueKeys: ["topLeft", "topRight", "bottomRight", "bottomLeft"],
     *     valueLabels: ["NW", "NE", "SE", "SW"],
     *     min: 0,
     *   },
     * })
     *
     * // Set the default value for each valueKey as well as the toggleKey by setting their values on `defaultProps`:
     * MyComponent.defaultProps = {
     *     radius: 10,
     *     isMixed: true,
     *     topLeft: 5,
     *     topRight: 15,
     *     bottomRight: 5,
     *     bottomLeft: 15,
     * }
     * ```
     */
    FusedNumber = "fusednumber",
    /**
     * A property control that represents a list of options. The list contains primitive values and each
     * value has to be unique. The selected option will be provided as a property. This control is displayed
     * as a dropdown menu in which a user can select one of the items.
     * `displaySegmentedControl` can be enabled to display a segmented control instead.
     *
     * ```javascript
     * export function MyComponent(props) {
     *   const value = props.value || "a"
     *   const colors = { a: "red", b: "green", c: "blue" }
     *   return <Frame background={colors[value]} size={"100%"}>{value}</Frame>
     * }
     *
     * addPropertyControls(MyComponent, {
     *   value: {
     *     type: ControlType.Enum,
     *     defaultValue: "a",
     *     options: ["a", "b", "c"],
     *     optionTitles: ["Option A", "Option B", "Option C"],
     *   },
     * })
     * ```
     */
    Enum = "enum",
    /**
     * Deprecated, please use {@link ControlType.Enum} and enable displaySegmentedControl.
     *
     * @deprecated Please use {@link ControlType.Enum} and enable displaySegmentedControl.
     * @remarks
     * ```javascript
     * export function MyComponent(props) {
     *   const value = props.value || "a"
     *   const colors = { a: "red", b: "green", c: "blue" }
     *   return <Frame background={colors[value]} size={"100%"}>{value}</Frame>
     * }
     *
     * addPropertyControls(MyComponent, {
     *   value: {
     *     type: ControlType.SegmentedEnum,
     *     defaultValue: "a",
     *     options: ["a", "b", "c"],
     *     optionTitles: ["A", "B", "C"],
     *   },
     * })
     * ```
     */
    SegmentedEnum = "segmentedenum",
    /**
     * A control that represents a color value. It will be included in the component props as a string.
     * This control is displayed as a color field and will provide the selected color in either
     * HEX (`"#fff"`) or HSL (`hsla(203, 87%, 50%, 0.5)`) notation, depending on
     * whether there is an alpha channel.
     *
     * @remarks
     * ```javascript
     * function MyComponent(props) {
     *   return <Frame background={props.background} size={"100%"} />
     * }
     *
     * addPropertyControls(MyComponent, {
     *   background: {
     *     type: ControlType.Color,
     *     defaultValue: "#fff",
     *   },
     * })
     * ```
     */
    Color = "color",
    /**
     * Deprecated, please use {@link ControlType.ResponsiveImage}’s `src` field instead.
     *
     * @deprecated Please use {@link ControlType.ResponsiveImage}’s `src` field instead.
     */
    Image = "image",
    /**
     * A control that allows the user to pick an image resource. Displayed as an image picker
     * with associated file picker.
     *
     * The chosen image will be provided in the component props as an object with `src` and `srcSet` properties:
     * - `src`: a string containing the URL of a full resolution image
     * - `srcSet`: an optional string with scaled down image variants. This is typically passed into [`<img srcSet>`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/srcset)
     *   and helps the browser to load a smaller image when a full-size one isn’t necessary.
     * - `alt`: an optional description of the image.
     *
     * @remarks
     * ```javascript
     * function MyComponent(props) {
     *   return <img src={props.image.src} srcSet={props.image.srcSet} alt={props.image.alt} />
     * }
     *
     * addPropertyControls(MyComponent, {
     *   image: {
     *     type: ControlType.ResponsiveImage,
     *   }
     * })
     * ```
     */
    ResponsiveImage = "responsiveimage",
    /**
     * A control that allows the user to pick a file resource. It will be
     * included in the component props as an URL string.
     * Displayed as an file picker that will open a native file browser. The
     * selected file will be provided as a fully qualified URL. The
     * `allowedFileTypes` property must be provided to specify acceptable file
     * types.
     *
     * @remarks
     * ```javascript
     * export function MyComponent(props) {
     *   return (
     *     <Frame size={"100%"}>
     *       <video
     *         style={{ objectFit: "contain", props.width, props.height }}
     *         src={props.filepath}
     *         controls
     *       />
     *     </Frame>
     *   )
     * }
     *
     * addPropertyControls(MyComponent, {
     *   filepath: {
     *     type: ControlType.File,
     *     allowedFileTypes: ["mov"],
     *   },
     * })
     * ```
     */
    File = "file",
    /**
     * A control that references to another component on the canvas,
     * included in the component props as a React node.
     * The component will have an outlet to allow linking to other Frames.
     * Available Frames will also be displayed in a dropdown menu in the
     * properties panel. The component reference will be provided as a property.
     * As a convention, the name for the property is usually just `children`.
     *
     * Multiple components can be linked by combining the `ComponentInstance`
     * type with the {@link ControlType.Array}.
     *
     * ```javascript
     * export function MyComponent(props) {
     *   return <Stack size={"100%"}>{props.children}</Stack>
     * }
     *
     * addPropertyControls(MyComponent, {
     *   children: {
     *     type: ControlType.ComponentInstance,
     *   },
     * })
     * ```
     */
    ComponentInstance = "componentinstance",
    /**
     * A control that allows multiple values per `ControlType`, provided as an
     * array via properties. For most control types this will be displayed as an
     * additional section in the properties panel allowing as many fields to be
     * provided as required.
     *
     * For a {@link ControlType.ComponentInstance} the Frame will also gain an
     * additional outlet control on the Canvas that allows links to be created
     * between frames.
     *
     * Group properties together by using an object control.
     *
     * For multiple {@link ControlType.FusedNumber} values, you can pass in an
     * array of single values as the React default prop.
     *
     * ```javascript
     * export function MyComponent(props) {
     *   const frames = props.images.map(image => <Frame image={image} width={"1fr"} height={"1fr"} />)
     *   return <Stack size={"100%"}>{frames}</Stack>
     * }
     *
     * // Add a repeatable image property control
     * addPropertyControls(MyComponent, {
     *   images: {
     *     type: ControlType.Array,
     *     control: {
     *       type: ControlType.Image
     *     }
     *   },
     *   // Allow up to five items
     *   maxCount: 5,
     * })
     *
     * // Add a multi-connector to your component to connect components on the canvas
     * addPropertyControls(MyComponent, {
     *   children: {
     *     type: ControlType.Array,
     *     control: {
     *       type: ControlType.ComponentInstance
     *     },
     *     maxCount: 5,
     *   },
     * })
     *
     * // Add a list of objects
     * addPropertyControls(MyComponent, {
     *   myArray: {
     *     type: ControlType.Array,
     *     control: {
     *       type: ControlType.Object,
     *       controls: {
     *         title: { type: ControlType.String, defaultValue: "Employee" },
     *         avatar: { type: ControlType.Image },
     *       },
     *     },
     *     defaultValue: [
     *       { title: "Jorn" },
     *       { title: "Koen" },
     *     ],
     *   },
     * })
     *
     * // For multiple values, you can pass in an array of single values as the React default prop.
     * MyComponent.defaultProps = {
     *    paddings: [5, 10, 15],
     * }
     * ```
     *
     */
    Array = "array",
    /**
     * A control that exposes events in the prototyping panel within the Framer UI. When choosing an event from the prototyping panel, you can select from a list of actions to trigger.
     *
     * ```javascript
     * export function MyComponent(props) {
     *   return <Frame onTap={props.onTap} size={"100%"} />
     * }
     *
     * addPropertyControls(MyComponent, {
     *   onTap: {
     *     type: ControlType.EventHandler,
     *   },
     * })
     * ```
     */
    EventHandler = "eventhandler",
    /**
     * A control that allows for editing Framer Motion transition options within the Framer UI.
     *
     * ```javascript
     * export function MyComponent(props) {
     *   return (
     *       <Frame
     *          animate={{ scale: 2 }}
     *          transition={props.transition}
     *       />
     *   )
     * }
     *
     * addPropertyControls(MyComponent, {
     *   transition: {
     *       type: ControlType.Transition,
     *   },
     * })
     * ```
     */
    Transition = "transition",
    /**
     * A control that allows for exposing web links.
     *
     * ```javascript
     * export function MyComponent(props) {
     *   return <a href={props.link}>My Link</a>
     * }
     *
     * addPropertyControls(MyComponent, {
     *   link: {
     *     type: ControlType.Link,
     *   }
     * })
     * ```
     */
    Link = "link",
    /**
     * A control that allows for exposing dates. The value will be provided in toJSON() string format.
     *
     * ```javascript
     * export function MyComponent(props) {
     *   const formattedDate = React.useMemo(() => {
     *     return new Date(props.date).toLocaleDateString()
     *   }, [props.date])
     *   return <div>{formattedDate}</div>
     * }
     *
     * addPropertyControls(MyComponent, {
     *   date: {
     *     type: ControlType.Date,
     *   }
     * })
     * ```
     */
    Date = "date",
    /**
     * A control that allows for grouping multiple properties as an object.
     *
     * ```javascript
     * export function MyComponent(props) {
     *   return <Frame opacity={props.myObject.opacity} background={props.myObject.tint} />
     * }
     *
     * addPropertyControls(MyComponent, {
     *   myObject: {
     *     type: ControlType.Object,
     *     controls: {
     *       opacity: { type: ControlType.Number },
     *       tint: { type: ControlType.Color },
     *     }
     *   }
     * })
     * ```
     */
    Object = "object",
    /**
     * @internal
     * A control that allows for selecting a font to be used in the component.
     *
     * ```javascript
     * export function MyComponent(props) {
     *   return <Frame style={props.customFont} />
     * }
     *
     * addPropertyControls(MyComponent, {
     *   customFont: {
     *     type: ControlType.Font,
     *     title: "Custom Font",
     *     controls: "basic"
     *   }
     * })
     * ```
     */
    Font = "font",
    /**
     * @internal
     * A control that allows for selecting a page, a path to that page will be provided during
     * rendering.
     *
     * ```javascript
     * export function MyComponent(props) {
     *   return <Frame />
     * }
     *
     * addPropertyControls(MyComponent, {
     *   scope: {
     *     type: ControlType.PageScope,
     *   }
     * })
     * ```
     */
    PageScope = "pagescope"
}
/** @public */
export interface BaseControlDescription<P = any> {
    title?: string;
    description?: string;
    hidden?(props: P, rootProps: any): boolean;
}
/** @public */
export interface BooleanControlDescription<P = any> extends BaseControlDescription<P> {
    type: ControlType.Boolean;
    defaultValue?: boolean;
    /**
     * @deprecated No longer recommended because it should be clear what happens when assigning a
     * boolean variable.
     */
    disabledTitle?: string;
    /**
     * @deprecated No longer recommended because it should be clear what happens when assigning a
     * boolean variable.
     */
    enabledTitle?: string;
}
/** @public */
export interface NumberControlDescription<P = any> extends BaseControlDescription<P> {
    type: ControlType.Number;
    defaultValue?: number;
    max?: number;
    min?: number;
    unit?: string;
    step?: number;
    displayStepper?: boolean;
}
/** @public */
export interface StringControlDescription<P = any> extends BaseControlDescription<P> {
    type: ControlType.String;
    defaultValue?: string;
    placeholder?: string;
    obscured?: boolean;
    displayTextArea?: boolean;
    /** @internal */
    maxLength?: number;
}
/** @public */
export interface RichTextControlDescription<P = any> extends BaseControlDescription<P> {
    type: ControlType.RichText;
    defaultValue?: string;
    placeholder?: string;
    /** @internal */
    maxLength?: number;
}
/** @public */
export interface FusedNumberControlDescription<P = any> extends BaseControlDescription<P> {
    type: ControlType.FusedNumber;
    defaultValue?: number;
    toggleKey: keyof P;
    toggleTitles: [string, string];
    valueKeys: [keyof P, keyof P, keyof P, keyof P];
    valueLabels: [string, string, string, string];
    min?: number;
}
/**
 * @deprecated
 * @public
 */
export interface DeprecatedFusedNumberControlDescription<P = any> extends BaseControlDescription<P> {
    type: ControlType.FusedNumber;
    valueKeys: [keyof P, keyof P, keyof P, keyof P];
    valueLabels: [string, string, string, string];
    min?: number;
    splitKey: keyof P;
    splitLabels: [string, string];
}
/** @internal */
export type Keyable<T> = T extends string ? T : never;
/** @public */
export interface EnumControlDescription<P = any> extends BaseControlDescription<P> {
    type: ControlType.Enum;
    defaultValue?: string | boolean | number | undefined | null;
    options: (string | boolean | number | undefined | null)[];
    optionTitles?: string[];
    displaySegmentedControl?: boolean;
    /**  Used when displaySegmentedControl is enabled. If not given defaults to horizontal */
    segmentedControlDirection?: "horizontal" | "vertical";
    /**  Used when displaySegmentedControl is enabled @internal */
    optionIcons?: SegmentedControlIcon[] | {
        [K in keyof P]: {
            [V in Keyable<P[K]>]: SegmentedControlIcon[];
        };
    };
    /**  Used when displaySegmentedControl is enabled @internal */
    showIconWithTitle?: boolean;
}
/**
 * @deprecated Use {@link EnumControlDescription} instead, and enable displaySegmentedControl.
 * @public
 */
export interface SegmentedEnumControlDescription<P = any> extends BaseControlDescription<P> {
    type: ControlType.SegmentedEnum;
    defaultValue?: string;
    options: string[];
    optionTitles?: string[];
}
/** @public */
export interface ColorControlDescription<P = any> extends BaseControlDescription<P> {
    type: ControlType.Color;
    defaultValue?: string;
    optional?: boolean;
}
/**
 * @deprecated Use {@link ResponsiveImageControlDescription} instead.
 * @public
 */
export interface ImageControlDescription<P = any> extends BaseControlDescription<P> {
    type: ControlType.Image;
}
/** @public */
export interface ResponsiveImageControlDescription<P = any> extends BaseControlDescription<P> {
    type: ControlType.ResponsiveImage;
}
/** @public */
export interface FileControlDescription<P = any> extends BaseControlDescription<P> {
    type: ControlType.File;
    allowedFileTypes: string[];
}
/** @public */
export interface ComponentInstanceDescription<P = any> extends BaseControlDescription<P> {
    type: ControlType.ComponentInstance;
}
/** @public */
export interface ArrayControlDescription<P = any> extends BaseControlDescription<P> {
    type: ControlType.Array;
    control: ArrayItemControlDescription<P>;
    /** @deprecated This property has been renamed to control. */
    propertyControl?: ArrayItemControlDescription<P>;
    maxCount?: number;
    defaultValue?: any[];
}
/** @public */
export interface EventHandlerControlDescription<P = any> extends BaseControlDescription<P> {
    type: ControlType.EventHandler;
}
/** @public */
export interface TransitionControlDescription<P = any> extends BaseControlDescription<P> {
    type: ControlType.Transition;
    defaultValue?: null | Transition;
}
/** @public */
export interface LinkControlDescription<P = any> extends BaseControlDescription<P> {
    type: ControlType.Link;
    defaultValue?: string;
}
/** @public */
export interface DateControlDescription<P = any> extends BaseControlDescription<P> {
    type: ControlType.Date;
    defaultValue?: string;
}
/**
 * @remarks This feature is still in beta
 * @public
 */
export interface ObjectControlDescription<P = any> extends BaseControlDescription<P> {
    type: ControlType.Object;
    controls: {
        [key: string]: ObjectPropertyControlDescription;
    };
    defaultValue?: {
        [key: string]: any;
    };
    buttonTitle?: string;
    optional?: boolean;
    icon?: ObjectControlIcon;
}
export interface PageScopeControlDescription<P = any> extends BaseControlDescription<P> {
    type: ControlType.PageScope;
}
export interface FontControlDescription<P = any> extends BaseControlDescription<P> {
    type: ControlType.Font;
    controls?: "basic" | "extended";
    defaultFontType?: "monospace" | "sans-serif";
    defaultValue?: FontControlDefaultValue;
    displayTextAlignment?: boolean;
    displayFontSize?: boolean;
}
export interface FontControlDefaultValue {
    textAlign?: "left" | "right" | "center";
    fontSize?: number;
    letterSpacing?: string | number;
    lineHeight?: string | number;
}
/**
 * Segment Control Icons provided by Framer
 * @internal
 */
export type SegmentedControlIcon = "align-left" | "align-center" | "align-right" | "align-top" | "align-middle" | "align-bottom" | "direction-up" | "direction-right" | "direction-down" | "direction-left" | "direction-horizontal" | "direction-vertical" | "direction-all" | "text-align-left" | "text-align-center" | "text-align-right" | "text-align-top" | "text-align-middle" | "text-align-bottom" | "navigation-transition-instant" | "navigation-transition-magicMotion" | "navigation-transition-push" | "navigation-transition-modal" | "navigation-transition-overlay" | "navigation-transition-fade" | "navigation-transition-flip" | "orientation-portrait" | "orientation-landscape";
/**
 * Object Control Icons provided by Framer
 */
export type ObjectControlIcon = "object" | "effect";
//# sourceMappingURL=PropertyControls.d.ts.map