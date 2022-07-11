/** @jsxRuntime classic */
/** @jsx createElement */
/** @jsxFrag Fragment */

import { createElement, Fragment } from "../render"
import type { PKProps } from "./PKProps"

type GroupProps = {}

export const Group = (props: GroupProps & PKProps, children: any) => {
    //console.log("Path", props, children)
    if (children && children.length > 0) {
        return <Fragment>{children}</Fragment>
    } else {
        return null
    }
}
