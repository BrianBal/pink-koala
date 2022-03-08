import type { Rect } from "./Rect"
import {
	mkRect,
	rectTop,
	rectBottom,
	rectLeft,
	rectRight,
	rectCenter,
	rectContains,
	rectIntersects,
} from "./Rect"
import { mkPoint } from "./Point"

describe("Rect", () => {
	it("should initialize with x, y, width, height", () => {
		let rect = mkRect(1, 2, 3, 4)
		expect(rect.x).toBe(1)
		expect(rect.y).toBe(2)
		expect(rect.width).toBe(3)
		expect(rect.height).toBe(4)
	})

	it("should get left", () => {
		let rect = mkRect(20, 50, 100, 200)
		expect(rectLeft(rect)).toBe(20)
	})

	it("should get right", () => {
		let rect = mkRect(20, 50, 100, 200)
		expect(rectRight(rect)).toBe(120)
	})

	it("should get top", () => {
		let rect = mkRect(20, 50, 100, 200)
		expect(rectTop(rect)).toBe(50)
	})

	it("should get bottom", () => {
		let rect = mkRect(20, 50, 100, 200)
		expect(rectBottom(rect)).toBe(250)
	})

	it("should get center", () => {
		let rect = mkRect(20, 50, 100, 200)
		let center = rectCenter(rect)
		expect(center.x).toBe(70)
		expect(center.y).toBe(150)
	})

	it("should contain point", () => {
		let rect = mkRect(20, 50, 100, 200)
		let point = mkPoint(21, 55)
		expect(rectContains(rect, point)).toBe(true)
	})

	it("should not contain point", () => {
		let rect = mkRect(20, 50, 100, 200)
		let point = mkPoint(0, 0)
		expect(rectContains(rect, point)).toBe(false)
	})

	it("should intersect with rect", () => {
		let rect = mkRect(20, 50, 100, 200)
		let rect2 = mkRect(40, 60, 100, 200)
		expect(rectIntersects(rect, rect2)).toBe(true)
	})

	it("should not intersect with rect", () => {
		let rect = mkRect(20, 50, 100, 200)
		let rect2 = mkRect(0, 0, 10, 20)
		expect(rectIntersects(rect, rect2)).toBe(false)
	})
})
