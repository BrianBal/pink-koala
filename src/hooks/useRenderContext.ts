import { useReducer } from "./useReducer"
import { createHook } from "../models"
import { getHookState } from "./getHookState"
import { invokeOrReturn } from "./invokeOrReturn"
import type { Node } from "../models"

type RenderContextProperties = {
    rootWidth: number
    rootHeight: number
    nodeRef: Node | null
}

export function useRenderContext(): RenderContextProperties {
    const { context } = getHookState()

    let value: RenderContextProperties = {
        rootWidth: 0,
        rootHeight: 0,
        nodeRef: null
    }
    if (context) {
        value = {
            rootWidth: context.size.width,
            rootHeight: context.size.height,
            nodeRef: context.node
        }
    }
    return value
}
