/** @jsxRuntime classic */
/** @jsx createElement */
/** @jsxFrag Fragment */
import { Points } from "../models"

import { createElement, Fragment } from "../render"

type PathProps = {
    x?: number | string
    y?: number | string
    width?: number | string
    height?: number | string
    closed?: boolean | string
    path?: Points
    fill?: string
    stroke?: string
    strokeWidth?: number
    flex?: number | string
}

export const Path = (props: PathProps, children: any) => {
    //console.log("Path", props, children)
    if (children && children.length > 0) {
        return <Fragment>{children}</Fragment>
    } else {
        return null
    }
}
