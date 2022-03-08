import { Node } from "../models"
import type { AttributeCollection } from "../models"
import { flattenChildren } from "./flattenChildren"
import { havePropsChanged } from "./havePropsChanged"
import { minifyNode } from "./minifyNode"
import { paint } from "../paint"

type ChildrenDiff = {
    children: Node[]
    removed: Node[]
}

export class StateManager {
    public AUTO_LOOP = true

    private paintCount = 0

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
            cache: null
        }
        this.unitsOfWork.push(this._root)
    }

    constructor() {
        this.step = this.step.bind(this)
        if (this.AUTO_LOOP === false) {
            const onKeyUp = (e: KeyboardEvent) => {
                if (e.key === " ") {
                    //console.log("requestRootUpdate")
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
            this.stepCallbackId = requestIdleCallback(this.step)
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
        let start = performance.now()

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

        if (this.unitsOfWork.length === 0) {
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
            this.stepCallbackId = requestIdleCallback(this.step)
        }

        let diff = performance.now() - start
    }

    public performNextUnitOfWork() {
        let n = this.unitsOfWork.shift()
        if (n) {
            this._node = n
        } else {
            this._node = null
        }
        if (this._node) {
            let next: Node[] = this.updateNode(this._node)
            for (let n of next) {
                this.unitsOfWork.push(n)
            }
        }
    }

    public commitRoot() {
        this.currentRoot = this._root
        this._root = null
        //console.log("commitRoot", this.currentRoot)
        // TODO: hooks
        // TODO: deletions
        // TODO: paint
        if (this.currentRoot) {
            this.propigateNeedsDraw(this.currentRoot)
            this.paintCount++
            paint(this.currentRoot)
        }
    }

    public requestRootUpdate() {
        //console.log("requestRootUpdate")
        this.hasUpdateBeenRequested = true
    }

    public startRootUpdate() {
        this.hasUpdateBeenRequested = false
        //console.log("startRootUpdate")
        if (this.currentRoot) {
            this._root = {
                name: "root",
                type: this.currentRoot.type,
                props: this.currentRoot.props,
                children: this.currentRoot.children,
                alternate: minifyNode(this.currentRoot),
                hooks: this.currentRoot.hooks,
                needsDraw: false,
                cache: null
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

    workEffectHooks(node: Node) {
        // children
        for (let child of node.children) {
            this.workEffectHooks(child)
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

    workUmountHooks(node: Node) {
        // children
        for (let child of node.children) {
            this.workEffectHooks(child)
        }

        for (let hook of node.hooks) {
            for (let action of hook.pendingUnmount) {
                action()
            }
            hook.pendingUnmount = []
        }
    }

    public updateNode(node: Node): Node[] {
        if (!node.alternate) {
            node.needsDraw = true
        }
        let prevChildren: Node[] = []
        if (node.type instanceof Function) {
            this.hookIndex = 0
            node.hooks = []
            prevChildren = node.children
            let f = node.type as (props: AttributeCollection) => Node

            node.children = [f(node.props)]
        } else {
            prevChildren = node.alternate ? node.alternate.children : []
        }

        //// Optimization for groups
        // if (node.name === "group") {
        // 	let nextChildren: Node[] = flattenChildren(node.children)
        // 	if (node.needsDraw === true) {
        // 		let childDiff = this.diffChildren(nextChildren, prevChildren)
        // 		node.children = childDiff.children
        // 	} else {
        // 		node.children = nextChildren.map(c => {
        // 			c.needsDraw = false
        // 			return c
        // 		})
        // 	}
        // } else {
        // 	let nextChildren: Node[] = flattenChildren(node.children)
        // 	let childDiff = this.diffChildren(nextChildren, prevChildren)
        // 	node.children = childDiff.children
        // }
        let nextChildren: Node[] = flattenChildren(node.children)
        let childDiff = this.diffChildren(nextChildren, prevChildren)
        node.children = childDiff.children

        // TODO: handle removed children

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
        if (a && b) {
            sameType = a.type === b.type
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
                alternate: minifyNode(b)
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
                cache: null
            }
        } else {
            //console.error("diffNode", a, b, sameType)
        }

        return next
    }
}
