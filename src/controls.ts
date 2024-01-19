import { ControlType } from "framer"

const textPropertyControls = {
    font: {
        //@ts-ignore
        type: ControlType.Font,
        controls: "basic",
        displayFontSize: false,
        displayTextAlignment: false,
        defaultFontType: "sans-serif",
    },
    color: {
        title: "color",
        type: ControlType.Color,
        defaultValue: "#000",
    },
    fontSize: {
        title: "size",
        type: ControlType.Number,
        defaultValue: 16,
        min: 1,
        max: 120,
        step: 1,
    },
    letterSpacing: {
        type: ControlType.Number,
        title: "Letter",
        min: -500,
        max: 500,
        displayStepper: true,
        step: 0.1,
        defaultValue: 0,
    },
    lineHeight: {
        type: ControlType.Number,
        title: "Line",
        min: -500,
        max: 500,
        displayStepper: true,
        step: 0.1,
        defaultValue: 1.2,
    },
    paragraph: {
        type: ControlType.Number,
        title: "Paragraph",
        min: -500,
        max: 500,
        displayStepper: true,
        step: 0.1,
        defaultValue: 0,
    },
    //TextAlignHorizontal
    justifyContent: {
        title: "Align",
        type: ControlType.Enum,
        options: ["start", "center", "end"],
        //@ts-ignore
        optionIcons: [
            "text-align-left",
            "text-align-center",
            "text-align-right",
        ],
        defaultValue: "start",
        displaySegmentedControl: true,
    },
    //TextAlignVertical
    alignItems: {
        title: " ",
        type: ControlType.Enum,
        options: ["start", "center", "end"],
        //@ts-ignore
        optionIcons: [
            "text-align-top",
            "text-align-middle",
            "text-align-bottom",
        ],
        displaySegmentedControl: true,
        hidden: (props) => {
            return props.height === "auto"
        },
    },
    textTransform: {
        title: "Transform",
        type: ControlType.Enum,
        options: ["none", "capitalize", "uppercase", "lowercase"],
        optionTitles: ["None", "Capitalize", "Uppercase", "Lowercase"],
    },
    textDecoration: {
        title: "Decoration",
        type: ControlType.Enum,
        options: ["none", "underline", "line-through"],
        optionTitles: ["Aa", "A͟a", " ̵A̵a̵"],
        displaySegmentedControl: true,
    },
}

const getCSSProperties = (props) => {
    const {
        font,
        color,
        fontSize,
        lineHeight,
        justifyContent,
        alignItems,
        textTransform,
        textDecoration,
        //paddings
        paddingIsMixed,
        padding,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,

        //border
        borderRadiusIsMixed,
        borderRadius,
        borderTopLeftRadius,
        borderTopRightRadius,
        borderBottomLeftRadius,
        borderBottomRightRadius,
    } = props

    const paddings = paddingIsMixed
        ? {
              paddingTop,
              paddingRight,
              paddingBottom,
              paddingLeft,
          }
        : { padding }

    const bordersRadius = borderRadiusIsMixed
        ? {
              borderTopLeftRadius,
              borderTopRightRadius,
              borderBottomLeftRadius,
              borderBottomRightRadius,
          }
        : { borderRadius }

    return {
        display: "flex",
        ...paddings,
        ...bordersRadius,
        ...font,
        color,
        fontSize,
        letterSpacing: `${props.letterSpacing}em`,
        lineHeight,
        justifyContent,
        alignItems,
        textTransform,
        textDecoration,
    }
}

export { textPropertyControls, getCSSProperties }
