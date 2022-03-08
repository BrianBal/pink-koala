import { useReducer } from "./useReducer"
import { StateManager } from "../render/StateManager"
import { getSharedSupervisor } from "../render/Supervisor"
import { createNode } from "../render/createElement"
import { createHook } from "../models"

describe("useReducer", () => {
	let sm: StateManager = new StateManager()
	let node = createNode("rectangle", {}, [])

	beforeEach(() => {
		sm = new StateManager()
		getSharedSupervisor().stateManager = sm
		node = createNode("rectangle", {}, [])
		sm.node = node
	})

	it("should set initial state", () => {
		const [state, dispatch] = useReducer((st: any, action: any) => {
			if (action.type === "INCREMENT") {
				return st + 1
			}
			return st
		}, 0)
		expect(state).toBe(0)
	})

	it("should set initial state from init", () => {
		const [state, dispatch] = useReducer(
			(st: any, action: any) => {
				if (action.type === "INCREMENT") {
					return st + 1
				}
				return st
			},
			0,
			(st: any) => st + 3
		)
		expect(state).toBe(3)
	})

	it("should dispatch action and request update", () => {
		sm.requestRootUpdate = jest.fn()
		const [state, dispatch] = useReducer((st: any, action: any) => {
			if (action.type === "INCREMENT") {
				return st + 1
			}
			return st
		}, 0)

		dispatch({ type: "INCREMENT" })

		expect(node.hooks[0].queue[0]).toStrictEqual({ type: "INCREMENT" })
		expect(sm.requestRootUpdate).toHaveBeenCalled()
	})

	it("should load state from alternate", () => {
		let hook = createHook()
		hook.state = 57
		let altNode = { ...node }
		altNode.hooks.push(hook)
		node.alternate = altNode

		const [state, dispatch] = useReducer((st: any, action: any) => {
			if (action.type === "INCREMENT") {
				return st + 1
			}
			return st
		}, 0)

		expect(state).toBe(57)
	})

	it("should update state from actions", () => {
		let hook = createHook()
		hook.state = 57
		hook.queue = [{ type: "INCREMENT" }]
		let altNode = { ...node }
		altNode.hooks.push(hook)
		node.alternate = altNode

		const [state, dispatch] = useReducer((st: any, action: any) => {
			if (action.type === "INCREMENT") {
				return st + 1
			}
			return st
		}, 0)

		expect(state).toBe(58)
	})
})
