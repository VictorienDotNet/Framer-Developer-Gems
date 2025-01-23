# Framer Developer Gems
This repository documents advanced features not covered in the [official Developer documentation](https://www.framer.com/developers/) from Framer. It's a curated list of function in use in Framer discovered by the Community. These discoveries open the development of more advanced components and overrides. As additional documentation, it doesn't cover the basics and suppose you are already aware of it. If you are not, you can refer to the [Further Reading](#futher-readings) section to learn more about Framer and React developement.


## Discovered Gems
Below is a list of gems discovered by the community that have been discussed in the forum (💬) or documented here (📝). 

### Property Controls

- 📝 [ControlType.Cursor](./documentations/AdvancedPropertyControl.md#controltypecursor)<br/>
  Use the the Cursor Panel to select default CSS cursor

- 📝 [ControlType.Font](./documentations/AdvancedPropertyControl.md#controltypefont)<br/>
  Use the Font Picker as a control.

- 📝 [ControlType.Object](./documentations/AdvancedPropertyControl.md#customize-the-controltypeobject)<br/>
Customize the Object Control by adding icons or making it optional.

- 📝 [ControlType.ResponsiveImage](./documentations/AdvancedPropertyControl.md#controltyperesponsiveimage)<br/>
  Use the Responsive Image setup.
  
- 📝 [Custom Enum Icons](./documentations/AdvancedPropertyControl.md#icons-in-property-controls)<br/>
  Display icons in the Enum property controls instead of strings.
  
- 📝 [getPropertyControls](./documentations/AdvancedPropertyControl.md#get-the-property-controls-from-a-component)<br/>
  Get the property controls from a component and re-use them as you wish.


### Hooks

- 📝 [useCurrentLocation](./documentations/useCurrentLocation.md)<br/>
  Built on top of the useRouter hook, the useCurrentLocation hook allows you to get and set the current location.
  
- 📝 [useFormValue](./documentations/useFormValue.md)<br/>
  The useFormValue hook lets you read and write data from a Typer form.

- 📝 [useIsOnFramerCanvas](./documentations/RenderTarget.md)<br/>
  The useIsOnFramerCanvas hook lets you know where Framer renders the component.
  
- 📝 [useLocaleInfo](./documentations/useLocaleInfo.md)<br/>
  The useLocaleInfo hook provides information about the active locale and the current locales available in your Framer project.
  
- 📝 [useStore](./documentations/useStore.md)<br/>
  The useStore hook allows you to share data between Code Components or Code Overrides across the website.





### Other

- 📝 [@framerDisableUnlink](./documentations/framerDisableUnlink.md)<br/>
  Disable the Code Edition of your Component.
     
- 📝 [Extract CMS Data](./documentations/ExtractingCMSData.md)<br/>
  You can export your collections as a JSON file.
  
- 📝 [Handshake](https://web.archive.org/web/20221208202807/https://www.framer.com/developers/guides/handshake/) <br/>
  Export your Design Component in a Next.js Project.

- 💬 [Choose your package version](https://www.framer.community/c/bugs/spline-npm-package-is-not-up-to-date-in-framer)<br/>
  On Framer, you can choose your package version by using esm.sh.
  
<br/>

## Futher Readings
Some helpful guides to learn React × Framer development.

- [Official Framer Developer Documentation](https://www.framer.com/developers/)

- [Legacy Framer Documentation](https://web.archive.org/web/20221208185247/framer.com/developers/guides/)

- [React Guide by Framer](https://web.archive.org/web/20230128211202/framer.com/books/framer-guide-to-react/)

- [Official React Documentation](https://react.dev/)

## Contribute

Feel free to contribute to this documentation by sharing or documenting your discoveries. You can add one by submitting a pull request or tag me ([@Victorien](https://www.framer.community/u/ef550bdb)) in the related discussion from the [Framer Forum](https://www.framer.community/). Thanks to all Framer members for their contribution ❤️.

 
