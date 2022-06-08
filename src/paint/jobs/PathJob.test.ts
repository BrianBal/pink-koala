import { PathJob } from "."
import { createNode } from "../../render"

describe("PathJob", () => {
    it("should draw path", () => {
        let context = {
            fill: jest.fn(),
            stroke: jest.fn(),
            save: jest.fn(),
            beginPath: jest.fn(),
            moveTo: jest.fn(),
            lineTo: jest.fn(),
            closePath: jest.fn(),
            restore: jest.fn(),
            fillStyle: "",
            strokeStyle: ""
        }
        let canvas = document.createElement("canvas")
        canvas.height = 100
        canvas.width = 200
        canvas.getContext = jest.fn().mockReturnValue(context)

        let node = createNode(
            "path",
            {
                path: [
                    { x: 10, y: 20 },
                    { x: 30, y: 40 },
                    { x: 50, y: 60 }
                ],
                closed: true,
                fill: "#f00",
                stroke: "#0f0",
                strokeWidth: 2
            },
            [],
            true
        )
        node.frame = { x: 10, y: 20, width: 6, height: 20 }
        let job = new PathJob(node)
        job.canvas = canvas
        job.doPainting()

        expect(context.save).toBeCalled()
        expect(context.restore).toBeCalled()

        expect(context.fill).toBeCalled()
        expect(context.stroke).toBeCalled()

        expect(context.beginPath).toBeCalled()
        expect(context.moveTo).toBeCalledWith(20, 40)
        expect(context.lineTo).toBeCalledWith(40, 60)
        expect(context.lineTo).toBeCalledWith(60, 80)
        expect(context.closePath).toBeCalled()

        expect(context.fillStyle).toBe("#f00")
        expect(context.strokeStyle).toBe("#0f0")
    })
})
