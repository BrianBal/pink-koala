import { createNode } from "."
import { createHook } from "../models"
import { StateManager } from "./StateManager"
jest.mock("../paint")

describe("StateManager.workTimerHooks", () => {
	it("should work all the timer hooks", () => {
		let ric = jest.fn()
		ric.mockReturnValueOnce(12)
		global.requestIdleCallback = ric

		let sm = new StateManager()

		let a = createNode("layer", {}, [
			createNode("a", {}, []),
			createNode("b", {}, []),
			createNode("c", {}, []),
		])

		let aVal = 0
		let hook = createHook()
		const tick = () => {
			aVal++
		}
		hook.pendingTicks = [tick]
		hook.state = { delta: -1, lastTick: -1 }
		a.hooks = [hook]

		let bHook = createHook()
		bHook.pendingTicks = [jest.fn()]
		a.children[1].hooks = [bHook]

		sm.workTimerHooks(a)
		expect(aVal).toBe(1)
		expect(a.hooks[0].pendingTicks).toEqual([])
		expect(a.children[1].hooks[0].pendingTicks).toEqual([])
	})
})
