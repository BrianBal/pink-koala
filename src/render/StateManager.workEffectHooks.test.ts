import { createNode } from "."
import { createHook } from "../models"
import { StateManager } from "./StateManager"
jest.mock("../paint")

describe("StateManager.workEffectHooks", () => {
	it("should call all pending effects", () => {
		let sm = new StateManager()

		let a = createNode("layer", {}, [
			createNode("a", {}, []),
			createNode("b", {}, []),
		])

		let aVal = 0
		let hook = createHook()
		let unmount = jest.fn()
		const tick = () => {
			aVal++
			return unmount
		}
		hook.pendingEffects = [tick]
		a.hooks = [hook]

		sm.workEffectHooks(a)
		expect(aVal).toBe(1)
		expect(a.hooks[0].pendingTicks).toEqual([])
		expect(a.hooks[0].queue).toEqual([unmount])
	})

	it("should call all queued unmounts", () => {
		let sm = new StateManager()

		let a = createNode("layer", {}, [
			createNode("a", {}, []),
			createNode("b", {}, []),
		])

		let bHook = createHook()
		let bHookUmount = jest.fn()
		bHook.queue = [bHookUmount]
		bHook.pendingEffects = [jest.fn()]
		a.children[0].hooks = [bHook]

		sm.workEffectHooks(a)
		expect(bHookUmount).toBeCalled()
	})
})
