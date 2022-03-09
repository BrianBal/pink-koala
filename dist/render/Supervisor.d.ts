import { StateManager } from "./StateManager";
export declare type Layer = {
    child: any;
    canvases: any[];
};
export declare class Supervisor {
    stateManager: StateManager;
    canvases: HTMLCanvasElement[];
    constructor();
    addLayer(layer: Layer): void;
    get currentContext(): StateManager | null;
    get activeLayer(): StateManager | null;
    start(): void;
    stop(): void;
}
export declare function getSharedSupervisor(): Supervisor;
