# Framer Library

## [Unreleased]

### Fixed

-   `addPropertyControls` now assigns the control default values to components using `React.forwardRef`.

### Added

-   `ControlType.Object`, can now set an optional `icon` property.
-   Initial support for localizations.

### Removed

-   Deprecated `Stack` component.

## [2.2.1]

### Added

-   `ControlType.ResponsiveImage`, make images render more performant using `srcset` and more accessible with `alt`.

## [2.2.0]

### Improved

-   `RichText` component now accepts `children` as a prop. These `children` are expected to be JSX.

### Removed

-   `RichText` `html` property has been deprecated

## [2.1.3] 2022-06-01

### Added

-   `Stack` now has a `wrap` prop to support `flex-wrap: wrap`.
-   `ControlType.Date`, to expose date picker controls

### Improved

-   Removed scroll reset offset boolean control title override that should be in sync with the control defaults.

## [2.1.2] 2022-04-08

### Added

-   Export `PropertyControls` and `ControlDescription` types.
-   Added data attribute to recognize background image wrappers: `data-framer-background-image-wrapper`.

## [2.1.0] 2022-03-21

### Added

-   `ControlType.Link`, to expose web links (e.g. href)
-   `RichText`

## [2.0.0] 2022-02-07

-   Export `useRouteAnchor` from @framerjs/router.
-   Make `PropertyControl.Enum` prop `segmentedControlDirection` public.
-   Allow `alt` to be set on `Image` component as a top level property.
-   `Stack` now accepts a `useFlexboxGap` prop to determine wether to use native Flexbox `gap` or not, defaults to `true`.
-   Give the `Stack` and `FrameWithMotion` components a new non-required `as` prop to define custom HTML elements. It defaults to `motion.div`.
-   `framer@2.0.0` is an ESM-only package that fixes all incompatibilities with Node ESM environment, this previously prevented us from running it in SSR.
-   `build` now produces an "unbundled" output that allows webpack and other bundlers to efficiently tree-shake the library exports resulting in significantly smaller bundle size.
-   the package has been cleaned removing previously undocumented API's reducing its bundle size

### Added

-   Add a new React hook, `useGamepad`, that can trigger callbacks when a gamepad button is pressed or released.
-   Private API for text node styles
-   `ControlType.Object` sub controls can now be hidden

### Fixed

-   Various layout animation fixes
-   Updates framer-motion to 5.0.0-beta.38

### Removed

-   Deprecated `AnimateSharedLayout`
-   Previously undocumented internal API's that were part of v1 package

## [1.3.6] 2021-07-05

### Added

-   Exposed `useObserveData` hook for re-rendering components when a `Data` object is updated.

## [1.3.5] 2021-07-02

### Improved

-   Scroll now has a `native` prop that allows for native scrolling

## [1.3.4] 2021-06-30

### Fixed

-   Replace missing typescript definitions
-   Fixed a layout issue when creating an auto sizing Stack from code

## [1.3.3] 2021-06-29

### Improved

-   Allow overdrag to be disabled on the Scroll component

## [1.3.2] 2021-05-27

### Changed

-   Publish ESM build to npm

## [1.3.1] 2021-05-27

### Changed

-   Publish ESM build to npm

## [1.2.30] 2021-05-11

### Improved

-   Internal updates for Smart Components

## [1.2.29] 2021-03-29

### Improved

-   Internal updates for Smart Components
-   Image component should only render the image if the background has a source

### Changed

-   `layoutTransition` now maps to `layout`.

## [1.2.28] 2021-03-17

### Improved

-   Internal updates for Smart Components

## [1.2.27] 2021-03-12

### Fixed

-   Fixed an issue where multiple screens could be active at the same time.

### Improved

-   Internal updates for Smart Components

## [1.2.26] 2021-03-04

### Improved

-   Update framer-motion@3.5.1
-   Allow for a cleanup callback to be passed into `useOnCurrentTargetChange`

### Fixed

-   Fixed an issue that caused code components to be rendered twice on initial render.
-   Fixed an issue that could sometimes cause code components to be rendered at the wrong size in exported images.

### Added

-   Scroll now supports offsetX and offsetY to set the initial scroll offset
    relevant to the current scroll direction.
-   Scroll can now be set to set its scroll offset back to the initial value
    when the containing screen is presented in Framer prototypes.
-   Internal changes: added useOnCurrentTargetChange hook to fire callback when node enters/exits
-   Private API for position sticky layout

## [1.2.25] 2021-02-18

### Improved

-   Internal changes related to measuring code component layout

