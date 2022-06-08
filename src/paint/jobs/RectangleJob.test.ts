import { RectangleJob } from "."
import { createNode } from "../../render"

describe("RectangleJob", () => {
    it("should draw rectangle", () => {
        let context = {
            fillRect: jest.fn(),
            strokeRect: jest.fn(),
            save: jest.fn(),
            restore: jest.fn(),
            fillStyle: "",
            strokeStyle: "",
            beginPath: jest.fn(),
            closePath: jest.fn()
        }
        let canvas = document.createElement("canvas")
        canvas.height = 100
        canvas.width = 200
        canvas.getContext = jest.fn().mockReturnValue(context)

        let node = createNode(
            "rectangle",
            {
                fill: "#f00",
                stroke: "#0f0",
                strokeWidth: 2
            },
            [],
            true
        )
        node.frame = { x: 10, y: 20, width: 30, height: 40 }
        let job = new RectangleJob(node)
        job.canvas = canvas
        job.doPainting()

        expect(context.save).toBeCalled()
        expect(context.restore).toBeCalled()
        expect(context.fillRect).toBeCalledWith(10, 20, 30, 40)
        expect(context.strokeRect).toBeCalledWith(10, 20, 30, 40)
        expect(context.fillStyle).toBe("#f00")
        expect(context.strokeStyle).toBe("#0f0")
    })
})
