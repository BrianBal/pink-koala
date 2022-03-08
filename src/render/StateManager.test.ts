import { createNode } from "./"
import { StateManager } from "./StateManager"
import { createHook } from "../models"
import { minifyNode } from "./minifyNode"
jest.mock("../paint")

describe("StateManager", () => {
	it("should initalize", () => {
		let sm = new StateManager()
		expect(sm).toBeDefined()
	})

	/*
	it("should set root", () => {
		let sm = new StateManager()
		sm.root = () => {}
		expect(sm.root).toBeDefined()
		expect(sm).toHaveProperty("_root.name", "root")
		expect(sm).toHaveProperty("unitsOfWork.length", 1)
		expect(sm).toHaveProperty("unitsOfWork.0.name", "root")
	})

	it("should get root", () => {
		let sm = new StateManager()
		sm.root = () => {}
		expect(sm.root).toBeDefined()
		expect(sm).toHaveProperty("root.name", "root")
	})

	it("should request root update", () => {
		let sm = new StateManager()
		sm.currentRoot = createNode("root", { x: 1 }, [])
		sm.requestRootUpdate()

		expect(sm).toHaveProperty("root.name", "root")
		expect(sm).toHaveProperty("root.props", { x: 1 })
		expect(sm).toHaveProperty("root.children", [])
		expect(sm).toHaveProperty("root.alternate", sm.currentRoot)
		expect(sm).toHaveProperty("root.hooks", [])
		expect(sm).toHaveProperty("root.needsDraw", false)
		expect(sm).toHaveProperty("root.cache", null)
	})

	it("should update functional node", () => {
		let sm = new StateManager()
		let a = createNode(
			(props: any) => {
				return [
					createNode("a", {}, []),
					createNode("b", {}, []),
					createNode("c", {}, []),
				]
			},
			{},
			[]
		)
		let next = sm.updateNode(a)
		expect(a.children.length).toBe(3)
		expect(next).toHaveProperty("length", 3)
		expect(next).toHaveProperty("0.name", "a")
		expect(next).toHaveProperty("1.name", "b")
		expect(next).toHaveProperty("2.name", "c")
	})

	it("should update a changed functional node", () => {
		let sm = new StateManager()
		let a = createNode(
			(props: any) => {
				return [
					createNode("a", {}, []),
					createNode("b", {}, []),
					createNode("c", {}, []),
				]
			},
			{ a: 11 },
			[]
		)
		a.alternate = createNode(
			() => {
				return []
			},
			{ a: 12 },
			[]
		)
		let next = sm.updateNode(a)
		expect(a.children.length).toBe(3)
		expect(next).toHaveProperty("length", 3)
		expect(next).toHaveProperty("0.name", "a")
		expect(next).toHaveProperty("1.name", "b")
		expect(next).toHaveProperty("2.name", "c")
	})

	it("should update base node", () => {
		let sm = new StateManager()
		let a = createNode("A", {}, [
			createNode("a", {}, []),
			createNode("b", {}, []),
			createNode("c", {}, []),
		])
		let next = sm.updateNode(a)
		expect(a.children.length).toBe(3)
		expect(next).toHaveProperty("length", 3)
		expect(next).toHaveProperty("0.name", "a")
		expect(next).toHaveProperty("1.name", "b")
		expect(next).toHaveProperty("2.name", "c")
	})

	it("should diff node with null previous version", () => {
		let sm = new StateManager()
		const b = createNode("B", {}, [])
		const a = createNode("A", { x: 1 }, [b])
		let next = sm.diffNode(a, null)
		expect(next).toBeDefined()
		expect(next).toHaveProperty("name", "A")
		expect(next).toHaveProperty("type", "A")
		expect(next).toHaveProperty("props", { x: 1 })
		expect(next).toHaveProperty("children", [b])
		expect(next).toHaveProperty("alternate", null)
		expect(next).toHaveProperty("needsDraw", true)
		expect(next).toHaveProperty("hooks", [])
		expect(next).toHaveProperty("cache", null)
	})

	it("should diff node with previous version no change", () => {
		let sm = new StateManager()
		const bb = createNode("B", {}, [])
		const aa = createNode("A", { x: 1 }, [bb])
		aa.type = "taco"
		aa.hooks = [createHook()]
		aa.cache = "cached value"
		const b = createNode("B", {}, [])
		const a = createNode("A", { x: 1 }, [b])
		a.type = "taco"
		let next = sm.diffNode(a, aa)
		expect(next).toBeDefined()
		expect(next).toHaveProperty("name", "A")
		expect(next).toHaveProperty("type", "taco")
		expect(next).toHaveProperty("props", { x: 1 })
		expect(next).toHaveProperty("children", [b])
		expect(next).toHaveProperty("alternate", minifyNode(aa))
		expect(next).toHaveProperty("needsDraw", false)
		expect(next).toHaveProperty("hooks.length", 1)
		expect(next).toHaveProperty("cache", "cached value")
	})

	it("should diff node with previous version and changes", () => {
		let sm = new StateManager()
		const bb = createNode("B", {}, [])
		const aa = createNode("A", { x: 32 }, [bb])
		aa.type = "taco"
		aa.hooks = [createHook()]
		aa.cache = "cached value"
		const b = createNode("B", {}, [])
		const a = createNode("A", { x: 1 }, [b])
		a.type = "taco"
		let next = sm.diffNode(a, aa)
		expect(next).toBeDefined()
		expect(next).toHaveProperty("name", "A")
		expect(next).toHaveProperty("type", "taco")
		expect(next).toHaveProperty("props", { x: 1 })
		expect(next).toHaveProperty("children", [b])
		expect(next).toHaveProperty("alternate", minifyNode(aa))
		expect(next).toHaveProperty("needsDraw", true)
		expect(next).toHaveProperty("hooks.length", 1)
		expect(next).toHaveProperty("cache", "cached value")
	})

	it("should diff children with no next or previous", () => {
		let sm = new StateManager()
		let { children } = sm.diffChildren([], [])
		expect(children).toHaveProperty("length", 0)
	})

	it("should diff children that are the same", () => {
		let sm = new StateManager()
		let aa = createNode("A", {}, [])
		let bb = createNode("B", {}, [])
		let a = createNode("A", {}, [])
		let b = createNode("B", {}, [])
		let { children, removed } = sm.diffChildren([a, b], [aa, bb])

		expect(children).toHaveProperty("length", 2)
		expect(children).toHaveProperty("0.name", "A")
		expect(children).toHaveProperty("1.name", "B")
		expect(removed).toHaveProperty("length", 0)
	})

	it("should diff children that are the different", () => {
		let sm = new StateManager()
		let aa = createNode("D", {}, [])
		let bb = createNode("C", {}, [])
		let a = createNode("A", {}, [])
		let b = createNode("B", {}, [])
		let { children } = sm.diffChildren([a, b], [aa, bb])

		expect(children).toHaveProperty("length", 2)
		expect(children).toHaveProperty("0.name", "A")
		expect(children).toHaveProperty("1.name", "B")
	})

	it("should diff children that have been removed", () => {
		let sm = new StateManager()
		let aa = createNode("A", {}, [])
		let bb = createNode("B", {}, [])
		let cc = createNode("C", {}, [])
		let a = createNode("A", {}, [])
		let b = createNode("B", {}, [])
		let { children, removed } = sm.diffChildren([a, b], [aa, bb, cc])

		expect(children).toHaveProperty("length", 2)
		expect(children).toHaveProperty("0.name", "A")
		expect(children).toHaveProperty("1.name", "B")
		expect(removed).toHaveProperty("length", 1)
		expect(removed).toHaveProperty("0.name", "C")
	})

	it("should diff children that have been added", () => {
		let sm = new StateManager()
		let aa = createNode("A", {}, [])
		let bb = createNode("B", {}, [])
		let a = createNode("A", {}, [])
		let b = createNode("B", {}, [])
		let c = createNode("C", {}, [])
		let { children, removed } = sm.diffChildren([a, b, c], [aa, bb])

		expect(children).toHaveProperty("length", 3)
		expect(children).toHaveProperty("0.name", "A")
		expect(children).toHaveProperty("1.name", "B")
		expect(children).toHaveProperty("2.name", "C")
		expect(removed).toHaveProperty("length", 0)
	})

	it("should perform the next unit of work", () => {
		let sm = new StateManager()
		let a = createNode("A", {}, [
			createNode("B", {}, []),
			createNode("C", {}, []),
			createNode("D", {}, []),
		])
		sm.unitsOfWork = [a]
		sm.performNextUnitOfWork()
		expect(sm).toHaveProperty("unitsOfWork.length", 3)
		expect(sm).toHaveProperty("unitsOfWork.0.name", "B")
		expect(sm).toHaveProperty("unitsOfWork.1.name", "C")
		expect(sm).toHaveProperty("unitsOfWork.2.name", "D")

		sm.performNextUnitOfWork()
		expect(sm).toHaveProperty("unitsOfWork.length", 2)
		expect(sm).toHaveProperty("unitsOfWork.0.name", "C")
		expect(sm).toHaveProperty("unitsOfWork.1.name", "D")
	})

	it("should perform next unit of work and commit _root when complete", () => {
		let sm = new StateManager()
		sm.commitRoot = jest.fn()
		let a = createNode("A", {}, [createNode("B", {}, [])])
		sm.root = (props: any) => {
			return a
		}
		sm.performNextUnitOfWork()
		sm.performNextUnitOfWork()
		sm.performNextUnitOfWork()
		sm.performNextUnitOfWork()
		expect(sm.commitRoot).toHaveBeenCalledTimes(1)
	})

	it("should step until work is complete", () => {
		let sm = new StateManager()
		let a = createNode("A", {}, [createNode("B", {}, [])])
		sm.root = (props: any) => {
			return a
		}
		sm.step({
			timeRemaining: () => {
				return 2
			},
			didTimeout: false,
		})
		expect(sm.unitsOfWork.length).toBe(0)
		expect(sm.root).toBe(null)
		expect(sm).toHaveProperty("currentRoot.name", "root")
		expect(sm).toHaveProperty("currentRoot.children.length", 1)
		expect(sm).toHaveProperty("currentRoot.children.0.name", "A")
		expect(sm).toHaveProperty("currentRoot.children.0.children.0.name", "B")
	})

	it("should step until time runs out", () => {
		let timeRemaining = jest.fn()
		timeRemaining.mockReturnValueOnce(2)
		timeRemaining.mockReturnValueOnce(1.1)
		timeRemaining.mockReturnValueOnce(0)

		let sm = new StateManager()
		let a = createNode("A", {}, [
			createNode("B", {}, []),
			createNode("C", {}, []),
			createNode("D", {}, []),
			createNode("E", {}, []),
		])
		sm.root = (props: any) => {
			return a
		}
		sm.step({
			timeRemaining,
			didTimeout: false,
		})
		expect(timeRemaining).toHaveBeenCalledTimes(3)
		expect(sm).toHaveProperty("root.name", "root")
		expect(sm).toHaveProperty("currentRoot", null)
		expect(sm).toHaveProperty("unitsOfWork.length", 4)
		expect(sm).toHaveProperty("unitsOfWork.0.name", "B")
		expect(sm).toHaveProperty("unitsOfWork.1.name", "C")
		expect(sm).toHaveProperty("unitsOfWork.2.name", "D")
		expect(sm).toHaveProperty("unitsOfWork.3.name", "E")
	})

	it("should step and continue previous work until done", () => {
		let timeRemaining = jest.fn()
		timeRemaining.mockReturnValueOnce(2)
		timeRemaining.mockReturnValueOnce(1.1)
		timeRemaining.mockReturnValueOnce(0)
		timeRemaining.mockReturnValue(1.1)

		let sm = new StateManager()
		let a = createNode("A", {}, [
			createNode("B", {}, []),
			createNode("C", {}, []),
			createNode("D", {}, []),
			createNode("E", {}, []),
		])
		sm.root = (props: any) => {
			return a
		}
		sm.step({
			timeRemaining,
			didTimeout: false,
		})
		expect(timeRemaining).toHaveBeenCalledTimes(3)
		expect(sm).toHaveProperty("root.name", "root")
		expect(sm).toHaveProperty("currentRoot", null)
		expect(sm).toHaveProperty("unitsOfWork.length", 4)

		sm.step({
			timeRemaining,
			didTimeout: false,
		})
		expect(sm).toHaveProperty("root", null)
		expect(sm).toHaveProperty("currentRoot.name", "root")
		expect(sm).toHaveProperty("unitsOfWork.length", 0)
	})
	*/
})
