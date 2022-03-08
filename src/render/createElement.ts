import { AttributeCollection } from "../models"
import type { Node } from "../models"

export var Fragment = "fragment"

export function createNode(
	type: string | Function,
	props: AttributeCollection,
	children: Node[],
	needsDraw: boolean = false
): Node {
	let node = createElement(type, props, ...children)
	node.needsDraw = needsDraw
	return node
}

export function createElement(
	type: string | Function,
	props: AttributeCollection,
	...children: Node[]
): Node {
	let name: string = ""
	if (typeof type === "string") {
		name = type
	} else if (typeof type === "function") {
		name = type.name
	}

	if (name === "text" || name === "string") {
		if (children.length > 0) {
			props.text = children.join(" ")
			children = []
		}
	}

	return {
		type,
		name,
		props: {
			...props,
		},
		children: children,
		alternate: null,
		hooks: [],
		needsDraw: false,
		cache: null,
	}
}
