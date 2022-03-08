import { StateManager } from "./StateManager"
jest.mock("../paint")

describe("StateManager.start", () => {
	it("should start", () => {
		let ric = jest.fn()
		ric.mockReturnValueOnce(12)
		global.requestIdleCallback = ric

		let sm = new StateManager()
		sm.isRunning = false
		sm.start()

		expect(ric).toHaveBeenCalledWith(sm.step)
		expect(sm.isRunning).toBe(true)
		expect(sm.stepCallbackId).toBe(12)
	})

	it("should not start if running", () => {
		let ric = jest.fn()
		ric.mockReturnValueOnce(12)
		global.requestIdleCallback = ric

		let sm = new StateManager()
		sm.isRunning = true
		sm.stepCallbackId = 2
		sm.start()

		expect(ric).toHaveBeenCalledTimes(0)
		expect(sm.isRunning).toBe(true)
		expect(sm.stepCallbackId).toBe(2)
	})
})
