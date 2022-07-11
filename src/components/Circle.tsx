/** @jsxRuntime classic */
/** @jsx createElement */
/** @jsxFrag Fragment */

import { createElement, Fragment } from "../render/"
import type { PKProps } from "./PKProps"

type CircleProps = {
    radius?: number | string
}

export const Circle = (props: CircleProps & PKProps, children: any) => {
    //console.log("Circle", props, children)
    if (children && children.length > 0) {
        return <Fragment>{children}</Fragment>
    } else {
        return null
    }
}
