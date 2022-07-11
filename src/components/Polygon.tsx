/** @jsxRuntime classic */
/** @jsx createElement */
/** @jsxFrag Fragment */

import { createElement, Fragment } from "../render/"
import type { PKProps } from "./PKProps"

type PolygonProps = {
    radius?: number | string
    sides?: number | string
}

export const Polygon = (props: PolygonProps & PKProps, children: any) => {
    //console.log("Polygon", props, children)
    if (children && children.length > 0) {
        return <Fragment>{children}</Fragment>
    } else {
        return null
    }
}
