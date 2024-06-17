# useIsOnFramerCanvas and Render Target
The `useIsOnFramerCanvas` hook indicates whether your code is running on the Framer Canvas. It returns a boolean value.

```js
import { useIsOnFramerCanvas } from "framer"
export default function CodeComponent(props) {
    const isOnFramerCanvas = useIsOnFramerCanvas()

    if (isOnFramerCanvas) {
        return <>This will be display only on the Canvas</>
    } else {
        return (
            <> This will be display only during the preview or the online version</>
        )
    }
}

```

The `useIsOnFramerCanvas` hook use the `RenderTarget.current()` function. Similar to the hook, this function allows you to know on which environment your component is in. It can receive fours different possibilities: `canvas`, `preview`, `export` or `thumbnail`:

```js
import { RenderTarget } from "framer"

if (RenderTarget.current() === RenderTarget.canvas) {
    return <span>Visible Only on the Canvas</span>
}else{
     return <span>Visible in the Preview, Export and Thumbnail</span>
}

```

## Reference

1. 📝 `RenderTarget` is referenced in the [Motion documentation](https://www.framer.com/motion/render-target/).
2. 💬 [Discusion about `RenderTarget`](https://www.framer.community/c/developers/execute-override-only-when-component-is-not-on-canvas-is-it-possible)
3. 💬 [`RenderTarget` in Code Overrides](https://www.framer.community/c/developers/detect-edit-mode)
