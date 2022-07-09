import {
    mkRect,
    mkSize,
    Node,
    Size,
    Rect,
    rectContains,
    mkPoint
} from "../models"
import type { AttributeCollection } from "../models"
import { PKEvent } from "../models"
import { flattenChildren } from "./flattenChildren"
import { havePropsChanged } from "./havePropsChanged"
import { minifyNode } from "./minifyNode"
import { paint } from "../paint"
import { getSharedSupervisor } from "./Supervisor"

type ChildrenDiff = {
    children: Node[]
    removed: Node[]
}

export class StateManager {
    public AUTO_LOOP = true

    private paintCount = 0

    public size: Size = mkSize(10, 10)

    private _nodeFrame: Rect = mkRect(0, 0, 10, 10)

    public _root: Node | null = null

    private _node: Node | null = null

    public currentRoot: Node | null = null

    public unitsOfWork: Node[] = []

    public isRunning = false

    public hasUpdateBeenRequested = false

    public stepCallbackId: number | null = null

    // for hooks
    public hookIndex: number = 0

    public get root(): Node | null {
        return this._root
    }

    public get node(): Node | null {
        return this._node
    }

    public set node(val: Node | null) {
        this._node = val
    }

    public setRoot(fn: any) {
        this._root = {
            name: "root",
            type: fn,
            props: {},
            children: [],
            alternate: null,
            hooks: [],
            needsDraw: false,
            cache: null,
            frame: mkRect(0, 0, this.size.width, this.size.height)
        }
        this.unitsOfWork.push(this._root)
    }

    constructor() {
        this.step = this.step.bind(this)
        if (this.AUTO_LOOP === false) {
            const onKeyUp = (e: KeyboardEvent) => {
                if (e.key === " ") {
                    this.requestRootUpdate()
                    let deadline = performance.now() + 16
                    this.step({
                        timeRemaining: () => deadline - performance.now(),
                        didTimeout: false
                    })
                }
            }
            document.addEventListener("keyup", onKeyUp)
        }
    }

    public start() {
        if (!this.isRunning) {
            if (window.requestIdleCallback != null) {
                this.stepCallbackId = requestIdleCallback(this.step)
            } else {
                setTimeout(() => {
                    this.step({
                        timeRemaining: () => {
                            return 16
                        },
                        didTimeout: false
                    })
                }, 10)
            }
            this.isRunning = true
        }
    }

    public stop() {
        this.isRunning = false
        if (this.stepCallbackId) {
            cancelIdleCallback(this.stepCallbackId)
            this.stepCallbackId = null
        }
    }

    public step(deadline: IdleDeadline) {
        //let start = performance.now()

        // timer based hooks
        if (this.currentRoot) {
            this.workTimerHooks(this.currentRoot)
        }

        if (this.unitsOfWork.length === 0 && this.hasUpdateBeenRequested) {
            this.startRootUpdate()
        }

        while (this.unitsOfWork.length > 0 && deadline.timeRemaining() > 2) {
            this.performNextUnitOfWork()
        }

        if (this.unitsOfWork.length === 0 && this._root != null) {
            this.resolveIntrinsicFrames(this._root, null)
            this.resolveCalculatedFrames(this._root, null)
            this.workLayoutHooks(this._root)
            this.commitRoot()
        }

        if (this.unitsOfWork.length === 0 && this._root === null) {
            if (this.currentRoot) {
                this.workEffectHooks(this.currentRoot)
            }
        }

        if (this.stepCallbackId) {
            cancelIdleCallback(this.stepCallbackId)
            this.stepCallbackId = null
        }
        if ((this.isRunning && this.AUTO_LOOP) || this.unitsOfWork.length > 0) {
            if (window.requestIdleCallback != null) {
                this.stepCallbackId = requestIdleCallback(this.step)
            } else {
                setTimeout(() => {
                    this.step({
                        timeRemaining: () => {
                            return 16
                        },
                        didTimeout: false
                    })
                }, 10)
            }
        }

        //let diff = performance.now() - start
    }

    public performNextUnitOfWork() {
        let n = this.unitsOfWork.shift()
        if (n) {
            this._node = n
        } else {
            this._node = null
        }
        if (this._node) {
            this.workEffectHooks(this._node, false)
            let next: Node[] = this.updateNode(this._node)
            for (let nn of next) {
                this.unitsOfWork.push(nn)
            }
        }
    }

    public commitRoot() {
        this.currentRoot = this._root
        this._root = null
        // TODO: hooks
        // TODO: deletions
        if (this.currentRoot) {
            this.propigateNeedsDraw(this.currentRoot)
            this.paintCount++
            console.log("StateManager.commitRoot")
            //console.log(this.currentRoot)
            this.debugFrames(this.currentRoot)
            paint(this.currentRoot)
        }
    }

