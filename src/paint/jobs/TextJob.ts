import { PaintJob } from "./PaintJob"
import { Node } from "../../models"

export class TextJob extends PaintJob {
	constructor(node: Node) {
		super(node)
		this.name = "TextJob"
	}

	public paint() {
		// parse attributes
		let x = parseFloat(this.node.props.x as string) || 0
		let y = parseFloat(this.node.props.y as string) || 0
		let text = (this.node.props.text as string) || "Hello World"

		// get context
		if (this.canvas) {
			let ctx = this.canvas.getContext("2d")!
			let cu = this.updateRenderingContextFromProps(ctx, this.node.props)
			if (cu.hasChanged) {
				ctx.save()
			}

			ctx.beginPath()
			let tm = ctx.measureText(text)
			y = y + tm.actualBoundingBoxAscent

			// fill
			if (cu.shouldFill) {
				ctx.fillText(text, x, y)
			}

			// stroke
			if (cu.shouldStroke) {
				ctx.strokeText(text, x, y)
			}

			if (cu.hasChanged) {
				ctx.restore()
			}
		}
	}
}
