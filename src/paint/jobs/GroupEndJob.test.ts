import { GroupEndJob } from "."
import { createNode } from "../../render"
import { getCanvas } from "../getCanvas"
jest.mock("../getCanvas")

describe("LayerEndJob", () => {
	it("should restore paint context canvas", () => {
		let context = {
			drawImage: jest.fn(),
			clearRect: jest.fn(),
		}
		let canvas = document.createElement("canvas")
		canvas.height = 100
		canvas.width = 200
		canvas.id = "main"
		canvas.getContext = jest.fn().mockReturnValue(context)

		let tmpCanvas = document.createElement("canvas")
		tmpCanvas.height = 100
		tmpCanvas.width = 200
		tmpCanvas.id = "tmp-canvas"

		let node = createNode("layer", { id: "layer-1" }, [], true)
		node.cache = tmpCanvas
		let job = new GroupEndJob(node)
		job.canvas = null
		job.popCanvas = jest.fn().mockReturnValue(canvas)
		job.doPainting()

		expect(job.canvas).toBe(canvas)
	})

	it("should draw tmp canvas into real canvas", () => {
		let context = {
			drawImage: jest.fn(),
			clearRect: jest.fn(),
		}
		let canvas = document.createElement("canvas")
		canvas.height = 100
		canvas.width = 200
		canvas.id = "main"
		canvas.getContext = jest.fn().mockReturnValue(context)

		let tmpCanvas = document.createElement("canvas")
		tmpCanvas.height = 100
		tmpCanvas.width = 200
		tmpCanvas.id = "tmp-canvas"

		let node = createNode("layer", { id: "layer-1" }, [], true)
		node.cache = tmpCanvas
		let job = new GroupEndJob(node)
		job.popCanvas = jest.fn().mockReturnValue(canvas)
		job.doPainting()

		expect(context.clearRect).toHaveBeenCalledTimes(0)
		expect(context.drawImage).toBeCalledWith(tmpCanvas, 0, 0)
	})
})
