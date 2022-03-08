import type { Point } from "./Point"
import { mkPoint } from "./Point"
import { mkRect } from "./Rect"
import type { Rect } from "./Rect"

export type Path = Point[]

export function pathCenter(path: Path): Point {
	return mkPoint(
		path.reduce((acc, curr) => acc + curr.x, 0) / path.length,
		path.reduce((acc, curr) => acc + curr.y, 0) / path.length
	)
}

export function pathBounds(path: Path): Rect {
	let minX = path.reduce((acc, curr) => Math.min(acc, curr.x), path[0].x)
	let minY = path.reduce((acc, curr) => Math.min(acc, curr.y), path[0].y)
	let maxX = path.reduce((acc, curr) => Math.max(acc, curr.x), path[0].x)
	let maxY = path.reduce((acc, curr) => Math.max(acc, curr.y), path[0].y)
	return mkRect(minX, minY, maxX - minX, maxY - minY)
}
