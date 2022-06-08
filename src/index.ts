export { PinkKoala } from "./PinkKoala"
export type {
    AttributeCollection,
    Size,
    Points,
    EffectHookCallback,
    TickHookCallback,
    Rect
} from "./models"

export {
    Layer,
    Rectangle,
    Text,
    Row,
    Column,
    Circle,
    Polygon,
    Path,
    Group
} from "./components"

export {
    createElement,
    Fragment,
    getSharedSupervisor,
    Supervisor
} from "./render"

export {
    haveArgsChanged,
    invokeOrReturn,
    useEffect,
    useLayoutEffect,
    useEventListener,
    useReducer,
    useState,
    useTicker
} from "./hooks"

export {
    mkPoint,
    pointLerp,
    mkSize,
    mkRect,
    rectLeft,
    rectRight,
    rectTop,
    rectBottom,
    rectContains,
    rectIntersects,
    rectCenter
} from "./models"
export type { Point } from "./models"

import type { AttributeCollection } from "./models/"

declare global {
    namespace JSX {
        interface IntrinsicElements {
            [name: string]: any
            pkrect: any
        }
        interface IntrinsicAttributes {
            [name: string]: any
        }
    }
}
