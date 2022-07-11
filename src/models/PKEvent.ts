type PKEventOptions = {
    x: number | null | undefined
    y: number | null | undefined
}

export class PKEvent {
    private _x: number = 0

    public get x(): number {
        return this._x
    }

    private _y: number = 0

    public get y(): number {
        return this._y
    }

    public get type(): string {
        let eventType = ""
        switch (this.nativeEvent.type) {
            case "click":
                eventType = "onClick"
                break
            case "dblclick":
                eventType = "onDoubleClick"
                break
            case "mousedown":
                eventType = "onMouseDown"
                break
            case "mouseup":
                eventType = "onMouseUp"
                break
            case "mousemove":
                eventType = "onMouseMove"
                break
            case "touchstart":
                eventType = "onTouchStart"
                break
            case "touchend":
                eventType = "onTouchEnd"
                break
            case "touchmove":
                eventType = "onTouchMove"
                break
            case "touchcancel":
                eventType = "onTouchCancel"
                break
            default:
                eventType = "onUnkownEvent"
        }
        return eventType
    }

    private _defaultPrevented: boolean = false

    private _propigationStopped: boolean = false

    private _immediatePropagationStopped: boolean = false

    private _nativeEvent: Event

    public get nativeEvent(): Event {
        return this._nativeEvent
    }

    public constructor(nativeEvent: Event, options: PKEventOptions | null) {
        if (options && options.x) {
            this._x = options.x
        }
        if (options && options.y) {
            this._y = options.y
        }
        this._nativeEvent = nativeEvent
    }

    public preventDefault() {
        this._defaultPrevented = true
    }

    public stopImmediatePropagation() {
        this._immediatePropagationStopped = true
        this._propigationStopped = true
    }

    public stopPropagation() {
        this._propigationStopped = true
    }
}
