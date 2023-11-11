# Framer Documentation

This repository serves as a comprehensive guide, curated by the Framer community, to provide insights into advanced features not covered in the official documentation.

1. [Special Enum Property Control](#special-enum-property-control)
2. [RenderTarget](#render-target)
3. [Handshake](https://site-dsmwifrws-framer-app.vercel.app/developers/guides/handshake/)



## Special Enum Property Control

Framer display icons on really specific property as Text Alignement or Device Orientation. You can reproduce this Control but mentionning the correct `optionTitles`. You can see below the different options:

| Type | Look n Feel |
|-|-|
|[Horizontal](#Horizontal)|![Horizontal@2x](https://github.com/VictorienDotNet/Framer-Components-Documentaion/assets/5654077/772df766-8816-4749-8308-111218db7450)|
| [Horizontal](#Horizontal) |![Vertical@2x](https://github.com/VictorienDotNet/Framer-Components-Documentaion/assets/5654077/b7cfb8f0-b88e-4e57-9ad7-a46d63f75287)|





### Horizontal
```
horizontal: {
    type: ControlType.Enum,
    defaultValue: "center",
    options: ["left", "center", "right"],
    optionTitles: ["Left", "Center", "Right"],
    displaySegmentedControl: true,
},
```
### Vertical
```

vertical: {
    type: ControlType.Enum,
    defaultValue: "center",
    options: ["top", "center", "bottom"],
    optionTitles: ["Top", "Center", "Bottom"],
    displaySegmentedControl: true,
},
```

![Direction@2x](https://github.com/VictorienDotNet/Framer-Components-Documentaion/assets/5654077/f81e1a15-92ce-4015-9131-5fb30448c9fd)
```
direction: {
    type: ControlType.Enum,
    defaultValue: "horizontal",
    options: ["horizontal", "vertical"],
    displaySegmentedControl: true,
},
```

![Any Direction@2x](https://github.com/VictorienDotNet/Framer-Components-Documentaion/assets/5654077/b17c2e11-cf7e-49eb-bac0-515f1bebcaea)
```
anyDirection: {
    type: ControlType.Enum,
    defaultValue: "horizontal",
    options: ["vertical", "horizontal", "both"],
    displaySegmentedControl: true,
},
```

![Directions@2x](https://github.com/VictorienDotNet/Framer-Components-Documentaion/assets/5654077/b22bce89-7069-4533-824a-0dd720ed1421)
```
directions: {
    type: ControlType.Enum,
    defaultValue: "Left",
    options: ["left", "right", "top", "bottom"],
    optionTitles: ["Left", "Right", "Top", "Bottom"],
    optionIcons: [
        "direction-left",
        "direction-right",
        "direction-up",
        "direction-down",
    ],
    displaySegmentedControl: true,
},
```

![Alignement@2x](https://github.com/VictorienDotNet/Framer-Components-Documentaion/assets/5654077/b39816fb-72aa-496a-954c-c8f0d4462eaa)
```
alignment: {
    type: ControlType.Enum,
    options: ["flex-start", "center", "flex-end"],
    optionIcons: {
        directions: {
            right: ["align-top", "align-middle", "align-bottom"],
            left: ["align-top", "align-middle", "align-bottom"],
            top: ["align-left", "align-center", "align-right"],
            bottom: ["align-left", "align-center", "align-right"],
        },
    },
    defaultValue: "center",
    displaySegmentedControl: true,
},
```

![Orientation@2x](https://github.com/VictorienDotNet/Framer-Components-Documentaion/assets/5654077/fa6dff83-5fae-4590-926d-0399374c59c8)
```
orientation: {
    type: ControlType.Enum,
    options: ["portrait", "landscape"],
    optionTitles: ["Portrait", "Landscape"],
    optionIcons: ["orientation-portrait", "orientation-landscape"],
    displaySegmentedControl: true,
},
```

![Text Align H@2x](https://github.com/VictorienDotNet/Framer-Components-Documentaion/assets/5654077/c73b3b5f-da72-4963-aadc-a3490236ff28)
```
textAlignH: {
      type: ControlType.Enum,
      options: ["text-align-left", "text-align-center", "text-align-right"],
      optionIcons: [
          "text-align-left",
          "text-align-center",
          "text-align-right",
      ],
      displaySegmentedControl: true,
},
```

![Text Align V@2x](https://github.com/VictorienDotNet/Framer-Components-Documentaion/assets/5654077/5cbc73d4-3bff-4188-826c-506670499999)
```
textAlignV: {
    type: ControlType.Enum,
    options: ["text-align-top", "text-align-middle", "text-align-bottom"],
    optionIcons: [
        "text-align-top",
        "text-align-middle",
        "text-align-bottom",
    ],
    displaySegmentedControl: true,
},
```

## Render Target

The `RenderTarget.current()` allow you to know on which environement. It can recieve fours different possibilites : `canvas`, `preview`, `export` or `thumbnail`.



```
import { RenderTarget } from "framer"

if (RenderTarget.current() === RenderTarget.canvas) {
   return <Component />
}
```



   
