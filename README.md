# Framer Documentation

This repository serves as a comprehensive guide, curated by the Framer community, to provide insights into advanced features not covered in the official documentation.

1. [Special Enum Property Control](#special-enum-property-control)
2. [RenderTarget](#render-target)
3. [Handshake](https://site-dsmwifrws-framer-app.vercel.app/developers/guides/handshake/)


## Special Enum Property Control

Framer display icons on really specific property as Text Alignement or Device Orientation. You can reproduce this Control but mentionning the correct `optionTitles`. You can see below the different options:

![Horizontal](https://github.com/VictorienDotNet/Framer-Components-Documentaion/assets/5654077/ef4f30f1-5e54-4798-b473-d2c71c542832)
![Vertical](https://github.com/VictorienDotNet/Framer-Components-Documentaion/assets/5654077/1c4f0dfb-f63c-45ca-beb7-a484982e36f9)
![Text Align H](https://github.com/VictorienDotNet/Framer-Components-Documentaion/assets/5654077/e9a8f11a-82b5-42c5-a799-3e59372e5ef5)
![Text Align V](https://github.com/VictorienDotNet/Framer-Components-Documentaion/assets/5654077/0a96df8d-bf74-40ca-b50e-09217ef24b20)
![Directions](https://github.com/VictorienDotNet/Framer-Components-Documentaion/assets/5654077/93f844ce-2e77-43ee-a579-541a19fe03e0)
![Direction](https://github.com/VictorienDotNet/Framer-Components-Documentaion/assets/5654077/872db1ea-7ea4-4eec-a687-a88bc31691b3)
![Any Direction](https://github.com/VictorienDotNet/Framer-Components-Documentaion/assets/5654077/d70f53d7-fa2c-4e8e-969a-1aa555c3494d)
![Alignement](https://github.com/VictorienDotNet/Framer-Components-Documentaion/assets/5654077/dd8bb795-dd81-4720-b943-be200ef4cce1)
![Orientation](https://github.com/VictorienDotNet/Framer-Components-Documentaion/assets/5654077/d3f29857-80b2-44e3-b021-224718f945fa)

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
### Text Align Horizontal
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
### Text Align Vertical
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
### Directions
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
### Direction
```
direction: {
    type: ControlType.Enum,
    defaultValue: "horizontal",
    options: ["horizontal", "vertical"],
    displaySegmentedControl: true,
},
```
### Any Direction
```
anyDirection: {
    type: ControlType.Enum,
    defaultValue: "horizontal",
    options: ["vertical", "horizontal", "both"],
    displaySegmentedControl: true,
},
```
### Alignement
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
### Orientation
```
orientation: {
    type: ControlType.Enum,
    options: ["portrait", "landscape"],
    optionTitles: ["Portrait", "Landscape"],
    optionIcons: ["orientation-portrait", "orientation-landscape"],
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



   
