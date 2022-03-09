import { PaintJob } from "./PaintJob";
import { Node } from "../../models";
export declare class GroupJob extends PaintJob {
    constructor(node: Node);
    paint(): void;
}