## [1.2.24] 2021-02-17

### Added

-   `ControlType.Array` now supports items of `ControlType.Object`
-   `Rect.transform(rect, matrix)`

### Removed

-   The `contentState` property of the `Text` component has been removed.
-   DraftJS dependency was removed.

## [1.2.23] 2021-02-15

### Fixed

-   API doc formatting

## [1.2.22] 2021-02-12

### Fixed

-   API doc generation

## [1.2.21] - 2021-02-11

### Added

-   `ControlType.Object`

### Improved

-   Update documentation for `ControlType.FusedNumber` Property Controls.
-   Renamed array item type from `propertyControl` to `control`

## [1.2.20] - 2021-02-02

### Fixed

-   Side padding props work when used on Stack in code without also using the
    `paddingPerSide` property.

## [1.2.19] - 2021-02-02

### Improved

-   Updates framer-motion to 3.3.0-beta.22

## [1.2.18] - 2021-02-01

### Improved

-   Updates framer-motion to 3.3.0-beta.19

## [1.2.17] - 2021-02-01

### Improved

-   Internal changes
-   Updates framer-motion to 3.3.0-beta.18

## [1.2.16] - 2021-01-26

### Improved

-   Updates framer-motion to 3.2.2-rc.1
-   Updates to Framer's Page component to improve compatibility when used with
    framer-motion's layout animations.
-   Internal changes

## [1.2.15] - 2021-01-21

### Improved

-   Internal changes

## [1.2.14] - 2021-01-20

### Improved

-   Internal changes

## [1.2.13] - 2021-01-18

### Improved

-   Internal changes

## [1.2.12] - 2020-12-23

### Improved

-   Updates the bundled Framer Motion library to 3.0.1

### Added

-   `Frame` now supports `minWidth` and `minHeight` as props.
-   Internal Enum control now accept two optional rendering options `segmentedControlDirection` and `showIconWithTitle`.

### Changed

-   Internal changes related to how Stacks are rendered on the canvas.

## [1.2.11] - 2020-12-02

### Added

-   `while-` props accept lists of variants
-   `whileDrag`
-   Internal Vector component now accepts a `d` prop, which is a string that will be used for an SVG path's `d` attribute. `d` will be preferred over a `calculatedPath` List.
-   Internal components Vector and SVG now accept `style` and `className`, as well as `variants`, and `transition` prop, which will be applied to the main element of a Vector, which is now either a `motion.path` or a `motion.g`.

## [1.2.10] - 2020-11-19

### Improved

-   Minor changes.

## [1.2.9] - 2020-10-26

### Added

-   Internal `ControlIcon` type, can be used to enrich enum controls
-   Use new control icons for Page component alignment
-   Updated `animate` to support the new Framer Motion syntax.

### Changed

-   Internal changes related to communicating code component sizes to the editor.

## [1.2.8] - 2020-10-01

### Improved

-   Updates the bundled Framer Motion library from 2.6.14-rc.3 to 2.7.4

### Fixed

-   Animating between frames where one has no borderRadius and the other does

### Improved

-   Updated code components to, by default, disable children from automatically having a layoutId generated and applied.

### Added

-   Added support for manually toggling whether descendants of code components generate layoutIds by wrapping descendants with `<AutomaticLayoutIds enabled={boolean}>`

### Added

-   `loadFont` function for loading web fonts

## [1.2.7] - 2020-09-18

### Improved

-   Updates the bundled Framer Motion library from 2.6.7-rc.1 to 2.6.14-rc.3
-   Make sure Scroll and Page component control titles still fit in new property panel

### Fixed

-   Animating to 0 values with overrides should no longer appear instant
-   Navigating to the previous navigation target after a push transition should no longer animate unexpectedly

## [1.2.6] - 2020-09-08

### Added

-   Add support for text transform.
-   Add support for text decoration.
-   Add support for different text line height units.

### Improved

-   Updates the bundled Framer Motion library from 2.0.0-beta.76 to 2.6.7-rc.1, which includes the most recent release of framer-motion
-   Improved latency between user interaction and the navigation being performed when using Navigation in large Framer files

### Fixed

-   Using Design Components in Code with AnimateSharedLayout should work as expected.

## [1.2.4] - 2020-06-25

### Improved

-   Updates the bundled Framer Motion library from 2.0.0-beta.72 to 2.0.0-beta.76 which includes performance improvements
-   Improves performance of Magic Motion transitions in very large projects
-   No longer allow Text content to be selected

### Fixed

