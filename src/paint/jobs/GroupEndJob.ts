import { PaintJob } from "./PaintJob"
import { Node } from "../../models"

export class GroupEndJob extends PaintJob {
    constructor(node: Node) {
        super(node)
        this.name = "GroupEndJob"
    }

    public paint() {
        let frm = this.node.frame!

        if (this.node.needsDraw) {
            let canvas = this.popCanvas()
            if (canvas) {
                let origContext = canvas.getContext("2d")!
                origContext.drawImage(this.node.cache, frm.x, frm.y)

                // reset the paint context canvas
                this.canvas = canvas
            }
        } else {
            let canvas = this.canvas
            if (canvas && this.node.cache) {
                let ctx = canvas.getContext("2d")
                ctx?.drawImage(this.node.cache, frm.x, frm.y)
            }
        }
    }
}
