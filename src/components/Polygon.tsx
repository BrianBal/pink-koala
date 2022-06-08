/** @jsxRuntime classic */
/** @jsx createElement */
/** @jsxFrag Fragment */

import { createElement, Fragment } from "../render/"

type PolygonProps = {
    x?: number | string
    y?: number | string
    width?: number | string
    height?: number | string
    radius?: number | string
    sides?: number | string
    fill?: string
    stroke?: string
    strokeWidth?: number
    flex?: number | string
}

export const Polygon = (props: PolygonProps, children: any) => {
    //console.log("Polygon", props, children)
    if (children && children.length > 0) {
        return <Fragment>{children}</Fragment>
    } else {
        return null
    }
}
