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
			closePath: jest.fn(),
		}
		let canvas = document.createElement("canvas")
		canvas.height = 100
		canvas.width = 200
		canvas.getContext = jest.fn().mockReturnValue(context)

		let node = createNode(
			"rectangle",
			{
				x: 10,
				y: 8,
				width: 50,
				height: 60,
				fill: "#f00",
				stroke: "#0f0",
				strokeWidth: 2,
			},
			[],
			true
		)
		let job = new RectangleJob(node)
		job.canvas = canvas
		job.doPainting()

		expect(context.save).toBeCalled()
		expect(context.restore).toBeCalled()
		expect(context.fillRect).toBeCalledWith(10, 8, 50, 60)
		expect(context.strokeRect).toBeCalledWith(10, 8, 50, 60)
		expect(context.fillStyle).toBe("#f00")
		expect(context.strokeStyle).toBe("#0f0")
	})
})
