import { PaintJob } from "./PaintJob";
import { Node } from "../../models";
export declare class GroupEndJob extends PaintJob {
    constructor(node: Node);
    paint(): void;
}
