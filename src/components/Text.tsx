/** @jsxRuntime classic */
/** @jsx createElement */
/** @jsxFrag Fragment */

import { createElement, Fragment } from "../render/"

type TextProps = {
    x?: number
    y?: number
    width?: number
    height?: number
    fill?: string
    stroke?: string
    strokeWidth?: number
    font?: string
}
type TextAttr = {
    text: string
    x?: number
    y?: number
    width?: number
    height?: number
    fill?: string
    stroke?: string
    strokeWidth?: number
    font?: string
    _intrinsicWidth?: number
    _intrinsicHeight?: number
}

const fontCanvas = document.createElement("canvas")
const fontCtx = fontCanvas.getContext("2d")!

export const Text = (props: TextProps, children: any) => {
    let attr: TextAttr = { ...props, text: "" }

    // find intrinsic width and height
    let text = ""
    if (children && children.length > 0) {
        text = children.join(" ")
    }
    attr.text = text

    // intrinsic width
    if (props.font) {
        fontCtx.textBaseline = "top"
        fontCtx.font = props.font
        let size = fontCtx.measureText(text || "")
        if (size) {
            attr._intrinsicWidth = size.width
            attr._intrinsicHeight =
                size.fontBoundingBoxDescent - size.fontBoundingBoxAscent
        }
    }

    return <pktext {...attr} />
}
