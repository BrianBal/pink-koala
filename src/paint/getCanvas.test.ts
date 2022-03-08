import { getCanvas } from "./getCanvas"
import { getSharedSupervisor, Supervisor } from "../render/Supervisor"
jest.mock("../render/Supervisor")

const mockedGetSharedSupervisor =
    getSharedSupervisor as unknown as jest.Mock<Supervisor>

describe("getCanvas", () => {
    it("should find canvas with id", () => {
        let canvas = document.createElement("canvas")
        canvas.height = 100
        canvas.width = 200
        canvas.id = "c1"

        let sup = new Supervisor()
        sup.canvases = [canvas]
        mockedGetSharedSupervisor.mockReturnValue(sup)

        let foundCanvas = getCanvas("c1")
        expect(foundCanvas).toBe(canvas)
    })
    it("should return undefined if canvas is not found", () => {
        let canvas = document.createElement("canvas")
        canvas.height = 100
        canvas.width = 200
        canvas.id = "c1"

        let sup = new Supervisor()
        sup.canvases = [canvas]
        mockedGetSharedSupervisor.mockReturnValue(sup)

        let foundCanvas = getCanvas("c1123")
        expect(foundCanvas).toBe(undefined)
    })
})
