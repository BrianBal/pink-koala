/** @jsxRuntime classic */
/** @jsx createElement */
/** @jsxFrag Fragment */

import { createElement, Fragment } from "../render"

type GroupProps = {
    x?: number | string
    y?: number | string
    width?: number | string
    height?: number | string
    flex?: number | string
}

export const Group = (props: GroupProps, children: any) => {
    //console.log("Path", props, children)
    if (children && children.length > 0) {
        return <Fragment>{children}</Fragment>
    } else {
        return null
    }
}
