import { AttributeCollection } from "../models";
import type { Node } from "../models";
export declare var Fragment: string;
export declare function createNode(type: string | Function, props: AttributeCollection, children: Node[], needsDraw?: boolean): Node;
export declare function createElement(type: string | Function, props: AttributeCollection, ...children: Node[]): Node;
