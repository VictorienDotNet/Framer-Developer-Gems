# Current Location and Framer Router

When navigating between pages on your Framer website, it is advised to use the useRouter hook from Framer to avoid breaking the navigation history. Additionally, the useCurrentLocation hook, built by the community, can be used.


1. [Use the Current Location](#useCurrentLocation)
2. [Use the Router and Route Id](#useRouter)



## Use the Current Location

```js
const [currentLocation, setCurrentLocation] = useCurrentLocation()
````
The `useCurrentLocation` hook functions similarly to the classic _useState_ React hook. It returns two variables: one for reading the current location and another for setting the current location:

- `currentLocation`: Returns a string representing the current relative path (e.g., _/contact_).
- `setCurrentLocation`: Navigates to the desired path (e.g., _setCurrentLocation("/contact")_).

e.g.:
```js
import { useCurrentLocation } from "https://framer.com/m/UseCurrentLocation-coQY.js"

function CodeComponent(props) {
    const [currentLocation, setCurrentLocation] = useCurrentLocation()

    return (
        <button
            onClick={() => {
                setCurrentLocation("/contact")
            }}
        >
            Contact Us
        </button>
    )
}
```


## Use the Router and Route Id

```js
const { navigate, routes } = useRouter()
const routeId = useCurrentRouteId();
```
The useCurrentLocation hook is built on top of the two official Framer hooks: _useRouter_ and _routeId_.
- `routes`: An array containing all available routes in your website, sorted by their IDs.
- `navigate`: A function that allows you to navigate to the desired page by indicating the _routeId_.
- `routeId`: Returns the ID of the current page you are visiting.

e.g.:
```js
//@ts-ignore
import { useRouter, useCurrentRouteId } from "framer"
import { useState, useEffect } from "react"

const useCurrentLocation = () => {
    const { navigate, routes } = useRouter()
    const currentRouteId = useCurrentRouteId()

    const location = Array.isArray(routes) && routes[currentRouteId]?.path

    const setLocation = (path) => {
        const routeID = Object.entries(routes)?.reduce((acc, item) => {
            return item[1]?.path === path ? item[0] : acc
        }, false)
        navigate(routeID, "")
    }

    return [location, setLocation]
}

export { useCurrentLocation }

```

## References

1. 💬 [Access a Page through a Code Component](https://www.framer.community/c/developers/access-a-page-through-a-code-component)
2. 💬 [Even I Figured Out useRouter (So You Can Too!)](https://www.framer.community/c/developers/even-i-figured-out-userouter-so-you-can-too)




