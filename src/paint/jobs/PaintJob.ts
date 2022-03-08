import { Node } from "../../models"
import type { AttributeCollection } from "../../models/AttributeCollection"

type PaintContext = {
	canvas: HTMLCanvasElement | null
	canvasStack: HTMLCanvasElement[]
}

let paintContext: PaintContext = {
	canvas: null,
	canvasStack: [],
}

export class PaintJob {
	public node: Node

	public name: string

	constructor(node: Node) {
		this.name = "PaintJob"
		this.node = node
	}

	public doPainting() {
		this.paint()
	}

	public paint() {}

	public get canvas(): HTMLCanvasElement | null {
		return paintContext.canvas
	}

	public set canvas(val: HTMLCanvasElement | null) {
		paintContext.canvas = val
	}

	public get paintingContext(): PaintContext {
		return paintContext
	}

	public pushCanvas(canvas: HTMLCanvasElement) {
		paintContext.canvasStack.push(canvas)
	}

	public popCanvas(): HTMLCanvasElement | null {
		let c = paintContext.canvasStack.pop()
		if (c) {
			return c
		} else {
			return null
		}
	}

	public updateRenderingContextFromProps(
		ctx: any,
		props: AttributeCollection
	): PaintJobRenderingContextUpdate {
		let hasChanged = false
		let shouldFill = false
		let shouldStroke = false

		const map: AttributeCollection = {
			fill: "fillStyle",
			stroke: "strokeStyle",
			strokeWidth: "lineWidth",
			font: "font",
		}

		for (let key in map) {
			let ctxKey = map[key]
			if (props[key] && ctx[ctxKey] !== props[key]) {
				ctx[ctxKey] = props[key]
				hasChanged = true
			}
			if (key === "fill" && props[key]) {
				shouldFill = true
			}
			if (key === "stroke" && props[key]) {
				shouldStroke = true
			}
		}

		return {
			hasChanged,
			shouldFill,
			shouldStroke,
		}
	}
}

export interface PaintJobRenderingContextUpdate {
	hasChanged: boolean
	shouldFill: boolean
	shouldStroke: boolean
}
