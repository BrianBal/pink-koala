/** @jsxRuntime classic */
/** @jsx createElement */
/** @jsxFrag Fragment */
import { mkRect, Node } from "../models"
import { createElement, Fragment } from "../render/"
import { useLayoutEffect, useRenderContext } from "../hooks"
import { translateFrame } from "../render/translateFrame"

export function Column(props: any, children: any) {
    console.log("Column.props", props)
    console.log("Column.children", children)

    // let height = props.height ? parseFloat(props.height) : 0
    let justifyContent = props.justifyContent ? props.justifyContent : "start"
    let alignItems = props.alignItems ? props.alignItems : "start"

    useLayoutEffect(() => {
        const { nodeRef } = useRenderContext()
        if (nodeRef) {
            let x = nodeRef.frame!.x
            let y = nodeRef.frame!.y
            let width: number | null = null
            if (props.width) {
                width = nodeRef.frame!.width
            }
            let height: number | null = null
            if (props.height) {
                height = nodeRef.frame!.height
            }
            const refChildren = nodeRef.children[0].children

            let childPadding = 0
            let childWidth = 0
            let childHeight = 0
            let flexCount = 0
            let flexibleHight = height ? height : 0

            // find flex count of children
            for (let child of refChildren) {
                if (child.props.flex) {
                    try {
                        let flexNum = parseInt(child.props.flex, 10)
                        flexCount += flexNum
                    } catch (e) {
                        console.warn(e)
                    }
                } else if (child.frame) {
                    flexibleHight -= child.frame.height
                }
            }

            // update child frames and calculate column height and width
            for (let child of refChildren) {
                console.log(
                    "Column.useLayoutEffect start",
                    child.name,
                    child.frame
                )
                if (child.frame && child.props.flex && height) {
                    try {
                        let flexNum = parseInt(child.props.flex, 10)
                        let flexRatio = flexNum / flexCount
                        child.frame.height = flexRatio * flexibleHight
                        console.log(
                            "Column: flex height",
                            child.name,
                            child.frame.height,
                            flexRatio
                        )
                        childHeight += child.frame.height
                        childWidth = Math.max(childWidth, child.frame.width)
                    } catch (e) {
                        console.warn(e)
                    }
                } else if (child.frame) {
                    childHeight += child.frame.height
                    childWidth = Math.max(childWidth, child.frame.width)
                } else {
                    console.error("Column: child has no frame", child)
                }
            }

            // update the real col element frame width
            if (width === null) {
                width = childWidth
                nodeRef.frame!.width = width
            }
            nodeRef.children[0].frame!.width = width

            // update the real col element frame height
            if (height === null) {
                height = childHeight
                nodeRef.frame!.height = height
            }
            nodeRef.children[0].frame!.height = height

            // justify content
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
                    childPadding =
                        (height - childHeight) / (children.length - 1)
                    break
                case "space-around":
                    childPadding = (height - childHeight) / 2
                    break
                case "space-evenly":
                    childPadding =
                        (height - childHeight) / (children.length + 1)
                    break
            }

            // align items
            for (let child of refChildren) {
                if (!child.frame) {
                    child.frame = mkRect(0, 0, 0, 0)
                    console.error("Column: child has no frame", child)
                }
                let cx = x
                let cw = child.frame.width
                switch (alignItems) {
                    case "flex-start":
                    case "start":
                        // nothing to do
                        break
                    case "flex-end":
                    case "end":
                        cx = x + width - child.frame.width
                        break
                    case "center":
                    case "baseline":
                        cx = x + (width - child.frame.width) / 2
                        break
                    case "stretch":
                        cw = width
                        // nothing to do
                        break
                }

                translateFrame(child, cx, y)
                child.frame.width = cw
                console.log(
                    "Column.useLayoutEffect end",
                    child.name,
                    child.frame
                )
                y += child.frame.height
                y += childPadding
            }
        }
    }, [children, justifyContent, alignItems])

    return <Fragment>{children}</Fragment>
}

function findBoxWidth(node: Node, depth = 0): number {
    let width = 0
    if (node.props) {
        if (node.props.width) {
            width = parseFloat(node.props.width)
        } else if (node.props._intrinsicWidth) {
            width = parseFloat(node.props._intrinsicWidth)
        } else if (node.children) {
            for (let child of node.children) {
                let cw = findBoxWidth(child, depth + 1)
                if (cw > width) {
                    width = cw
                }
            }
        }
    } else {
        console.error("findBoxWidth: node has no props", node)
    }
    console.log("findBoxWidth", node.name, width, node)
    return width
}
