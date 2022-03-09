import { PaintJob } from "./PaintJob";
import { Node } from "../../models";
export declare class FrameEndJob extends PaintJob {
    constructor(node: Node);
    paint(): void;
}
