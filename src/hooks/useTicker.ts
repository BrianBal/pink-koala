import { getHookState } from "./getHookState"
import { createHook } from "../models"
import type { EffectHookCallback, TickHookCallback } from "../models"

export function useTicker(callback: TickHookCallback) {
	let hookState = getHookState()
	let prevHook = hookState.prevHook
	let context = hookState.context

	if (!context || !context.node) {
		throw new Error(
			"useTicker must be called from within a render function"
		)
	}

	const hook = createHook()
	hook.state = prevHook ? prevHook.state : { now: -1, delta: -1 }

	const onTick = (): EffectHookCallback | null => {
		let now = Date.now()
		let delta = -1
		if (prevHook && prevHook.state.lastTick > 0) {
			delta = now - prevHook.state.lastTick
		}
		hook.state = { lastTick: now, delta }
		callback(now, delta)
		return null
	}
	hook.pendingTicks.push(onTick)

	context.node.hooks.push(hook)
	context.hookIndex++
}
