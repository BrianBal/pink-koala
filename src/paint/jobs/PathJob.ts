import { PaintJob } from "./PaintJob"
import { Node, Path } from "../../models"

export class PathJob extends PaintJob {
	constructor(node: Node) {
		super(node)
		this.name = "PathJob"
	}

	public paint() {
		// parse attributes
		let closePath = this.node.props.closed ?? false
		let path: Path = (this.node.props.path as Path) || []

		// get context
		if (this.canvas) {
			let ctx = this.canvas.getContext("2d")!
			let cu = this.updateRenderingContextFromProps(ctx, this.node.props)
			if (cu.hasChanged) {
				ctx.save()
			}

			// path
			ctx.beginPath()
			let i = 0
			for (let pt of path) {
				if (i === 0) {
					ctx.moveTo(pt.x, pt.y)
				} else {
					ctx.lineTo(pt.x, pt.y)
				}
				i++
			}
			if (closePath) {
				ctx.closePath()
			}

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
