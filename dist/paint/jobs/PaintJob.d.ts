import { Node } from "../../models";
import type { AttributeCollection } from "../../models/AttributeCollection";
declare type PaintContext = {
    canvas: HTMLCanvasElement | null;
    canvasStack: HTMLCanvasElement[];
};
export declare class PaintJob {
    node: Node;
    name: string;
    constructor(node: Node);
    doPainting(): void;
    paint(): void;
    get canvas(): HTMLCanvasElement | null;
    set canvas(val: HTMLCanvasElement | null);
    get paintingContext(): PaintContext;
    pushCanvas(canvas: HTMLCanvasElement): void;
    popCanvas(): HTMLCanvasElement | null;
    updateRenderingContextFromProps(ctx: any, props: AttributeCollection): PaintJobRenderingContextUpdate;
}
export interface PaintJobRenderingContextUpdate {
    hasChanged: boolean;
    shouldFill: boolean;
    shouldStroke: boolean;
}
export {};
