# Render Target

The `RenderTarget.current()` allows you to know which environment your component is in. It can receive fours different possibilities: `canvas`, `preview`, `export` or `thumbnail`:

```
import { RenderTarget } from "framer"

if (RenderTarget.current() === RenderTarget.canvas) {
    return <span>Visible Only on the Canvas</span>
}
 return <Component />
```


## Reference

1.  📝 `RenderTarget` was referenced in the [legacy documentation](https://site-dsmwifrws-framer-app.vercel.app/developers/guides/)