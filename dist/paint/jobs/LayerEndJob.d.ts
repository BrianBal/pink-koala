import { PaintJob } from "./PaintJob";
import { Node } from "../../models";
export declare class LayerEndJob extends PaintJob {
    constructor(node: Node);
    paint(): void;
}
