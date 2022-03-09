import { PaintJob } from "./PaintJob";
import { Node } from "../../models";
export declare class PolygonJob extends PaintJob {
    constructor(node: Node);
    paint(): void;
}
