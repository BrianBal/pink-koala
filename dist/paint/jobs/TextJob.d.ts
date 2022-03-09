import { PaintJob } from "./PaintJob";
import { Node } from "../../models";
export declare class TextJob extends PaintJob {
    constructor(node: Node);
    paint(): void;
}
