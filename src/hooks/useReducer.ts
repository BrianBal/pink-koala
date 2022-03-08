import { createHook } from "../models"
import { getHookState } from "./getHookState"
import { invokeOrReturn } from "./invokeOrReturn"

type ReducerCallback = (state: any, action: any) => any

export function useReducer(
	reducer: any,
	initialState: any,
	init: any = null
): any[] {
	let hookState = getHookState()
	let prevHook = hookState.prevHook
	let context = hookState.context

	if (!context || !context.node) {
		throw new Error(
			"useReducer must be called from within a render function"
		)
	}

	let hook = createHook()
	if (init) {
		hook.state = init(initialState)
	} else {
		hook.state = prevHook
			? prevHook.state
			: invokeOrReturn(undefined, initialState)
	}

	const actions = prevHook ? prevHook.queue : []
	actions.forEach(action => {
		hook.state = reducer(hook.state, action)
	})
	if (prevHook) {
		prevHook.queue = []
	}

	const dispatch = (action: any) => {
		hook.queue.push(action)
		context?.requestRootUpdate()
	}

	context.node!.hooks.push(hook)
	context.hookIndex++
	return [hook.state, dispatch]
}
