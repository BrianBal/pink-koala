import { CircleJob, RectangleJob } from "."
import { createNode } from "../../render"

describe("CircleJob", () => {
	it("should draw circle", () => {
		let context = {
			fill: jest.fn(),
			stroke: jest.fn(),
			save: jest.fn(),
			beginPath: jest.fn(),
			closePath: jest.fn(),
			ellipse: jest.fn(),
			restore: jest.fn(),
			fillStyle: "",
			strokeStyle: "",
		}
		let canvas = document.createElement("canvas")
		canvas.height = 100
		canvas.width = 200
		canvas.getContext = jest.fn().mockReturnValue(context)

		let node = createNode(
			"circle",
			{
				x: 10,
				y: 8,
				width: 20,
				fill: "#f00",
				stroke: "#0f0",
				strokeWidth: 2,
			},
			[],
			true
		)
		let job = new CircleJob(node)
		job.canvas = canvas
		job.doPainting()

		expect(context.save).toBeCalled()
		expect(context.restore).toBeCalled()
		expect(context.fill).toBeCalled()
		expect(context.stroke).toBeCalled()
		expect(context.ellipse).toBeCalledWith(
			20,
			18,
			10,
			10,
			0,
			0,
			2 * Math.PI
		)
		expect(context.fillStyle).toBe("#f00")
		expect(context.strokeStyle).toBe("#0f0")
	})
})
