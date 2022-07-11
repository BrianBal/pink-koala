/** @jsxRuntime classic */
/** @jsx createElement */
/** @jsxFrag Fragment */

import { createElement, Fragment } from "../render/"
import type { PKProps } from "./PKProps"

type TextProps = {
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

export const Text = (props: TextProps & PKProps, children: any) => {
    let attr: TextAttr = { text: "" }
    if (props.x) {
        attr.x = props.x as number
    }
    if (props.y) {
        attr.y = props.y as number
    }
    if (props.width) {
        attr.width = props.width as number
    }
    if (props.height) {
        attr.height = props.height as number
    }
    if (props.fill) {
        attr.fill = props.fill as string
    }
    if (props.stroke) {
        attr.stroke = props.stroke as string
    }
    if (props.strokeWidth) {
        attr.strokeWidth = props.strokeWidth as number
    }
    if (props.font) {
        attr.font = props.font as string
    }

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
