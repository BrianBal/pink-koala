/** @jsxRuntime classic */
/** @jsx createElement */
/** @jsxFrag Fragment */

import { createElement, Fragment } from "../render/"
import { useRenderContext } from "../hooks"

type LayerProps = {
    id: string
}

export const Layer = (props: LayerProps, children: any) => {
    const { rootWidth, rootHeight } = useRenderContext()
    const attr = {
        ...props,
        width: rootWidth,
        height: rootHeight
    }
    return <pklayer {...attr}>{children}</pklayer>
}
