/** @jsxRuntime classic */
/** @jsx createElement */
/** @jsxFrag Fragment */

import { createElement, Fragment } from "../render/"

type CircleProps = {
    x?: number | string
    y?: number | string
    width?: number | string
    height?: number | string
    radius?: number | string
    fill?: string
    stroke?: string
    strokeWidth?: number
    flex?: number | string
}

export const Circle = (props: CircleProps, children: any) => {
    //console.log("Circle", props, children)
    if (children && children.length > 0) {
        return <Fragment>{children}</Fragment>
    } else {
        return null
    }
}