-   Fixed an issue where a Magic Motion transition could prevent the visible scroll container from being scrollable.
-   Fixed an issue where Magic Motion transitions might throw an exception when performed after an instant transition.
-   SVG layer dependency on canvas zoom

## [1.2.3] - 2020-06-08

### Added

-   useIsInCurrentNavigationTarget hook to allow you to update code components when the target they are in is navigated to.

## [1.2.2] - 2020-05-19

### Fixed

-   Fixed an issue where initial magic motion transitions could cause a subtle flash

## [1.2.1] - 2020-05-18

### Fixed

-   Fixed an issue where Stacks were not surfaced as part of the library

## [1.2.0] - 2020-05-18

In addition to the changes listed below, this version also updates the bundled Framer Motion library from 1.6.7 to 2.0.0-beta.72, which includes a bunch of fixes, and a few new features. See [Framer Motion's changelog](https://github.com/framer/motion/blob/master/CHANGELOG.md) for more.

-   Upgraded React to 16.12.
-   Improvements to design components for Framer Web
-   Minor internal changes to code component rendering that enable layout metrics to be communicated to the editor

### Improved

-   Components with Overrides applied can now be more easily identified in the React Developer tools Chrome extension.
-   Added `displayTextArea` to `ControlType.String`, to request a multi-line input control
-   Scroll now uses native scroll offset instead of a transform
-   Scroll now uses native scroll constraints for layout
-   Adds support for the new Magic Motion transition type to Navigation
-   Improves Navigation to preserve component and scroll state when navigating to a target that has already been navigated to

### Fixed

-   Fixed Page component not snapping to the initial page
-   Fixed Page component current page event not triggering for the first page
-   Fixed Page component current page when nonzero initially
-   Fixed Page component responsive behavior
-   Fixed an issue where auto sizing Text would shrink inside a Stack
-   Remove vertical translation during modal transition to mimic the latest iOS behaviour
-   Fixed a bug where the DataObserver would not reset on unmount.
-   Fixed an issue where Text would not wrap correctly
-   Fixed an issue where horizontally centered Text wouldn't be positioned correctly
-   Fixed uploaded SVG id collisions
-   Fixed an issue with color alpha comparison
-   Auto sized text height
-   Improved empty states for built-in components

### Removed

-   Stack from the package.json component map
-   Deprecated Stack, this component was only rendered on the Framer Canvas and is now part of the Framer app
-   Removed Scroll and Page event handler controls, they are not yet useful from UI

## [1.1.7] - 2020-01-21

### Fixed

-   Fixed a bug that made elements blurry upon zoom

## [1.1.6] - 2019-12-13

### Improved

-   Backward compatibility
-   Added a `cancel` method to debounced functions, which allows you to cancel pending debounced calls
-   Improved empty states for built-in components

### Fixed

-   createData would not re-render its subscribers when one of them updates the value immediately in its

## [1.1.5] - 2019-10-21

### Improved

-   Navigation Action API

## [1.1.4] - 2019-10-08

### Fixed

-   Add fallback for SF Pro font to support iOS 13

## [1.1.3] - 2019-09-18

### Added

-   Allow for `ControlType.ComponentInstance` in actions
-   Expose internal DataObserverContext
-   Add internal `disableDevice` flag to `getConfigFromPreviewURL()`

### Improved

-   `ControlType.Enum` now supports string, number, boolean, null, and undefined values
-   `ControlType.SegmentedEnum` has been deprecated, use `ControlType.Enum` instead and enable `displaySegmentedControl`
-   Page documentation
-   Stack CSS export

### Fixed

-   Page direction lock
-   Make `size` with fraction values work for `Frame`s inside a `Stack`
-   Collect shadows CSS for text nodes as `text-shadow`
-   Removed default actions from library

## [1.1.2] - 2019-09-04

Minor performance related changes

## [1.1.1] - 2019-08-30

-   Minor performance related changes

## [1.1.0] - 2019-08-28

## Improved

-   Speed of Stack component
-   Page component rendering
-   Support for scrolling with mouse wheel

## [1.0.18] - 2019-08-13

-   Upgraded Framer Motion from 1.4.2 to 1.6.0.

### Added

-   Add `ControlType.EventHandler`
-   Google web fonts support

### Fixed

-   Fix DataObserver not updating when being notified
-   Page rendering by no longer relying on a (re-)size observer for the initial rendering pass
-   Blurry Page content

## [1.0.17] - 2019-08-06

### Added

-   Added `useLog`, `useOpenURL`, and `useNavigateTo` actions.
-   `useNavigation` hook for performing navigation actions from code.
-   `NavigationConsumer` to perform navigation actions from class components.

## [1.0.16] - 2019-07-30

### Added

-   Added `obscured` attribute to the `ControlType.String`. It makes the input value visually concealed
-   DataContext
-   Action

## [1.0.15] - 2019-07-23

-   Upgraded Framer Motion to 1.2.6

### Fixed

-   Click handler in instant navigation transitions

## [1.0.14] - 2019-07-10

### Removed

-   Removed internal `updateComponentLoader` function

## [1.0.13] - 2019-07-02

### Fixed

-   Scroll bug fixes

## [1.0.12] - 2019-06-25

### Added

-   Added `hslToString` method in `ConvertColor`

## [1.0.11] - 2019-06-17

### Fixed

-   `url()` from `framer/resource` returning not returning correct values when multiple projects are open

## [1.0.10] - 2019-06-14

-   Upgraded Framer Motion to 0.19.1

### Fixed

-   Sizing issues with Scroll content

## [1.0.10] - Unreleased

### Added

-   Added deprecatation warnings for `Animatable` and `animate`.
-   Updating `animate` to support `MotionValue`s for backwards-compatibility.

## [1.0.9] - 2019-06-06

### Added

-   Add `framer/resource` to code editor

### Improved

-   Scroll, ControlTypes documentation
-   Error messages when components are not exported.
-   Performance with large images

### Fixed

-   Jittery link transition animations. Animate `deprecatedFrame` `x`/`y` instead of `top`/`left`
-   Scroll size

## [1.0.8] - 2019-05-29

### Added

-   Added `RenderTarget` to the public types

### Fixed

-   Missing `contentOffsetX` and `contentOffsetY` properties of `Page`
-   Using `delay` for transitions
-   Animating with color tokens
-   Double border when using border overrides in Framer X
-   Removed accidental dependencies
-   Scroll component not resizing correctly

### Improved

-   Performance in Framer X

## [1.0.7] - 2019-05-21

### Improvements

-   Radial gradient improvements.
-   Upgraded Framer Motion dependency to 0.18.0.

### Removed

-   Revert fix for border bleeding bug.

## [1.0.6] - 2019-05-17

## [1.0.5] - 2019-05-16

## [1.0.4] - 2019-05-09

-   Upgraded Framer Motion to 0.16.11

### Fixed

-   Positioning of Stack

## [1.0.2] - 2019-05-07

### Fixed

-   Issue with positioning of Design Component instances

## [1.0.1] - 2019-05-07

This release brings an all new API, read the documentation here: https://www.framer.com/api

## [0.10.10] - 2019-03-26

## [0.10.9] - 2019-02-27

## [0.10.8] - 2019-02-19

## [0.10.7] - 2019-02-18

## [0.10.6] - 2019-02-13

### Fixed

-   Availability of Property Control Types

## [0.10.5] - 2019-01-31

### Fixed

-   Images in a code component could be hidden on the canvas.

## [0.10.4] - 2019-01-29

### Improved

-   Moved error and placeholder states into Vekter for X15

## [0.10.3] - 2019-01-24

### Fixed

-   Device images not showing in when viewing a hosted project

## [0.10.2] - 2019-01-21

### Fixed

-   Navigation component showing the wrong screen
-   `onTapStart` for touch environments
-   Stacks in design components having the wrong background
-   Properties getter has been replaced by `this.props` with better typing
-   Text wrapping could break when switching between Fixed and Auto
-   Miscellaneous cleanup

## [0.10.1] - 2018-12-19

### Added

-   `onMouseEnter` and `onMouseLeave` events to Frame

### Fixed

-   Event handlers being called twice in Code overrides
-   Device masks are no longer shown on actual devices

## [0.10.0] - 2018-12-11

### Breaking changes

-   `PageContentDimension` is no longer an enum but a union type of "auto" and "stretch" which means that if you were using `PageContentDimension.Stretch` you should now replace it with `"stretch"`
-   `PageEffectDefault` has been renamed to `PageEffect`

### Improved

-   Navigation overlays
-   Added inline documentation in VSCode

### Fixed

-   Types for Stack and Page components
-   Restored Animatable.set in type public file

## [0.9.7] - 2018-11-22

### Fixed

-   Perspective in Page component

## [0.9.6] - 2018-11-21

### Added

-   New Devices: iPhone XS, iPhone XR, iPhone XS Max, Pixel 3, Pixel 3XL, Galaxy S9

## [0.9.5] - 2018-11-16

### Fixed

-   Navigation container background

## [0.9.4] - 2018-11-16

### Fixed

-   Navigation goBack transitions

## [0.9.3] - 2018-11-14

### Fixed

-   Handling of errors in Code Components

## [0.9.2] - 2018-10-31

### Fixed

-   Correctly calculate `currentPage` of PageComponent on initialization.

### Improved

-   Performance of `isEqual`

## [0.9.1] - 2018-10-30

### Improved

-   Component Loader error handling

## [0.9.0] - 2018-10-24

### Added

-   Page component
-   Property Control types for Arrays and Objects
-   backfaceVisible, perspective and preserve3d props to Frame

### Fixed

-   Listening Animatable's when updating Frames

## [0.8.1] - 2018-10-16

### Improved

-   Performance of `Data` objects
-   Overlay transitions can have a custom backdrop color
-   Scroll components support mouse-wheel scrolling by default

## [0.8.0] - 2018-09-18

### Improved

-   SVG component is now compatible with Stack layout

## [0.7.13] - 2018-09-17

### Fixed

-   Removed `debugger` statement

## [0.7.12] - 2018-09-14

### Added

-   `resource.url()` for referencing resources inside your project
-   Property control types for files (`ControlType.File`) and images (`ControlType.Image`)

### Improved

-   Display of errors in Components

### Fixed

-   Setting width in percentages for Design Components in Code
-   Scrolling animation with velocity

## [0.7.11] - 2018-09-07

### Improved

-   Internal changes for device rendering

## [0.7.10] - 2018-09-04

### Improved

-   Interpolation of objects and colors

### Fixed

-   Scrolling on touch devices
-   Copy CSS for Stacks
-   Transition of Navigation components

## [0.7.9] - 2018-08-31

### Improved

-   Scaling font size for components with erros

### Fixed

-   Rendering of shadows in Shapes

## [0.7.8] - 2018-08-29

### Added

-   Fade transition for Navigation component

## [0.7.7] - 2018-08-28

### Fixed

-   Bug in animation / interpolation API

## [0.7.6] - 2018-08-28

### Added

-   Animation of colors

### Improved

-   Importing Design Components in Code
-   Animation API has more consistent option handling

### Fixed

-   Empty state of Stack component
-   Off-pixel rendering of Frame in some cases

## [0.7.5] - 2018-08-21

### Improved

-   Generic types of `Override`

### Fixed

-   Sorting UI of Stacks

## [0.7.4] - 2018-08-21

### Added

-   Bezier curve animations

## [0.7.3] - 2018-08-20

### Added

-   Support for OverrideFunctions for Design Components used in code

### Improved

-   Skip invisible stack items during layout
-   Renamed FusedNumber option splitKey to toggleKey

### Fixed

-   Handling of Animatable properties in Stack
-   Rerun OverrideFunction on rerender

## [0.7.2] - 2018-08-20

### Improved

-   Fix FrameProperties type of Default Override type

## [0.7.1] - 2018-08-20

### Improved

-   Made Animatable.set() also accepts Animitable values
-   Default Override type to FrameProperties

## [0.7.0] - 2018-08-20

### Improved

-   Rename FramerFunction to Override

## [0.6.1] - 2018-08-16

### Added

-   onClick, onMouseDown and onMouseUp as event handlers

### Fixed

-   Setting default stack properties in package.json

## [0.6.0] - 2018-08-16

Bump version to 0.6 to avoid nmp registry conflicts in the future

### Fixed

-   Make Stack background transparent by default

## [0.2.0] - 2018-08-15

### Improved

-   Better typing of Data function

## [0.1.34] - 2018-08-15

### Added

-   Added private API for CSS exporting from a component

### Improved

-   Cleaned up CSS generation

## [0.1.33] - 2018-08-15

### Improved

-   Made a deprecated PropertyStore available again

## [0.1.32] - 2018-08-15

### Fixed

-   Bug where Animatable transactions would not work well together with ObservableObjects

## [0.1.31] - 2018-08-14

### Added

-   Support for importing Design Components in code

## [0.1.30] - 2018-08-13

### Improved

-   Change boolean control titles `enabled` and `disabled` to `enabledTitle` and `disabledTitle`

## [0.1.29] - 2018-08-13

### Property Controls

-   `unit` type for number inputs (e.g. %)
-   `step` allows numbers to be floats
-   `placeholder` for string inputs
-   `hidden` function allows controls to be hidden

## [0.1.28] - 2018-08-09

### Added

-   `Data` function to create observable object that rerenders

### Fixed

-   `animate()` function updates objects with multiple Animatable values only once per animation tick

## [0.1.27] - 2018-08-1

Initial Beta 1 release
