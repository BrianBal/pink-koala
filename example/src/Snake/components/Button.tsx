/** @jsxRuntime classic */
/** @jsx createElement */
/** @jsxFrag Fragment */
import {
    createElement,
    Fragment,
    useState,
    useEventListener,
    mkRect,
    mkPoint,
    rectContains
} from "pink-koala"

const BUTTON_STYLE = {
    fill: "#00AC00",
    stroke: "#EFEFEF",
    strokeWidth: 4,
    text: "#fff"
}

const HOVER_STYLE = {
    fill: "#AC0000",
    stroke: "#FFF",
    strokeWidth: 4,
    text: "#FFF"
}

// const PRESS_STYLE = {
//     fill: "#0000AC",
//     stroke: "#CCC",
//     strokeWidth: 4,
//     text: "#DDD"
// }

type ButtonProps = {
    x?: number
    y?: number
    width: number
    height: number
    text: string
    onClick: () => void
}

export function Button(props: ButtonProps) {
    const [mode, setMode] = useState("regular")
    const [fill, setFill] = useState(BUTTON_STYLE.fill)
    const [stroke, setStroke] = useState(BUTTON_STYLE.stroke)
    const [strokeWidth, setStrokeWidth] = useState(BUTTON_STYLE.strokeWidth)
    const [textColor, setTextColor] = useState(BUTTON_STYLE.text)

    const x = props.x ? props.x : 0
    const y = props.y ? props.y : 0

    const handleHover = (e: MouseEvent) => {
        let rect = mkRect(x, y, props.width, props.height)
        let pt = mkPoint(e.clientX, e.clientY)
        let hit = rectContains(rect, pt)
        if (hit) {
            if (mode !== "hover") {
                console.log("Button.handleHover", "hit", "hover")
                setMode("hover")
                setFill(HOVER_STYLE.fill)
                setStroke(HOVER_STYLE.stroke)
                setStrokeWidth(HOVER_STYLE.strokeWidth)
                setTextColor(HOVER_STYLE.text)
            }
        } else {
            if (mode === "hover") {
                console.log("Button.handleHover", "hit", "regular")
                setMode("regular")
                setFill(BUTTON_STYLE.fill)
                setStroke(BUTTON_STYLE.stroke)
                setStrokeWidth(BUTTON_STYLE.strokeWidth)
                setTextColor(BUTTON_STYLE.text)
            }
        }
    }

    const handleClick = (e: MouseEvent) => {
        console.log("Button.handleClick", e)
        if (props.onClick) {
            props.onClick()
        }
    }

    useEventListener("click", handleClick, [handleClick, props.onClick])
    useEventListener("mousemove", handleHover, [
        handleHover,
        mode,
        setMode,
        fill,
        setFill,
        stroke,
        setStroke,
        strokeWidth,
        setStrokeWidth,
        textColor,
        setTextColor
    ])

    console.log("Button", "mode", mode)

    return (
        <>
            <pkrect
                x={x}
                y={y}
                width={props.width}
                height={props.height}
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
            />
            <pktext
                x={x + 10}
                y={y + 4}
                width={props.width}
                height={props.height}
                font="24px Verdana"
                text={props.text}
                fill={textColor}
            />
        </>
    )
}
