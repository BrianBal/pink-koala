import { PaintJob } from "./PaintJob"
import { Node } from "../../models"

let groupId = 0
export class GroupJob extends PaintJob {
    constructor(node: Node) {
        super(node)
        this.name = "GroupJob"
    }

    public paint() {
        let frm = this.node.frame!

        if (this.canvas) {
            this.pushCanvas(this.canvas)
            let tmpCanvas = this.node.cache as HTMLCanvasElement | null
            if (!tmpCanvas) {
                tmpCanvas = document.createElement("canvas")
                tmpCanvas.id = `tmp-group-canvas-${groupId++}`
                tmpCanvas.height = frm.height
                tmpCanvas.width = frm.width
                this.node.cache = tmpCanvas
            }
            let tmpContext = tmpCanvas.getContext("2d")
            if (tmpContext) {
                tmpContext.clearRect(frm.x, frm.y, frm.width, frm.height)
                this.canvas = tmpCanvas
            }
        }
    }
}
