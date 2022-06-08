import type { Node } from "../models"

export function translateFrame(node: Node, x: number, y: number): void {
    if (node.frame) {
        node.frame.x += x
        node.frame.y += y
    }
    for (let child of node.children) {
        translateFrame(child, x, y)
    }
}
