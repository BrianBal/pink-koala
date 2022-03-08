import { PolygonJob } from "."
import { createNode } from "../../render"

describe("PolygonJob", () => {
	it("should draw polygon", () => {
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
				y: 20,
				sides: 3,
				width: 6,
				fill: "#f00",
				stroke: "#0f0",
				strokeWidth: 2,
			},
			[],
			true
		)
		let job = new PolygonJob(node)
		job.canvas = canvas
		job.doPainting()

		expect(context.save).toBeCalled()
		expect(context.restore).toBeCalled()

		expect(context.fill).toBeCalled()
		expect(context.stroke).toBeCalled()

		expect(context.beginPath).toBeCalled()
		expect(context.moveTo).toBeCalledWith(16, 23)
		expect(context.lineTo).toBeCalledTimes(2)
		expect(context.closePath).toBeCalled()

		expect(context.fillStyle).toBe("#f00")
		expect(context.strokeStyle).toBe("#0f0")
	})
})
