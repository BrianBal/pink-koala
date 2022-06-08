import type { Points } from "./Points"
import { pathCenter, pathBounds } from "./Points"
import { mkPoint } from "./Point"
import { mkRect } from "./Rect"

describe("Path", () => {
    it("should get length", () => {
        const path: Points = [mkPoint(1, 2), mkPoint(3, 4)]
        expect(path.length).toBe(2)
    })

    it("should get center", () => {
        const path = [mkPoint(1, 2), mkPoint(3, 4)]
        expect(pathCenter(path)).toEqual(mkPoint(2, 3))
    })

    it("should get bounds", () => {
        const path = [mkPoint(1, 2), mkPoint(3, 4)]
        expect(pathBounds(path)).toEqual(mkRect(1, 2, 2, 2))
    })
})
