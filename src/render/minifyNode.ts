import type { Node } from "../models"

export function minifyNode(node: Node): Node {
	let mini = {
		name: node.name,
		type: node.type,
		props: node.props,
		children: node.children,
		alternate: null,
		hooks: node.hooks,
		needsDraw: false,
		cache: node.cache,
	}
	return pruneGrandChildren(mini)
}

export function pruneGrandChildren(node: Node): Node {
	let children = node.children.map(child => {
		let mini = minifyNode(child)
		if (mini.children.length > 0) {
			mini.children = mini.children.map(grandChild => {
				return minifyNode(grandChild)
			})
		}
		return mini
	})
	node.children = children
	return node
}
