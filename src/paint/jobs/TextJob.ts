import { PaintJob } from "./PaintJob"
import { Node } from "../../models"

export class TextJob extends PaintJob {
    constructor(node: Node) {
        super(node)
        this.name = "TextJob"
    }

    public paint() {
        // parse attributes
        let x = this.node.frame!.x
        let y = this.node.frame!.y
        let text = (this.node.props.text as string) || ""

        // get context
        if (this.canvas) {
            let ctx = this.canvas.getContext("2d")!
            let cu = this.updateRenderingContextFromProps(ctx, this.node.props)
            if (cu.hasChanged) {
                ctx.save()
            }

            ctx.beginPath()
            let tm = ctx.measureText(text)
            y = y + tm.actualBoundingBoxAscent

            // fill
            if (cu.shouldFill) {
                ctx.fillText(text, x, y)
            }

            // stroke
            if (cu.shouldStroke) {
                ctx.strokeText(text, x, y)
            }

            if (cu.hasChanged) {
                ctx.restore()
            }
        }
    }
}
