import { createNode } from "."
import { StateManager } from "./StateManager"
jest.mock("../paint")

describe("StateManager.step", () => {
	it("should work timer hooks", () => {
		// let cic = jest.fn()
		// let ric = jest.fn()
		// global.requestIdleCallback = ric
		// global.cancelIdleCallback = cic
		// let sm = new StateManager()
		// sm.AUTO_LOOP = false
		// sm.workTimerHooks = jest.fn()
		// sm.performNextUnitOfWork = jest.fn(() => {
		// 	sm._root = null
		// })
		// sm.workEffectHooks = jest.fn()
		// sm.currentRoot = createNode("layer", {}, [])
		// sm._root = null
		// sm.step({
		// 	timeRemaining: () => 3,
		// 	didTimeout: false,
		// })
		// expect(sm.workTimerHooks).toHaveBeenCalledWith(sm.currentRoot)
	})

	it("should call performNextUnitOfWork", () => {
		// let cic = jest.fn()
		// let ric = jest.fn()
		// global.requestIdleCallback = ric
		// global.cancelIdleCallback = cic
		// let sm = new StateManager()
		// sm.AUTO_LOOP = false
		// sm.workTimerHooks = jest.fn()
		// sm.performNextUnitOfWork = jest.fn(() => {
		// 	sm._root = null
		// })
		// sm.workEffectHooks = jest.fn()
		// sm.root = createNode("layer", {}, [])
		// sm.step({
		// 	timeRemaining: () => 3,
		// 	didTimeout: false,
		// })
		// expect(sm.performNextUnitOfWork).toHaveBeenCalled()
	})

	it("should call workEffectHooks", () => {
		// let cic = jest.fn()
		// let ric = jest.fn()
		// global.requestIdleCallback = ric
		// global.cancelIdleCallback = cic
		// let sm = new StateManager()
		// sm.AUTO_LOOP = false
		// sm.workTimerHooks = jest.fn()
		// sm.performNextUnitOfWork = jest.fn(() => {
		// 	sm._root = null
		// })
		// sm.workEffectHooks = jest.fn()
		// sm.unitsOfWork = []
		// sm._root = null
		// sm.currentRoot = createNode("layer", {}, [])
		// sm.step({
		// 	timeRemaining: () => 3,
		// 	didTimeout: false,
		// })
		// expect(sm.workEffectHooks).toHaveBeenCalledTimes(1)
	})

	it("should loop", () => {
		// let cic = jest.fn()
		// let ric = jest.fn(() => 23)
		// global.requestIdleCallback = ric
		// global.cancelIdleCallback = cic
		// let sm = new StateManager()
		// sm.AUTO_LOOP = false
		// sm.workTimerHooks = jest.fn()
		// sm.performNextUnitOfWork = jest.fn(() => {
		// 	sm._root = null
		// })
		// sm.workEffectHooks = jest.fn()
		// sm.stepCallbackId = 5
		// sm.isRunning = true
		// sm.step({
		// 	timeRemaining: () => 3,
		// 	didTimeout: false,
		// })
		// expect(cic).toHaveBeenCalledWith(5)
		// expect(sm).toHaveProperty("stepCallbackId", 23)
		// expect(ric).toHaveBeenCalled()
	})
})
