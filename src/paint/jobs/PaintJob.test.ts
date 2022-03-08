import { PaintJob } from "."
import { AttributeCollection } from "../.."
import { createNode } from "../../render"

describe("PaintJob", () => {
	it("should update rendering context from props", () => {
		let context: AttributeCollection = {}

		let attr = { fill: "red", stroke: "blue", strokeWidth: 2 }

		let node = createNode("layer", { id: "layer-1" }, [], true)
		let job = new PaintJob(node)
		// eslint-disable-next-line testing-library/render-result-naming-convention
		let contextUpdate = job.updateRenderingContextFromProps(context, attr)

		expect(contextUpdate.hasChanged).toBe(true)
		expect(contextUpdate.shouldFill).toBe(true)
		expect(contextUpdate.shouldStroke).toBe(true)
		expect(context.fillStyle).toBe("red")
		expect(context.strokeStyle).toBe("blue")
		expect(context.lineWidth).toBe(2)
	})
	it("should push a canvas to the stack", () => {
		let node = createNode("layer", { id: "layer-1" }, [], true)
		let canvas = document.createElement("canvas")
		canvas.height = 100
		canvas.width = 200

		let job = new PaintJob(node)
		job.paintingContext.canvasStack = []
		job.pushCanvas(canvas)

		expect(job.paintingContext.canvasStack).toStrictEqual([canvas])
	})
	it("should push a pop a canvas from the stack", () => {
		let node = createNode("layer", { id: "layer-1" }, [], true)
		let canvas = document.createElement("canvas")
		canvas.height = 100
		canvas.width = 200

		let job = new PaintJob(node)
		job.paintingContext.canvasStack = [canvas]
		let cv = job.popCanvas()

		expect(cv).toBe(canvas)
		expect(job.paintingContext.canvasStack).toStrictEqual([])
	})
})
