import { createHook } from "../models"
import { getHookState } from "./getHookState"
import { invokeOrReturn } from "./invokeOrReturn"

export function useEventListener(event: string, handler: any, args: any[]) {
    let hookState = getHookState()
    let prevHook = hookState.prevHook
    let context = hookState.context

    if (!context || !context.node) {
        throw new Error(
            "useEventListener must be called from within a render function"
        )
    }

    let hook = createHook()
    hook.state = prevHook
        ? prevHook.state
        : invokeOrReturn(undefined, { event, handler, args })

    context.node!.hooks.push(hook)
    context.hookIndex++
}
