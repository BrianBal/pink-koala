import { PaintJob } from "./PaintJob"
import { Node, Points, mkPoint, pointAt } from "../../models"

export class PolygonJob extends PaintJob {
    constructor(node: Node) {
        super(node)
        this.name = "PolygonJob"
    }

    public paint() {
        let frm = this.node.frame!

        // parse attributes
        let radius = 10
        if (frm.width && frm.height) {
            if (frm.width > frm.height) {
                radius = frm.height / 2
            } else {
                radius = frm.width / 2
            }
        } else if (frm.width) {
            radius = frm.width / 2
        } else if (frm.height) {
            radius = frm.height / 2
        }
        let sides = parseFloat(this.node.props.sides as string) || 5

        let center = mkPoint(frm.x + radius, frm.y + radius)
        let angle = (Math.PI * 2) / sides

        let path: Points = []
        for (let i = 0; i < sides; i++) {
            let pt = pointAt(center, angle * i, radius)
            path.push(pt)
        }

        // get context
        if (this.canvas) {
            let ctx = this.canvas.getContext("2d")!
            let cu = this.updateRenderingContextFromProps(ctx, this.node.props)

            // save context
            if (cu.hasChanged) {
                ctx.save()
            }

            // build path
            ctx.beginPath()
            let i = 0
            for (let pt of path) {
                if (i === 0) {
                    ctx.moveTo(pt.x, pt.y)
                } else {
                    ctx.lineTo(pt.x, pt.y)
                }
                if (i === path.length - 1) {
                    ctx.closePath()
                }
                i++
            }

            // fill
            if (cu.shouldFill) {
                ctx.fill()
            }

            // stroke
            if (cu.shouldStroke) {
                ctx.stroke()
            }

            // restore
            if (cu.hasChanged) {
                ctx.restore()
            }
        }
    }
}
