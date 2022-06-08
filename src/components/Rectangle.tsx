/** @jsxRuntime classic */
/** @jsx createElement */
/** @jsxFrag Fragment */

import { createElement, Fragment } from "../render/"

type RectangleProps = {
    x?: number | string
    y?: number | string
    width?: number | string
    height?: number | string
    fill?: string
    stroke?: string
    strokeWidth?: number
    flex?: number | string
}

export const Rectangle = (props: RectangleProps, children: any) => {
    //console.log("Rectangle", props, children)
    if (children && children.length > 0) {
        return <Fragment>{children}</Fragment>
    } else {
        return null
    }
}
