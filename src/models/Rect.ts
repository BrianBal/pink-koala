import type { Point } from "./Point"
import { mkPoint } from "./Point"

export type Rect = {
    x: number
    y: number
    width: number
    height: number
}

export function mkRect(
    x: number,
    y: number,
    width: number,
    height: number
): Rect {
    return { x, y, width, height }
}

export function rectLeft(rect: Rect): number {
    return rect.x
}

export function rectRight(rect: Rect): number {
    return rect.x + rect.width
}

export function rectTop(rect: Rect): number {
    return rect.y
}

export function rectBottom(rect: Rect): number {
    return rect.y + rect.height
}

export function rectCenter(rect: Rect): Point {
    return mkPoint(rect.x + rect.width / 2, rect.y + rect.height / 2)
}

export function rectContains(rect: Rect, point: Point): boolean {
    return (
        point.x >= rectLeft(rect) &&
        point.x <= rectRight(rect) &&
        point.y >= rectTop(rect) &&
        point.y <= rectBottom(rect)
    )
}

export function rectIntersects(a: Rect, b: Rect): boolean {
    return (
        rectLeft(a) <= rectRight(b) &&
        rectRight(a) >= rectLeft(b) &&
        rectTop(a) <= rectBottom(b) &&
        rectBottom(a) >= rectTop(b)
    )
}
