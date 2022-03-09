import { PaintJob } from "./PaintJob";
import { Node } from "../../models";
export declare class RectangleJob extends PaintJob {
    constructor(node: Node);
    paint(): void;
}
