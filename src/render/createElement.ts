import { AttributeCollection } from "../models"
import { Node, mkRect, Rect } from "../models"

export var Fragment = "fragment"

// const fontCanvas = document.createElement("canvas")
// const fontCtx = fontCanvas.getContext("2d")!

export function createNode(
    type: string | Function,
    props: AttributeCollection,
    children: Node[],
    needsDraw: boolean = false
): Node {
    let node = createElement(type, props, ...children)
    node.needsDraw = needsDraw
    return node
}

export function createElement(
    type: string | Function,
    props: AttributeCollection,
    ...children: Node[]
): Node {
    let name: string = ""
    if (typeof type === "string") {
        name = type
    } else if (typeof type === "function") {
        name = type.name
    }

    // if (["text", "string", "pktext"].includes(name)) {
    //     if (children.length > 0) {
    //         props.text = children.join(" ")
    //         children = []
    //     }

    //     // intrinsic width
    //     if (props.font) {
    //         fontCtx.textBaseline = "top"
    //         fontCtx.font = props.font
    //         let size = fontCtx.measureText(props.text || "")
    //         if (size) {
    //             props._intrinsicWidth = size.width
    //             props._intrinsicHeight =
    //                 size.fontBoundingBoxDescent - size.fontBoundingBoxAscent
    //         }
    //     }
    // }

    console.log("createElement", name, props, children)

    return {
        type,
        name,
        props: {
            ...props
        },
        children: children,
        alternate: null,
        hooks: [],
        needsDraw: false,
        cache: null,
        frame: null
    }
}
