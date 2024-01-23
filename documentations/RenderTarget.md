# Render Target

The `RenderTarget.current()` allows you to know which environment your component is in. It can receive fours different possibilities: `canvas`, `preview`, `export` or `thumbnail`:

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
3. 💬 [Discusion about `RenderTarget` in Override](https://www.framer.community/c/developers/detect-edit-mode)
