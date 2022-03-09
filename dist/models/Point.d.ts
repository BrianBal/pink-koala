export declare type Point = {
    x: number;
    y: number;
};
export declare function mkPoint(x: number, y: number): Point;
export declare function pointLerp(a: Point, b: Point, t: number): Point;
export declare function pointAt(p: Point, angle: number, distance: number): Point;
