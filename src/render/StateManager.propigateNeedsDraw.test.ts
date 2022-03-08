import { createNode } from "./"
import { StateManager } from "./StateManager"
jest.mock("../paint")

describe("StateManager.propigateNeedsDraw", () => {
	it("should propigate needsDraw everywhere", () => {
		let a = createNode("A", {}, [
			createNode("AA", {}, [
				createNode("AAA", {}, []),
				createNode("AAB", {}, [
					createNode("AABA", {}, [], true),
					createNode("AABB", {}, []),
				]),
				createNode("AAC", {}, []),
			]),
			createNode("AB", {}, [
				createNode("ABA", {}, []),
				createNode("ABB", {}, []),
			]),
		])

		let sm = new StateManager()
		sm.propigateNeedsDraw(a)

		expect(a).toHaveProperty("needsDraw", true) //a
		expect(a).toHaveProperty("children.0.needsDraw", true) //aa
		expect(a).toHaveProperty("children.1.needsDraw", true) //ab
		expect(a).toHaveProperty("children.0.children.0.needsDraw", true) //aaa
		expect(a).toHaveProperty("children.0.children.1.needsDraw", true) //aab
		expect(a).toHaveProperty("children.0.children.2.needsDraw", true) //aac

		expect(a).toHaveProperty(
			"children.0.children.1.children.0.needsDraw",
			true
		) //aaba
		expect(a).toHaveProperty(
			"children.0.children.1.children.1.needsDraw",
			true
		) //aabb
		expect(a).toHaveProperty("children.1.children.0.needsDraw", true) //aba
		expect(a).toHaveProperty("children.1.children.1.needsDraw", true) //abb
	})

	it("should not propigate needsDraw between layers", () => {
		let a = createNode("A", {}, [
			createNode("layer", {}, [
				createNode("AAA", {}, []),
				createNode("AAB", {}, [
					createNode("AABA", {}, [], true),
					createNode("AABB", {}, []),
				]),
				createNode("AAC", {}, []),
			]),
			createNode("layer", {}, [
				createNode("ABA", {}, []),
				createNode("ABB", {}, []),
			]),
		])

		let sm = new StateManager()
		sm.propigateNeedsDraw(a)

		expect(a).toHaveProperty("needsDraw", true) //a
		expect(a).toHaveProperty("children.0.needsDraw", true) //aa
		expect(a).toHaveProperty("children.0.children.0.needsDraw", true) //aaa
		expect(a).toHaveProperty("children.0.children.1.needsDraw", true) //aab
		expect(a).toHaveProperty("children.0.children.2.needsDraw", true) //aac

		expect(a).toHaveProperty(
			"children.0.children.1.children.0.needsDraw",
			true
		) //aaba
		expect(a).toHaveProperty(
			"children.0.children.1.children.1.needsDraw",
			true
		) //aabb

		expect(a).toHaveProperty("children.1.needsDraw", false) //ab
		expect(a).toHaveProperty("children.1.children.0.needsDraw", false) //aba
		expect(a).toHaveProperty("children.1.children.1.needsDraw", false) //abb
	})

	it("should not propigate needsDraw to group", () => {
		let a = createNode("A", {}, [
			createNode("AA", {}, [
				createNode("AAA", {}, []),
				createNode("AAB", {}, [
					createNode("AABA", {}, [], true),
					createNode("AABB", {}, []),
				]),
				createNode("AAC", {}, []),
			]),
			createNode("group", {}, [
				createNode("ABA", {}, []),
				createNode("ABB", {}, []),
			]),
		])

		let sm = new StateManager()
		sm.propigateNeedsDraw(a)

		expect(a).toHaveProperty("needsDraw", true) //a
		expect(a).toHaveProperty("children.0.needsDraw", true) //aa
		expect(a).toHaveProperty("children.0.children.0.needsDraw", true) //aaa
		expect(a).toHaveProperty("children.0.children.1.needsDraw", true) //aab
		expect(a).toHaveProperty("children.0.children.2.needsDraw", true) //aac

		expect(a).toHaveProperty(
			"children.0.children.1.children.0.needsDraw",
			true
		) //aaba
		expect(a).toHaveProperty(
			"children.0.children.1.children.1.needsDraw",
			true
		) //aabb

		expect(a).toHaveProperty("children.1.needsDraw", false) //ab
		expect(a).toHaveProperty("children.1.children.0.needsDraw", false) //aba
		expect(a).toHaveProperty("children.1.children.1.needsDraw", false) //abb
	})
})
