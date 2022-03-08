import type { Point } from "./Point"
import { mkPoint, pointLerp } from "./Point"

describe("Point", () => {
	it("should initialize witpointLerp x y values", () => {
		const point = mkPoint(1, 2)
		expect(point.x).toBe(1)
		expect(point.y).toBe(2)
	})

	it("should lerp a to b", () => {
		const a = mkPoint(1, 2)
		const b = mkPoint(3, 4)
		const t = 0.5
		const lerped = pointLerp(a, b, t)
		expect(lerped.x).toBe(2)
		expect(lerped.y).toBe(3)
	})
})
