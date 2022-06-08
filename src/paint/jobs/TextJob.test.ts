import { TextJob } from "."
import { createNode } from "../../render"

describe("TextJob", () => {
    it("should draw text", () => {
        let context = {
            fillText: jest.fn(),
            strokeText: jest.fn(),
            save: jest.fn(),
            restore: jest.fn(),
            font: "",
            fillStyle: "",
            strokeStyle: "",
            lineWidth: 1,
            beginPath: jest.fn(),
            closePath: jest.fn(),
            measureText: jest
                .fn()
                .mockReturnValue({ actualBoundingBoxAscent: 1 })
        }
        let canvas = document.createElement("canvas")
        canvas.height = 100
        canvas.width = 200
        canvas.getContext = jest.fn().mockReturnValue(context)

        let node = createNode(
            "text",
            {
                font: "12px Arial",
                text: "Hello World",
                fill: "#f00",
                stroke: "#0f0",
                strokeWidth: 2
            },
            [],
            true
        )
        node.frame = { x: 10, y: 20, width: 30, height: 40 }
        let job = new TextJob(node)
        job.canvas = canvas
        job.doPainting()

        expect(context.save).toBeCalled()
        expect(context.restore).toBeCalled()

        expect(context.fillText).toBeCalledWith("Hello World", 10, 21)
        expect(context.strokeText).toBeCalledWith("Hello World", 10, 21)

        expect(context.fillStyle).toBe("#f00")
        expect(context.strokeStyle).toBe("#0f0")
        expect(context.lineWidth).toBe(2)
        expect(context.font).toBe("12px Arial")
    })
})
