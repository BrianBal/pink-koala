import { StateManager } from "./StateManager"

export type Layer = {
    child: any
    canvases: any[]
}

export class Supervisor {
    public stateManager: StateManager

    public canvases: HTMLCanvasElement[] = []

    constructor() {
        this.stateManager = new StateManager()
    }

    addLayer(layer: Layer) {
        this.stateManager.setRoot(layer.child)
        this.canvases = layer.canvases
    }

    public get currentContext(): StateManager | null {
        return this.stateManager
    }

    public get activeLayer(): StateManager | null {
        return this.stateManager
    }

    public start(): void {
        this.activeLayer?.start()
    }

    public stop(): void {}
}

let sharedSupervisor: Supervisor = new Supervisor()
export function getSharedSupervisor(): Supervisor {
    return sharedSupervisor
}