    public resolveCalculatedFrames(node: Node, parent: Node | null): void {
        if (parent && parent.frame && node.props && node.frame) {
            if (node.name === "fragment") {
                // create frames for fragments
                node.frame = { ...parent.frame, x: 0, y: 0 }
            }
            // handle percentage based frames
            let w = node.props.width
            let r = node.props.radius
            if (w && typeof w === "string" && node.props.width.includes("%")) {
                let wp = parseFloat(node.props.width) / 100
                node.frame.width = parent.frame.width * wp
            }
            // handle radius property
            if (!w && r) {
                if (r && typeof r === "string" && r.includes("%")) {
                    let rp = parseFloat(r) / 100
                    node.frame.width = parent.frame.width * rp * 2
                } else {
                    node.frame.width = parseFloat(r) * 2
                }
            }
            let h = node.props.height
            if (h && typeof h === "string" && node.props.height.includes("%")) {
                let hp = parseFloat(node.props.height) / 100
                node.frame.height = parent.frame.height * hp
            }
            let x = node.props.x
            if (x && typeof x === "string" && x.includes("%")) {
                let xp = parseFloat(node.props.x) / 100
                let xPos = parent.frame.width * xp
                node.frame.x = xPos
            }
            let y = node.props.y
            if (y && typeof y === "string" && y.includes("%")) {
                let yp = parseFloat(node.props.y) / 100
                let yPos = parent.frame.height * yp
                node.frame.y = yPos
            }

            // translate x and y with parent values
            node.frame.x = node.frame.x + parent.frame.x
            node.frame.y = node.frame.y + parent.frame.y
        }

        for (let child of node.children) {
            this.resolveCalculatedFrames(child, node)
        }
    }

    public resolveIntrinsicFrames(node: Node, parent: Node | null): void {
        for (let child of node.children) {
            this.resolveIntrinsicFrames(child, node)
        }

        let frame = mkRect(0, 0, 0, 0)

        if (node.props.x) {
            frame.x = parseFloat(node.props.x)
        }

        if (node.props.y) {
            frame.y = parseFloat(node.props.y)
        }

        frame.width = this.resolveWidth(node)
        frame.height = this.resolveHeight(node)

        node.frame = frame
    }

    public resolveWidth(node: Node): number {
        let w = 0
        if (node.frame && node.frame.width) {
            w = node.frame.width
        } else if (node.props.width) {
            w = parseFloat(node.props.width)
        } else if (node.props._intrinsicWidth) {
            w = parseFloat(node.props._intrinsicWidth)
        } else {
            for (let child of node.children) {
                w = Math.max(w, this.resolveWidth(child))
            }
        }
        return w
    }

    public resolveHeight(node: Node): number {
        let h = 0
        if (node.frame && node.frame.height) {
            h = node.frame.height
        } else if (node.props.height) {
            h = parseFloat(node.props.height)
        } else if (node.props._intrinsicHeight) {
            h = parseFloat(node.props._intrinsicHeight)
        } else {
            for (let child of node.children) {
                h = Math.max(h, this.resolveHeight(child))
            }
        }
        return h
    }

    public debugFrames(node: Node, depth: number = 0) {
        let indent = "".padEnd(depth * 4, " ")
        if (node.frame) {
            console.log(
                indent,
                node.name,
                "x:",
                node.frame.x,
                ", y:",
                node.frame.y,
                "- w:",
                node.frame.width,
                ", h:",
                node.frame.height
            )
        } else {
            console.log(indent, node.name, "no-frame", node)
        }

        for (let child of node.children) {
            this.debugFrames(child, depth + 1)
        }
    }

    public requestRootUpdate(): void {
        this.hasUpdateBeenRequested = true
    }

    public startRootUpdate() {
        this.hasUpdateBeenRequested = false
        if (this.currentRoot) {
            this._nodeFrame = mkRect(0, 0, this.size.width, this.size.height)
            this._root = {
                name: "root",
                type: this.currentRoot.type,
                props: {
                    ...this.currentRoot.props,
                    width: this.size.width,
                    height: this.size.height
                },
                children: this.currentRoot.children,
                alternate: minifyNode(this.currentRoot),
                hooks: this.currentRoot.hooks,
                needsDraw: false,
                cache: null,
                frame: null
            }
        }
        if (this._root) {
            this.unitsOfWork = [this._root]
        }
    }

    workTimerHooks(node: Node) {
        // children
        for (let child of node.children) {
            this.workTimerHooks(child)
        }

        for (let hook of node.hooks) {
            for (let action of hook.pendingTicks) {
                action()
            }
            hook.pendingTicks = []
        }
    }

