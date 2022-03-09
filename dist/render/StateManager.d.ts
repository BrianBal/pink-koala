/// <reference types="requestidlecallback" />
import { Node } from "../models";
declare type ChildrenDiff = {
    children: Node[];
    removed: Node[];
};
export declare class StateManager {
    AUTO_LOOP: boolean;
    private paintCount;
    _root: Node | null;
    private _node;
    currentRoot: Node | null;
    unitsOfWork: Node[];
    isRunning: boolean;
    hasUpdateBeenRequested: boolean;
    stepCallbackId: number | null;
    hookIndex: number;
    get root(): Node | null;
    get node(): Node | null;
    set node(val: Node | null);
    setRoot(fn: any): void;
    constructor();
    start(): void;
    stop(): void;
    step(deadline: IdleDeadline): void;
    performNextUnitOfWork(): void;
    commitRoot(): void;
    requestRootUpdate(): void;
    startRootUpdate(): void;
    workTimerHooks(node: Node): void;
    workEffectHooks(node: Node): void;
    workUmountHooks(node: Node): void;
    updateNode(node: Node): Node[];
    propigateNeedsDraw(parent: Node, inherited?: boolean): boolean;
    diffChildren(nextChildren: Node[], prevChildren: Node[]): ChildrenDiff;
    diffNode(a: Node | null, b: Node | null): Node | null;
}
export {};
