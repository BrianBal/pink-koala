import { Node } from "../models"
import { PaintJob } from "./jobs"
import { buildPaintJobs } from "./buildPaintJobs"

let queue: PaintJob[] = []

export function paint(node: Node): void {
	if (queue.length === 0) {
		queue = buildPaintJobs(node)
		paintLoop()
	}
}

export function paintLoop() {
	let job: PaintJob | undefined | null = null
	while (queue.length > 0) {
		job = queue.shift()
		if (job) {
			job.doPainting()
		}
	}
}
