import { useState } from "./useState"
import { StateManager } from "../render/StateManager"
import { getSharedSupervisor } from "../render/Supervisor"
import { createNode } from "../render/createElement"
import { createHook } from "../models"

describe("useState", () => {
	let sm: StateManager = new StateManager()
	let node = createNode("rectangle", {}, [])

	beforeEach(() => {
		sm = new StateManager()
		getSharedSupervisor().stateManager = sm
		node = createNode("rectangle", {}, [])
		sm.node = node
	})

	it("should set initial state", () => {
		const [num, setNum] = useState(1)
		expect(num).toBe(1)
	})

	it("should set initial state from method", () => {
		const genNumber = () => {
			return 3
		}
		const [num, setNum] = useState(genNumber)
		expect(num).toBe(3)
	})

	it("should queue next value and request update", () => {
		sm.requestRootUpdate = jest.fn()
		const [num, setNum] = useState(1)
		setNum(45)

		expect(node.hooks[0].queue[0]).toBe(45)
		expect(sm.requestRootUpdate).toHaveBeenCalled()
	})

	it("should load state from alternate", () => {
		let hook = createHook()
		hook.state = 57
		let altNode = { ...node }
		altNode.hooks.push(hook)
		node.alternate = altNode

		const [num, setNum] = useState(1)
		expect(num).toBe(57)
	})

	it("should update state from actions", () => {
		let hook = createHook()
		hook.state = 57
		hook.queue = [77]
		let altNode = { ...node }
		altNode.hooks.push(hook)
		node.alternate = altNode

		const [num, setNum] = useState(1)
		expect(num).toBe(77)
	})
})
