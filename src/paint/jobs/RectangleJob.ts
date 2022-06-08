import { PaintJob } from "./PaintJob"
import { Node } from "../../models"

export class RectangleJob extends PaintJob {
    constructor(node: Node) {
        super(node)
        this.name = "RectangleJob"
    }

    public paint() {
        // parse attributes
        let frm = this.node.frame!

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
                console.log(
                    "RectanbleJob.paint fill",
                    frm.x,
                    frm.y,
                    frm.width,
                    frm.height
                )
                ctx.fillRect(frm.x, frm.y, frm.width, frm.height)
            }

            // stroke
            if (cu.shouldStroke) {
                ctx.strokeRect(frm.x, frm.y, frm.width, frm.height)
            }

            if (cu.hasChanged) {
                ctx.restore()
            }
        }
    }
}
