/** @jsxRuntime classic */
/** @jsx createElement */
/** @jsxFrag Fragment */

import { createElement, Fragment } from "../render/"
import type { PKProps } from "./PKProps"

type RectangleProps = {}

export const Rectangle = (props: RectangleProps & PKProps, children: any) => {
    //console.log("Rectangle", props, children)
    if (children && children.length > 0) {
        return <Fragment>{children}</Fragment>
    } else {
        return null
    }
}
