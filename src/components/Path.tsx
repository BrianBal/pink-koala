/** @jsxRuntime classic */
/** @jsx createElement */
/** @jsxFrag Fragment */
import { Points } from "../models"

import { createElement, Fragment } from "../render"
import type { PKProps } from "./PKProps"

type PathProps = {
    closed?: boolean | string
    path?: Points
}

export const Path = (props: PathProps & PKProps, children: any) => {
    //console.log("Path", props, children)
    if (children && children.length > 0) {
        return <Fragment>{children}</Fragment>
    } else {
        return null
    }
}
