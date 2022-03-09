export { PinkKoala } from "./PinkKoala";
export type { AttributeCollection, Size, Path, EffectHookCallback, TickHookCallback, Rect } from "./models";
export { createElement, Fragment, getSharedSupervisor, Supervisor } from "./render";
export { haveArgsChanged, invokeOrReturn, useEffect, useEventListener, useReducer, useState, useTicker } from "./hooks";
export { mkPoint, pointLerp, mkSize, mkRect, rectLeft, rectRight, rectTop, rectBottom, rectContains, rectIntersects, rectCenter } from "./models";
export type { Point } from "./models";
declare global {
    namespace JSX {
        interface IntrinsicElements {
            [name: string]: any;
        }
        interface IntrinsicAttributes {
            [name: string]: any;
        }
    }
}
