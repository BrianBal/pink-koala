import { PaintJob } from "./PaintJob";
import { Node } from "../../models";
export declare class LayerJob extends PaintJob {
    constructor(node: Node);
    paint(): void;
}
