import { havePropsChanged } from "./havePropsChanged"
import type { AttributeCollection } from "../models"

describe("havePropsChanged", () => {
	it("should return true if number props are different", () => {
		const a: AttributeCollection = {
			x: 0,
			y: 0,
		}
		const b: AttributeCollection = {
			x: 1,
			y: 0,
		}
		let result = havePropsChanged(a, b)
		expect(result).toBe(true)
	})
	it("should return true if number props are the same", () => {
		const a: AttributeCollection = {
			x: 0,
			y: 0,
		}
		const b: AttributeCollection = {
			x: 0,
			y: 0,
		}
		let result = havePropsChanged(a, b)
		expect(result).toBe(false)
	})
	it("should return true if string props are different", () => {
		const a: AttributeCollection = {
			x: "0",
			y: "0",
		}
		const b: AttributeCollection = {
			x: "1",
			y: "0",
		}
		let result = havePropsChanged(a, b)
		expect(result).toBe(true)
	})
	it("should return false if string props are the same", () => {
		const a: AttributeCollection = {
			x: "0",
			y: "0",
		}
		const b: AttributeCollection = {
			x: "0",
			y: "0",
		}
		let result = havePropsChanged(a, b)
		expect(result).toBe(false)
	})
	it("should return false if object props are the same", () => {
		const a: AttributeCollection = {
			x: {
				x: 0,
				y: 0,
			},
			y: {
				x: 0,
				y: 0,
			},
		}
		const b: AttributeCollection = {
			x: {
				x: 0,
				y: 0,
			},
			y: {
				x: 0,
				y: 0,
			},
		}
		let result = havePropsChanged(a, b)
		expect(result).toBe(false)
	})
	it("should return true if object props are different", () => {
		const a: AttributeCollection = {
			x: {
				x: 0,
				y: 0,
			},
		}
		const b: AttributeCollection = {
			x: {
				x: 1,
				y: 0,
			},
		}
		let result = havePropsChanged(a, b)
		expect(result).toBe(true)
	})
	it("should return false if array props are the same", () => {
		const a = [1, 2, 3]
		const b = [1, 2, 3]
		let result = havePropsChanged(a, b)
		expect(result).toBe(false)
	})
	it("should return true if array props are different", () => {
		const a = [1, 2, 3]
		const b = [1, 2, 5]
		let result = havePropsChanged(a, b)
		expect(result).toBe(true)
	})
})
