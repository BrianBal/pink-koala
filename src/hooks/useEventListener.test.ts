import { useEventListener } from "./useEventListener"
import { StateManager } from "../render/StateManager"
import { getSharedSupervisor } from "../render/Supervisor"
import { createNode } from "../render/createElement"

describe("useEventListener", () => {
	let sm: StateManager = new StateManager()
	let node = createNode("rectangle", {}, [])

	beforeEach(() => {
		sm = new StateManager()
		getSharedSupervisor().stateManager = sm
		node = createNode("rectangle", {}, [])
		sm.node = node
	})

	it("should add event litener", () => {
		document.addEventListener = jest.fn()
		useEventListener("click", () => {}, [])
		expect(node.hooks.length).toBe(1)
		expect(node.hooks[0].pendingEffects.length).toBe(1)

		let effect = node.hooks[0].pendingEffects[0]
		effect()
		expect(document.addEventListener).toHaveBeenCalledWith(
			"click",
			expect.any(Function)
		)
	})

	it("should remove event litener", () => {
		document.addEventListener = jest.fn()
		document.removeEventListener = jest.fn()
		useEventListener("click", () => {}, [])
		expect(node.hooks.length).toBe(1)
		expect(node.hooks[0].pendingEffects.length).toBe(1)

		let effect = node.hooks[0].pendingEffects[0]
		let unmount = effect()
		if (unmount) {
			unmount()
		}
		expect(document.removeEventListener).toHaveBeenCalledWith(
			"click",
			expect.any(Function)
		)
	})
})
