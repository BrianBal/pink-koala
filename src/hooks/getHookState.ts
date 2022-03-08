import type { Hook } from "../models"
import { StateManager } from "../render/StateManager"
import { getSharedSupervisor } from "../render/Supervisor"

type HookState = {
	context: StateManager | null
	prevHook: Hook | null
}

export function getHookState(): HookState {
	let hook: Hook | null = null
	let context: StateManager | null = getSharedSupervisor().currentContext

	if (context) {
		if (context.node) {
			hook =
				context.node.alternate &&
				context.node.alternate.hooks &&
				context.node.alternate.hooks[context.hookIndex]
		}
	}

	return {
		context,
		prevHook: hook,
	}
}
