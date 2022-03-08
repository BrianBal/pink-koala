import { PaintJob } from "./PaintJob"
import { Node } from "../../models"
import { getCanvas } from "../getCanvas"
let canvasId = 0

export class LayerJob extends PaintJob {
	constructor(node: Node) {
		super(node)
		this.name = "LayerJob"
	}

	public paint() {
		let canvas = getCanvas(this.node.props.id)
		if (canvas) {
			let tmpCanvas = this.node.cache as HTMLCanvasElement | null
			if (!tmpCanvas) {
				tmpCanvas = document.createElement("canvas")
				tmpCanvas.id = `tmp-layer-canvas-${canvasId++}`
				tmpCanvas.height = canvas.height
				tmpCanvas.width = canvas.width
				this.node.cache = tmpCanvas
			}
			let tmpContext = tmpCanvas.getContext("2d")
			if (tmpContext) {
				tmpContext.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height)
				this.canvas = tmpCanvas
			}
		}
	}
}
