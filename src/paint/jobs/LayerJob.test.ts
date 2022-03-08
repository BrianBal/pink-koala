import { LayerJob } from "."
import { createNode } from "../../render"
import { getCanvas } from "../getCanvas"
jest.mock("../getCanvas")

const mockedGetCanvas = getCanvas as unknown as jest.Mock<HTMLCanvasElement>

describe("LayerJob", () => {
	it("should create cache canvas", () => {
		let canvas = document.createElement("canvas")
		canvas.height = 100
		canvas.width = 200
		mockedGetCanvas.mockReturnValue(canvas)

		let node = createNode("layer", { id: "layer-1" }, [], true)
		let job = new LayerJob(node)
		job.doPainting()

		expect(node.cache).toBeInstanceOf(HTMLCanvasElement)
		expect(node.cache.height).toBe(100)
		expect(node.cache.width).toBe(200)
	})

	it("should not create a new cache canvas if one is already there", () => {
		let canvas = document.createElement("canvas")
		canvas.height = 100
		canvas.width = 200
		mockedGetCanvas.mockReturnValue(canvas)

		let tmpCanvas = document.createElement("canvas")
		tmpCanvas.height = 100
		tmpCanvas.width = 200
		tmpCanvas.id = "tmp-canvas"
		tmpCanvas.getContext = jest
			.fn()
			.mockReturnValue({ clearRect: jest.fn() })

		let node = createNode("layer", { id: "layer-1" }, [], true)
		node.cache = tmpCanvas
		let job = new LayerJob(node)
		job.doPainting()

		expect(node.cache).toBe(tmpCanvas)
	})

	it("should set paint context canvas", () => {
		let canvas = document.createElement("canvas")
		canvas.id = "layer-1"
		canvas.height = 100
		canvas.width = 200
		mockedGetCanvas.mockReturnValue(canvas)

		let tmpContext = {
			clearRect: jest.fn(),
		}
		let tmpCanvas = document.createElement("canvas")
		tmpCanvas.height = 100
		tmpCanvas.width = 200
		tmpCanvas.id = "tmp-canvas"
		tmpCanvas.getContext = jest.fn().mockReturnValue(tmpContext)

		let node = createNode("layer", { id: "layer-1" }, [], true)
		node.cache = tmpCanvas
		let job = new LayerJob(node)
		job.doPainting()

		expect(job.canvas).toBe(tmpCanvas)
	})

	it("should clear tmp canvas", () => {
		let canvas = document.createElement("canvas")
		canvas.id = "layer-1"
		canvas.height = 100
		canvas.width = 200
		mockedGetCanvas.mockReturnValue(canvas)

		let tmpContext = {
			clearRect: jest.fn(),
		}

		let tmpCanvas = document.createElement("canvas")
		tmpCanvas.height = 100
		tmpCanvas.width = 200
		tmpCanvas.id = "tmp-canvas"
		tmpCanvas.getContext = jest.fn().mockReturnValue(tmpContext)

		let node = createNode("layer", { id: "layer-1" }, [], true)
		node.cache = tmpCanvas
		let job = new LayerJob(node)
		job.doPainting()

		expect(tmpContext.clearRect).toBeCalledWith(0, 0, 200, 100)
	})
})
