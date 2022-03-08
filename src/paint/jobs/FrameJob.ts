import { PaintJob } from "./PaintJob"
import { Node } from "../../models"

export class FrameJob extends PaintJob {
	constructor(node: Node) {
		super(node)
		this.name = "FrameJob"
	}

	public paint() {
		console.log("Frame Job", this.node)
	}
}
