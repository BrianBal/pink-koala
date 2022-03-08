import { createNode } from "./"
import { StateManager } from "./StateManager"
jest.mock("../paint")

describe("StateManager.commitRoot", () => {
    it("should update currentRoot", () => {
        let a = createNode(
            () => {
                return createNode("A", {}, [])
            },
            {},
            []
        )
        let sm = new StateManager()
        sm.setRoot(a)
        let wipRoot = sm.root
        expect(sm.currentRoot).toBeNull()
        sm.commitRoot()
        expect(sm.currentRoot).toBe(wipRoot)
        expect(sm.root).toBeNull()
    })
    it("should call propigateNeeds draw", () => {
        let a = createNode(
            () => {
                return createNode("A", {}, [])
            },
            {},
            []
        )
        let sm = new StateManager()
        sm.setRoot(a)
        sm.propigateNeedsDraw = jest.fn()
        sm.commitRoot()

        expect(sm.propigateNeedsDraw).toHaveBeenCalledWith(sm.currentRoot)
    })
})
