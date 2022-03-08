import { flattenChildren } from "./flattenChildren"
import type { Node } from "../models"
import { createNode } from "./"

describe("flattenChildren", () => {
	it("should flatten children", () => {
		let children: any[] = [
			[
				createNode("a", {}, []),
				createNode("b", {}, []),
				createNode("c", {}, []),
			],
		]
		let fchildren = flattenChildren<Node>(children)
		expect(fchildren.length).toBe(3)
		expect(fchildren).toHaveProperty("0.name", "a")
		expect(fchildren).toHaveProperty("1.name", "b")
		expect(fchildren).toHaveProperty("2.name", "c")
	})
})
