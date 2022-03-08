import { createNode } from "."
import { createHook } from "../models"
import { StateManager } from "./StateManager"
jest.mock("../paint")

describe("StateManager.workUnmountHooks", () => {
	it("should call all unmount effects", () => {
		let sm = new StateManager()

		let a = createNode("layer", {}, [
			createNode("a", {}, []),
			createNode("b", {}, []),
		])

		let aVal = 0
		let hook = createHook()
		const tick = () => {
			aVal++
		}
		hook.pendingUnmount = [tick]
		a.hooks = [hook]

		sm.workUmountHooks(a)
		expect(aVal).toBe(1)
		expect(a.hooks[0].pendingUnmount).toEqual([])
	})
})
