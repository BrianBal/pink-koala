import { PaintJob } from "./PaintJob"
import { Node, Points } from "../../models"

export class PathJob extends PaintJob {
    constructor(node: Node) {
        super(node)
        this.name = "PathJob"
    }

    public paint() {
        let frm = this.node.frame!

        // parse attributes
        let closePath = this.node.props.closed ? this.node.props.closed : false
        let path: Points = (this.node.props.path as Points) || []

        // get context
        if (this.canvas) {
            let ctx = this.canvas.getContext("2d")!
            let cu = this.updateRenderingContextFromProps(ctx, this.node.props)

            // save context
            if (cu.hasChanged) {
                ctx.save()
            }

            // path
            ctx.beginPath()
            let i = 0
            for (let pt of path) {
                if (i === 0) {
                    ctx.moveTo(frm.x + pt.x, frm.y + pt.y)
                } else {
                    ctx.lineTo(frm.x + pt.x, frm.y + pt.y)
                }
                i++
            }

            // close path
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

            // restore context
            if (cu.hasChanged) {
                ctx.restore()
            }
        }
    }
}
