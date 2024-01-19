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
export var ControlType;
(function (ControlType) {
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
    ControlType["Boolean"] = "boolean";
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
    ControlType["Number"] = "number";
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
    ControlType["String"] = "string";
    /**
     * @internal
     * This is used by framer internally. Use at your own risk. Will contain a string with html
     * markup containing h1, h2, etc., paragraphs, and inline styles.
     */
    ControlType["RichText"] = "richtext";
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
    ControlType["FusedNumber"] = "fusednumber";
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
    ControlType["Enum"] = "enum";
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
    ControlType["SegmentedEnum"] = "segmentedenum";
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
    ControlType["Color"] = "color";
    /**
     * Deprecated, please use {@link ControlType.ResponsiveImage}’s `src` field instead.
     *
     * @deprecated Please use {@link ControlType.ResponsiveImage}’s `src` field instead.
     */
    ControlType["Image"] = "image";
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
    ControlType["ResponsiveImage"] = "responsiveimage";
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
    ControlType["File"] = "file";
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
    ControlType["ComponentInstance"] = "componentinstance";
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
    ControlType["Array"] = "array";
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
    ControlType["EventHandler"] = "eventhandler";
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
    ControlType["Transition"] = "transition";
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
    ControlType["Link"] = "link";
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
    ControlType["Date"] = "date";
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
    ControlType["Object"] = "object";
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
    ControlType["Font"] = "font";
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
    ControlType["PageScope"] = "pagescope";
})(ControlType || (ControlType = {}));
//# sourceMappingURL=PropertyControls.js.map