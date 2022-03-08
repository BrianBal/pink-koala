import type { Node } from "./Node"

export type EffectHookCallback = () => EffectHookCallback | null | void
export type TickHookCallback = (now: number, delta: number) => void

export type Hook = {
	state: any
	queue: any[]
	pendingEffects: EffectHookCallback[]
	pendingTicks: EffectHookCallback[]
	pendingUnmount: EffectHookCallback[]
}

export function createHook(): Hook {
	return {
		state: {},
		queue: [],
		pendingEffects: [],
		pendingTicks: [],
		pendingUnmount: [],
	}
}
