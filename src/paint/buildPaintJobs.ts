import {
    PaintJob,
    LayerJob,
    LayerEndJob,
    RectangleJob,
    TextJob,
    CircleJob,
    PathJob,
    PolygonJob,
    FrameJob,
    FrameEndJob,
    GroupJob,
    GroupEndJob
} from "./jobs"
import { Node } from "../models"

export function buildPaintJobs(node: Node): PaintJob[] {
    let jobs: PaintJob[] = []

    if (node.needsDraw) {
        // paint jobs
        switch (node.name) {
            case "layer":
            case "pklayer":
                jobs.push(new LayerJob(node))
                break

            case "frame":
            case "pkframe":
                jobs.push(new FrameJob(node))
                break

            case "Group":
            case "group":
            case "pkgroup":
                jobs.push(new GroupJob(node))
                break

            case "Rectangle":
            case "rect":
            case "pkrect":
            case "rectangle":
            case "pkrectangle":
                jobs.push(new RectangleJob(node))
                break

            case "string":
            case "pkstring":
            case "text":
            case "pktext":
                jobs.push(new TextJob(node))
                break

            case "Circle":
            case "circle":
            case "pkcircle":
                jobs.push(new CircleJob(node))
                break

            case "Path":
            case "path":
            case "pkpath":
                jobs.push(new PathJob(node))
                break

            case "Polygon":
            case "polygon":
            case "pkpolygon":
                jobs.push(new PolygonJob(node))
                break
        }

        // children jobs
        for (let child of node.children) {
            jobs = jobs.concat(buildPaintJobs(child))
        }

        // cleanup jobs
        switch (node.name) {
            case "layer":
            case "pklayer":
                jobs.push(new LayerEndJob(node))
                break

            case "frame":
            case "pkframe":
                jobs.push(new FrameEndJob(node))
                break

            case "Group":
            case "group":
            case "pkgroup":
                jobs.push(new GroupEndJob(node))
                break
        }
    } else {
        // some items still need to draw from cache
        switch (node.name) {
            case "Group":
            case "group":
            case "pkgroup":
                jobs.push(new GroupEndJob(node))
                break
        }
    }

    return jobs
}
