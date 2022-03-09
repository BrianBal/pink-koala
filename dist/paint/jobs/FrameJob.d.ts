import { PaintJob } from "./PaintJob";
import { Node } from "../../models";
export declare class FrameJob extends PaintJob {
    constructor(node: Node);
    paint(): void;
}
