import { useTicker } from "./useTicker"
import { StateManager } from "../render/StateManager"
import { getSharedSupervisor } from "../render/Supervisor"
import { createNode } from "../render/createElement"
import { createHook } from "../models"

describe("useTicker", () => {
	let sm: StateManager = new StateManager()
	let node = createNode("rectangle", {}, [])

	beforeEach(() => {
		sm = new StateManager()
		getSharedSupervisor().stateManager = sm
		node = createNode("rectangle", {}, [])
		sm.node = node
	})

	it("should ticker hook", () => {
		const tick = () => {}
		useTicker(tick)
		expect(node.hooks.length).toBe(1)
		expect(node.hooks[0].pendingTicks.length).toBe(1)
	})

	it("should update from prev hook", () => {
		let hook = createHook()
		hook.state = { delta: 4, lastTick: 70 }
		let altNode = { ...node }
		altNode.hooks.push(hook)
		node.alternate = altNode
		node.hooks = []

		const tick = () => {}
		useTicker(tick)
		expect(node.hooks.length).toBe(1)
		expect(node.hooks[0].state.delta).toBe(4)
		expect(node.hooks[0].state.lastTick).toBe(70)
	})

	it("should tick on tick", () => {
		let hook = createHook()
		hook.state = { delta: 4, lastTick: 70 }
		let altNode = { ...node }
		altNode.hooks.push(hook)
		node.alternate = altNode
		node.hooks = []

		let mockNow = jest.fn()
		mockNow.mockReturnValue(100)
		Date.now = mockNow

		const tick = jest.fn()
		useTicker(tick)
		node.hooks[0].pendingTicks[0]()

		expect(node.hooks.length).toBe(1)
		expect(node.hooks[0].state.delta).toBe(30)
		expect(node.hooks[0].state.lastTick).toBe(100)
		expect(tick).toHaveBeenCalledTimes(1)
	})
})
