/** @jsxRuntime classic */
/** @jsx createElement */
/** @jsxFrag Fragment */
import { createElement, Fragment } from "pink-koala"

const CHILD_HEIGHT = 100

export function Column(props: any, children: any) {
    console.log("Column.props", props)
    console.log("Column.children", children)

    let x = props.x ? parseFloat(props.x) : 0
    let y = props.y ? parseFloat(props.y) : 0
    let height = props.height ? parseFloat(props.height) : 0
    // let height = props.height ? parseFloat(props.height) : 0
    let justifyContent = props.justifyContent ? props.justifyContent : "start"

    let childPadding = 0
    let childHeight = 0

    for (let child of children) {
        childHeight += child.props.height
            ? parseFloat(child.props.height)
            : CHILD_HEIGHT
    }

    switch (justifyContent) {
        case "flex-start":
        case "start":
            // nothing to do
            break
        case "flex-end":
        case "end":
            y = y + height - childHeight
            break
        case "center":
            y = y + (height - childHeight) / 2
            break
        case "space-between":
            childPadding = (height - childHeight) / (children.length - 1)
            break
        case "space-around":
            childPadding = (height - childHeight) / 2
            break
        case "space-evenly":
            childPadding = (height - childHeight) / (children.length + 1)
            break
    }

    for (let child of children) {
        child.props.x = x
        child.props.y = y
        y += child.props.height ? parseFloat(child.props.height) : CHILD_HEIGHT
        y += childPadding
    }

    return <>{children}</>
}
