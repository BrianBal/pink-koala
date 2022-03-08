export type Point = {
	x: number
	y: number
}

export function mkPoint(x: number, y: number): Point {
	return { x, y }
}

export function pointLerp(a: Point, b: Point, t: number): Point {
	return mkPoint(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t)
}

export function pointAt(p: Point, angle: number, distance: number): Point {
	return pointLerp(
		p,
		mkPoint(
			p.x + Math.cos(angle) * distance,
			p.y + Math.sin(angle) * distance
		),
		1
	)
}
