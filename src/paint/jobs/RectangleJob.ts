import { PaintJob } from "./PaintJob"
import { Node } from "../../models"

export class RectangleJob extends PaintJob {
	constructor(node: Node) {
		super(node)
		this.name = "RectangleJob"
	}

	public paint() {
		// parse attributes
		let x = parseFloat(this.node.props.x as string) || 0
		let y = parseFloat(this.node.props.y as string) || 0
		let width = parseFloat(this.node.props.width as string) || 50
		let height = parseFloat(this.node.props.height as string) || 50

		// get context
		if (this.canvas) {
			let ctx = this.canvas.getContext("2d")!
			let cu = this.updateRenderingContextFromProps(ctx, this.node.props)
			if (cu.hasChanged) {
				ctx.save()
			}

			ctx.beginPath()

			// fill
			if (cu.shouldFill) {
				ctx.fillRect(x, y, width, height)
			}

			// stroke
			if (cu.shouldStroke) {
				ctx.strokeRect(x, y, width, height)
			}

			if (cu.hasChanged) {
				ctx.restore()
			}
		}
	}
}
