import { GroupJob } from "."
import { createNode } from "../../render"
import { getCanvas } from "../getCanvas"
jest.mock("../getCanvas")

const mockedGetCanvas = getCanvas as unknown as jest.Mock<HTMLCanvasElement>

describe("GroupJob", () => {
    it("should create cache canvas, and save current canvas to stack", () => {
        let canvas = document.createElement("canvas")
        canvas.height = 100
        canvas.width = 200

        let node = createNode("group", { id: "layer-1" }, [], true)
        node.frame = { x: 10, y: 20, width: 6, height: 20 }
        let job = new GroupJob(node)
        job.canvas = canvas
        job.pushCanvas = jest.fn()
        job.doPainting()

        expect(node.cache).toBeInstanceOf(HTMLCanvasElement)
        expect(node.cache.height).toBe(20)
        expect(node.cache.width).toBe(6)
        expect(job.pushCanvas).toHaveBeenCalledWith(canvas)
    })

    it("should not create a new cache canvas if one is already there", () => {
        let canvas = document.createElement("canvas")
        canvas.height = 100
        canvas.width = 200

        let tmpCanvas = document.createElement("canvas")
        tmpCanvas.height = 100
        tmpCanvas.width = 200
        tmpCanvas.id = "tmp-canvas"
        tmpCanvas.getContext = jest
            .fn()
            .mockReturnValue({ clearRect: jest.fn() })

        let node = createNode("group", { id: "layer-1" }, [], true)
        node.frame = { x: 10, y: 20, width: 100, height: 300 }
        node.cache = tmpCanvas
        let job = new GroupJob(node)
        job.canvas = canvas
        job.pushCanvas = jest.fn()
        job.doPainting()

        expect(node.cache).toBe(tmpCanvas)
        expect(job.pushCanvas).toHaveBeenCalledWith(canvas)
    })

    it("should set paint context canvas", () => {
        let canvas = document.createElement("canvas")
        canvas.id = "layer-1"
        canvas.height = 100
        canvas.width = 200

        let tmpContext = {
            clearRect: jest.fn()
        }
        let tmpCanvas = document.createElement("canvas")
        tmpCanvas.height = 100
        tmpCanvas.width = 200
        tmpCanvas.id = "tmp-canvas"
        tmpCanvas.getContext = jest.fn().mockReturnValue(tmpContext)

        let node = createNode("group", { id: "layer-1" }, [], true)
        node.cache = tmpCanvas
        node.frame = { x: 10, y: 20, width: 200, height: 100 }
        let job = new GroupJob(node)
        job.canvas = canvas
        job.pushCanvas = jest.fn()
        job.doPainting()

        expect(job.canvas).toBe(tmpCanvas)
    })

    it("should clear tmp canvas", () => {
        let canvas = document.createElement("canvas")
        canvas.id = "layer-1"
        canvas.height = 100
        canvas.width = 200

        let tmpContext = {
            clearRect: jest.fn()
        }

        let tmpCanvas = document.createElement("canvas")
        tmpCanvas.height = 100
        tmpCanvas.width = 200
        tmpCanvas.id = "tmp-canvas"
        tmpCanvas.getContext = jest.fn().mockReturnValue(tmpContext)

        let node = createNode("group", { id: "layer-1" }, [], true)
        node.cache = tmpCanvas
        node.frame = { x: 10, y: 20, width: 50, height: 60 }
        let job = new GroupJob(node)
        job.canvas = canvas
        job.pushCanvas = jest.fn()
        job.doPainting()

        expect(tmpContext.clearRect).toBeCalledWith(10, 20, 50, 60)
    })
})
