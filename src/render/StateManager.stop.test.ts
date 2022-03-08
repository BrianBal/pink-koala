import { StateManager } from "./StateManager"
jest.mock("../paint")

describe("StateManager.stop", () => {
	it("should stop", () => {
		let ric = jest.fn()
		global.cancelIdleCallback = ric

		let sm = new StateManager()
		sm.isRunning = true
		sm.stepCallbackId = 3
		sm.stop()

		expect(ric).toHaveBeenCalledWith(3)
		expect(sm.isRunning).toBe(false)
		expect(sm.stepCallbackId).toBeNull()
	})

	it("should not stop if not running", () => {
		let ric = jest.fn()
		global.cancelIdleCallback = ric

		let sm = new StateManager()
		sm.isRunning = false
		sm.stepCallbackId = null
		sm.stop()

		expect(ric).toHaveBeenCalledTimes(0)
		expect(sm.isRunning).toBe(false)
		expect(sm.stepCallbackId).toBeNull()
	})
})
