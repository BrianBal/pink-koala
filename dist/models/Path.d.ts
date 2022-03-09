import type { Point } from "./Point";
import type { Rect } from "./Rect";
export declare type Path = Point[];
export declare function pathCenter(path: Path): Point;
export declare function pathBounds(path: Path): Rect;
