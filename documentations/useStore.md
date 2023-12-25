# useStore

`useStore` in Framer allows you to share data, information, and states across the different components you attach them to. When using Overrides or Code components, you can use a shared hook to share data across them:

````
import type { ComponentType } from "react";
import { createStore } from "https://framer.com/m/framer/store.js@^0.3.0"

const useStore = createStore({ count: 0 });

export const withCount = (Component): ComponentType => {
  return (props) => {
    const [store, setStore] = useStore();
    return <Component {...props} text={`Count ${store.count}`} />;
  };
};

export const withIncrement = (Component): ComponentType => {
  return (props) => {
    const [store, setStore] = useStore();
    const onTap = () => setStore({ count: store.count + 1 });
    return <Component {...props} onTap={onTap} />;
  };
};
````

## References

1. 📝 `useStore` was referenced in the [legacy documentation](https://site-dsmwifrws-framer-app.vercel.app/developers/guides/overrides/).