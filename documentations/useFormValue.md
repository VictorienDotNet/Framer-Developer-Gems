# useFormValue

The `useFormValue` allows you to get and write input value from forms made with Typer. You canse value from any type of input

```js
const [value, setValue] = useFormValue("valueName");
```

### Parameters

- `valueName`: The value you want the state to be initially. It can be a value of any type, but there is a special behavior for functions. This argument is ignored after the initial render.
- `initialValue`:  The value you want the state to be initially.

### Returns

`useFormValue` returns an array with exactly two values:

- The current state. During the first render, it will match the initialState you have passed.
- the set function that lets you update the state to a different value and trigger a re-render.


### import

```js
import { useFormValue } from "https://framer.com/m/Store-nhJr.js"
```


## Example

```js
export function withFormValue(Component): ComponentType {
  return (props) => {
    const [name, setName] = useFormValue("fisrtname");
    return <Component {...props} text={value} />;
  };
}
```

## References

1. 📝 `useStore` was referenced in the [legacy documentation](https://site-dsmwifrws-framer-app.vercel.app/developers/guides/overrides/).
