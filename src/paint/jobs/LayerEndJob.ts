import { PaintJob } from "./PaintJob"
import { Node } from "../../models"
import { getCanvas } from "../getCanvas"

export class LayerEndJob extends PaintJob {
	constructor(node: Node) {
		super(node)
		this.name = "LayerEndJob"
	}

	public paint() {
		let canvas = getCanvas(this.node.props.id)
		if (canvas) {
			let origContext = canvas.getContext("2d")!
			origContext.clearRect(0, 0, canvas.width, canvas.height)
			origContext.drawImage(this.node.cache, 0, 0)

			// reset the paint context canvas
			this.canvas = canvas
		}
	}
}
