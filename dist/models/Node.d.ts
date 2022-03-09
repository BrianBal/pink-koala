import { AttributeCollection } from "./index";
import type { Hook } from "./Hook";
export declare type Node = {
    name: string;
    type: string | Function;
    props: AttributeCollection;
    children: Node[];
    alternate: Node | null;
    hooks: Hook[];
    needsDraw: boolean;
    cache: any | null;
};
