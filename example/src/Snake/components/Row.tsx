/** @jsxRuntime classic */
/** @jsx createElement */
/** @jsxFrag Fragment */
import { createElement, Fragment } from "pink-koala"

const CHILD_WIDTH = 100

export function Row(props: any, children: any) {
    console.log("Row.props", props)
    console.log("Row.children", children)

    let x = props.x ? parseFloat(props.x) : 0
    let y = props.y ? parseFloat(props.y) : 0
    let width = props.width ? parseFloat(props.width) : 0
    // let height = props.height ? parseFloat(props.height) : 0
    let justifyContent = props.justifyContent ? props.justifyContent : "start"

    let childPadding = 0
    let childWidth = 0

    for (let child of children) {
        childWidth += child.props.width
            ? parseFloat(child.props.width)
            : CHILD_WIDTH
    }

    switch (justifyContent) {
        case "flex-start":
        case "start":
            // nothing to do
            break
        case "flex-end":
        case "end":
            x = x + width - childWidth
            break
        case "center":
            x = x + (width - childWidth) / 2
            break
        case "space-between":
            childPadding = (width - childWidth) / (children.length - 1)
            break
        case "space-around":
            childPadding = (width - childWidth) / 2
            break
        case "space-evenly":
            childPadding = (width - childWidth) / (children.length + 1)
            break
    }

    for (let child of children) {
        child.props.x = x
        child.props.y = y
        x += child.props.width ? parseFloat(child.props.width) : CHILD_WIDTH
        x += childPadding
    }

    return <>{children}</>
}
