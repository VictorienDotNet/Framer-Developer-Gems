# Disable Code Edition

The tag `@framerDisableUnlink` removes the "Edit Code" button from the Property Controls. By doing so, the Code Component will be uneditable once exported to another file. To work, the tag need to be placed as a comment at the begining of your component, before the export :


```js
/**
 * @framerDisableUnlink
 */
export default function MyComponent(props) {
```

## Reference

1. 💬 [Discusion about `@framerDisableUnlink`](https://www.framer.community/c/developers/about-code-component)