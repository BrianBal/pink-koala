import type { Point } from "./Point";
export declare type Rect = {
    x: number;
    y: number;
    width: number;
    height: number;
};
export declare function mkRect(x: number, y: number, width: number, height: number): Rect;
export declare function rectLeft(rect: Rect): number;
export declare function rectRight(rect: Rect): number;
export declare function rectTop(rect: Rect): number;
export declare function rectBottom(rect: Rect): number;
export declare function rectCenter(rect: Rect): Point;
export declare function rectContains(rect: Rect, point: Point): boolean;
export declare function rectIntersects(a: Rect, b: Rect): boolean;
