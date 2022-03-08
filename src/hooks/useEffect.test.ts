import { useEffect } from "./useEffect"
import { StateManager } from "../render/StateManager"
import { getSharedSupervisor } from "../render/Supervisor"
import { createNode } from "../render/createElement"
import { createHook } from "../models"

describe("useEffect", () => {
	let sm: StateManager = new StateManager()
	let node = createNode("rectangle", {}, [])

	beforeEach(() => {
		sm = new StateManager()
		getSharedSupervisor().stateManager = sm
		node = createNode("rectangle", {}, [])
		sm.node = node
	})

	it("should initialize with queued pending effects and args", () => {
		let count = 0
		const callback = () => {}
		useEffect(callback, [12])

		expect(count).toBe(0)
		expect(node.hooks.length).toBe(1)
		expect(node.hooks[0].queue.length).toBe(0)
		expect(node.hooks[0].state).toStrictEqual([12])
		expect(node.hooks[0].pendingTicks.length).toBe(0)
		expect(node.hooks[0].pendingUnmount.length).toBe(0)
		expect(node.hooks[0].pendingEffects.length).toBe(1)
		expect(node.hooks[0].pendingEffects[0]).toStrictEqual(callback)
	})

	it("should queue pending effects and update args after change", () => {
		let hook = createHook()
		hook.state = [57]
		let altNode = { ...node }
		altNode.hooks.push(hook)
		node.hooks = []
		node.alternate = altNode

		useEffect(() => {}, [7])

		expect(node.hooks.length).toBe(1)
		expect(node.hooks[0].state).toStrictEqual([7])
		expect(node.hooks[0].pendingEffects.length).toBe(1)
	})
})
