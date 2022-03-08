import { PaintJob } from "./PaintJob"
import { Node } from "../../models"

export class FrameEndJob extends PaintJob {
	constructor(node: Node) {
		super(node)
		this.name = "FrameEndJob"
	}

	public paint() {
		console.log("FrameEnd Job", this.node)
	}
}