    workEffectHooks(node: Node, includeChildren: boolean = true) {
        // children
        if (includeChildren) {
            for (let child of node.children) {
                this.workEffectHooks(child)
            }
        }

        for (let hook of node.hooks) {
            for (let action of hook.pendingEffects) {
                let unmount = hook.queue.pop()
                if (unmount) {
                    unmount()
                }
                let cb = action()
                if (cb) {
                    hook.queue.push(cb)
                }
            }
            hook.pendingEffects = []
        }
    }

    workLayoutHooks(node: Node) {
        // children
        for (let child of node.children) {
            this.workLayoutHooks(child)
        }

        this._node = node
        for (let hook of node.hooks) {
            for (let action of hook.pendingLayout) {
                action()
            }
            hook.pendingLayout = []
        }
        this._node = null
    }

    public updateNode(node: Node): Node[] {
        if (!node.alternate) {
            // new nodes need to be drawn
            node.needsDraw = true
        }

        let prevChildren: Node[] = []
        if (node.type instanceof Function) {
            // reset hooks, they will be re-added by running the render function
            this.hookIndex = 0
            node.hooks = []

            // get the previous children
            if (node.alternate) {
                prevChildren = node.alternate.children
            } else if (node.children) {
                prevChildren = node.children
            }

            // get the render function
            let f = node.type as (
                props: AttributeCollection,
                children: any
            ) => Node

            // execute the render function, and get new children
            node.children = [f(node.props, node.children)]
        } else {
            // for non-function nodes, just use the children
            prevChildren = node.alternate ? node.alternate.children : []
        }

        // flatten the children
        let nextChildren: Node[] = flattenChildren(node.children)

        // diff the children
        let childDiff = this.diffChildren(nextChildren, prevChildren)

        // handle diffed children
        node.children = childDiff.children

        // TODO: handle removed children

        // return the next children, for next units of work
        return node.children
    }

    public propigateNeedsDraw(
        parent: Node,
        inherited: boolean = false
    ): boolean {
        let needsDraw =
            parent.needsDraw ||
            (inherited &&
                !["pklayer", "layer", "group", "pkgroup"].includes(parent.name))
        // propigate up
        for (let child of parent.children) {
            needsDraw = needsDraw || this.propigateNeedsDraw(child, needsDraw)
        }
        // propigate down to all children
        if (needsDraw) {
            for (let child of parent.children) {
                this.propigateNeedsDraw(child, true)
            }
        }
        parent.needsDraw = needsDraw
        return needsDraw
    }

    public diffChildren(
        nextChildren: Node[],
        prevChildren: Node[]
    ): ChildrenDiff {
        let children: Node[] = []
        let removed: Node[] = []
        let length = Math.max(nextChildren.length, prevChildren.length)

        for (let i = 0; i < length; i++) {
            let next = nextChildren[i]
            let prev = prevChildren[i]
            let nextNode = this.diffNode(next, prev)
            if (nextNode) {
                children.push(nextNode)
            }
            if (prev) {
                if (!nextNode) {
                    removed.push(prev)
                }
            }
        }

        return { children, removed }
    }

    public diffNode(a: Node | null, b: Node | null): Node | null {
        let next: Node | null = null
        let sameType = false
        if (!!a && !!b) {
            sameType = a.type == b.type
        }

        if (a && b && sameType) {
            let needsDraw = false
            if (havePropsChanged(a.props, b.props)) {
                needsDraw = true
            }
            next = {
                name: a.name,
                type: a.type,
                props: a.props,
                children: a.children,
                needsDraw: needsDraw,
                hooks: b.hooks,
                cache: b.cache,
                alternate: minifyNode(b),
                frame: b.frame
            }
        } else if (a && !sameType) {
            next = {
                name: a.name,
                type: a.type,
                props: a.props,
                children: a.children,
                alternate: null,
                needsDraw: true,
                hooks: [],
                cache: null,
                frame: a.frame
            }
        } else {
            console.error("diffNode", a, b, sameType)
        }

        return next
    }

    public handleEvent(event: Event) {
        let x = 0
        let y = 0
        if (event.type == "click") {
            let mouseEvent = event as MouseEvent
            x = mouseEvent.offsetX
            y = mouseEvent.offsetY
        }
        let pkEvent = new PKEvent(event, { x, y })

        if (this.currentRoot) {
            this.bubbleEvent(this.currentRoot, pkEvent)
        }
    }

    public bubbleEvent(node: Node, event: PKEvent) {
        for (let child of node.children) {
            this.bubbleEvent(child, event)
        }

        if (node.frame && rectContains(node.frame, mkPoint(event.x, event.y))) {
            if (typeof node.props[event.type] == "function") {
                let handler = node.props[event.type] as (event: PKEvent) => void
                handler(event)
            }
        }
    }
}
