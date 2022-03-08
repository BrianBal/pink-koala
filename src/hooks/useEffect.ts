import type { EffectHookCallback } from "../models"
import { createHook } from "../models"
import { getHookState } from "./getHookState"
import { haveArgsChanged } from "./haveArgsChanged"

export function useEffect(callback: EffectHookCallback, args: any[]) {
	let hookState = getHookState()
	let prevHook = hookState.prevHook
	let context = hookState.context

	if (!context || !context.node) {
		throw new Error(
			"useReducer must be called from within a render function"
		)
	}

	let hook = createHook()
	if (prevHook) {
		hook.state = prevHook.state
		hook.queue = prevHook.queue
	}

	if (haveArgsChanged(args, prevHook?.state)) {
		hook.pendingEffects.push(callback)
		hook.state = args
	}
	context.node.hooks.push(hook)
	context.hookIndex++
}
