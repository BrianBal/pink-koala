import { PaintJob } from "./PaintJob"
import { Node } from "../../models"

export class CircleJob extends PaintJob {
	constructor(node: Node) {
		super(node)
		this.name = "CircleJob"
	}

	public paint() {
		// parse attributes
		let x = parseFloat(this.node.props.x as string) || 0
		let y = parseFloat(this.node.props.y as string) || 0
		let radius = 50
		if (this.node.props.radius) {
			radius = parseFloat(this.node.props.radius as string) || 50
		} else {
			radius = parseFloat(this.node.props.width as string) || 50
			radius = radius / 2
		}

		// get context
		if (this.canvas) {
			let ctx = this.canvas.getContext("2d")!
			let cu = this.updateRenderingContextFromProps(ctx, this.node.props)
			if (cu.hasChanged) {
				ctx.save()
			}

			// path
			ctx.beginPath()
			ctx.ellipse(
				x + radius,
				y + radius,
				radius,
				radius,
				0,
				0,
				2 * Math.PI
			)

			// fill
			if (cu.shouldFill) {
				ctx.fill()
			}

			// stroke
			if (cu.shouldStroke) {
				ctx.stroke()
			}

			if (cu.hasChanged) {
				ctx.restore()
			}
		}
	}
}
