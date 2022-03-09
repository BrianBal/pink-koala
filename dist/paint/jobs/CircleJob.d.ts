import { PaintJob } from "./PaintJob";
import { Node } from "../../models";
export declare class CircleJob extends PaintJob {
    constructor(node: Node);
    paint(): void;
}
