# useFormValue

The `useFormValue` allows you to get and write input value from forms made with Typer. You canse value from any type of input

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
