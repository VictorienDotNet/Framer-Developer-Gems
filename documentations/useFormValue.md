# The useFormValue hook
The `useFormValue` function enables you to read and update input values from forms built with [Typer](https://typer.framer.wiki/). It supports values from any type of input field and work as classic [React Hook](https://legacy.reactjs.org/docs/hooks-intro.html).

```js
import { useFormValue } from "https://framer.com/m/Store-nhJr.js"
const [value, setValue] = useFormValue("valueName", "initialValue");
```

### Parameters

- `valueName`: The input name specifies the value you want to retrieve. It only accepts strings, and it's case-sensitive. 
- `initialValue`: If the value is not already defined by another component (e.g., a filled Typer field on the page), you can specify the initial value you want.   

### Returns

`useFormValue` returns an array with exactly two values:

- The current value of the input field. During the first render, if the inputs are empty and `initialState` is not defined, it will return `undefined`.
- The set function allows you to update the input with a different value and trigger a re-render of all components using the useFormValue hook, including the input field.

Note: The values returned byt the hook is effectif accross pages unitl the user is quitting or refreshing the page. 

## Walkthrough

### 1. Define the input name
The valueName from the hook corresponds to the name of the input. First, you need to define the name on the component from which you would like to get the value:
![Stack@2x](https://github.com/VictorienDotNet/Framer-Developer-Gems/assets/5654077/ce6c58f0-db74-4edc-b1aa-0c247146853d)

### 2. Retrieving and Applying the value

Once the value name is defined, you can use the hook and apply it as a variable to any component. For example, you can apply it to a native Text component like this:
```js
/* CODE OVERRIDE EXAMPLE */
import type { ComponentType } from "react"
import { useFormValue } from "https://framer.com/m/Store-nhJr.js"

export function withFormValue(Component): ComponentType {
  return (props) => {
    const [firstName, setFirstName] = useFormValue("fisrtname");
    return <Component {...props} text={firstName} />;
  };
}
```
Note: You will need to ensure that the value's type, whether String or Number, matches with the component prop's type. For example, if you retrieve a value from a Slider, which is a number, you will need to convert it to a string before applying it to the Text component.

```js
const [value, setValue] = useFormValue("slider");
return <Component {...props} text={String(value)} />;
```

## References

1. [Typer Website](https://typer.framer.wiki/)
2. [Example with Typer and useFormValue](https://typer-useformvalue-hook.framer.website/)
