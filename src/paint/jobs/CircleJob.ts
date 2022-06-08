import { PaintJob } from "./PaintJob"
import { Node } from "../../models"

export class CircleJob extends PaintJob {
    constructor(node: Node) {
        super(node)
        this.name = "CircleJob"
    }

    public paint() {
        let frm = this.node.frame!

        // parse attributes
        let radius = frm.width / 2

        // get context
        if (this.canvas) {
            let ctx = this.canvas.getContext("2d")!
            let cu = this.updateRenderingContextFromProps(ctx, this.node.props)
            if (cu.hasChanged) {
                ctx.save()
            }

            // path
            ctx.beginPath()
            ctx.ellipse(
                frm.x + radius,
                frm.y + radius,
                radius,
                radius,
                0,
                0,
                2 * Math.PI
            )

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
