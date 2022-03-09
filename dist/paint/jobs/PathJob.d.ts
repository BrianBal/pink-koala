import { PaintJob } from "./PaintJob";
import { Node } from "../../models";
export declare class PathJob extends PaintJob {
    constructor(node: Node);
    paint(): void;
}
