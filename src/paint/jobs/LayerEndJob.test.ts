import { LayerEndJob } from "."
import { createNode } from "../../render"
import { getCanvas } from "../getCanvas"
jest.mock("../getCanvas")

const mockedGetCanvas = getCanvas as unknown as jest.Mock<HTMLCanvasElement>

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
		mockedGetCanvas.mockReturnValue(canvas)

		let tmpCanvas = document.createElement("canvas")
		tmpCanvas.height = 100
		tmpCanvas.width = 200
		tmpCanvas.id = "tmp-canvas"

		let node = createNode("layer", { id: "layer-1" }, [], true)
		node.cache = tmpCanvas
		let job = new LayerEndJob(node)
		job.canvas = null
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
		mockedGetCanvas.mockReturnValue(canvas)

		let tmpCanvas = document.createElement("canvas")
		tmpCanvas.height = 100
		tmpCanvas.width = 200
		tmpCanvas.id = "tmp-canvas"

		let node = createNode("layer", { id: "layer-1" }, [], true)
		node.cache = tmpCanvas
		let job = new LayerEndJob(node)
		job.doPainting()

		expect(context.clearRect).toBeCalledWith(0, 0, 200, 100)
		expect(context.drawImage).toBeCalledWith(tmpCanvas, 0, 0)
	})
})
