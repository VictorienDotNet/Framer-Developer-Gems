# Insert Component with custom CSS

## Example


``` typescript
//Import the withCSS function from the Framer library.
import { withCSS } from "framer"

// Define a React functional component named MyComponent.
// The div is assigned a class name of "myComponent" for styling purposes.
const MyComponent = ({ title }) => {
    return <div className="myComponent">{title}</div>
}

// Define the CSS styles you want to apply to the MyComponent.
// It's defined as an array of strings, each containing CSS rules.
// These styles will set the background color, text color, padding, and border radius of the component.
const myComponentStyles = [
    `.myComponent { 
        background-color: #E9E9E9; // Light gray background
        color: #111111; // Dark text color
        padding: 20px; // Padding around the content
        border-radius: 5px; // Rounded corners
    }`,
   //Remeber You can use any css pseudo classes :hover :active etc.
]

// Wrap MyComponent with the withCSS function, passing the component and the styles array.
// This creates a new component (MyStyledComponent) that includes the original component's functionality
// and the additional CSS styles.
const MyStyledComponent = withCSS(MyComponent, myComponentStyles)

//Here is your coded component that will be return to Framer
export default function WithCSS(props) {
    //You can see it references the HOC component. 
    return (
        <div>
            <MyStyledComponent title="Hello world withCSS" />
        </div>
    )
}
```

## References

1. 💬 [💡 Knowledge sharing: How to use framers withCSS](https://www.framer.community/c/developers/knowledge-sharing-how-to-use-framers-withcss)
