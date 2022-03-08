import { getSharedSupervisor } from "../render/Supervisor"

export function getCanvas(id: string): HTMLCanvasElement | undefined {
    let sup = getSharedSupervisor()
    const canvases = sup.canvases
    const canvas = canvases.find((c) => c.id === id)
    return canvas
}
