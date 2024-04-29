# Framer Router

There are more possibilities in terms of property controls than what the official documentation covers. See below extra gems for Property Controls:

1. [useRouter](#useRouter)
2. [useCurrentRouteId](#useCurrentRouteId)
3. [useRouteAnchor](#useCurrentRouteId)

##useRouter

```js
const { navigate, routes } = useRouter();
```

##getRouteId

```js
const { href, onClick } = useRouteAnchor(route);
```

##useCurrentRouteId

```js
const routeId = useCurrentRouteId();
```

##useRouteAnchor

```js
const { href, onClick } = useRouteAnchor(routeId);
```
