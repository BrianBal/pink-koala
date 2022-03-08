import { PaintJob } from "./PaintJob"
import { Node , Path, mkPoint, pointAt } from "../../models"

export class PolygonJob extends PaintJob {
	constructor(node: Node) {
		super(node)
		this.name = "PolygonJob"
	}

	public paint() {
		// parse attributes
		let x = parseFloat(this.node.props.x as string) || 0
		let y = parseFloat(this.node.props.y as string) || 0
		let sides = parseFloat(this.node.props.sides as string) || 5
		let radius = 50
		if (this.node.props.radius) {
			radius = parseFloat(this.node.props.radius as string) || 25
		} else {
			radius = parseFloat(this.node.props.width as string) || 50
			radius = radius / 2
		}

		let center = mkPoint(x + radius, y + radius)
		let angle = (Math.PI * 2) / sides

		let path: Path = []
		for (let i = 0; i < sides; i++) {
			let pt = pointAt(center, angle * i, radius)
			path.push(pt)
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
			let i = 0
			for (let pt of path) {
				if (i === 0) {
					ctx.moveTo(pt.x, pt.y)
				} else {
					ctx.lineTo(pt.x, pt.y)
				}
				if (i === path.length - 1) {
					ctx.closePath()
				}
				i++
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
