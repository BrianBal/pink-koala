import React, { useRef, useEffect } from "react"
import type { Size, AttributeCollection } from "./models/"
import { getSharedSupervisor } from "./render"
import "./PinkKoala.css"

export type PinkKoalaProps = {
    drawing: any
    drawingProps: AttributeCollection | null
    layers: string[]
    size: Size
}

export const PinkKoala = (props: PinkKoalaProps) => {
    let containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (containerRef.current) {
            const canvasNodes = containerRef.current.querySelectorAll("canvas")
            let canvases = Array.from(canvasNodes).map((node) => {
                return node as HTMLCanvasElement
            })

            let sup = getSharedSupervisor()
            sup.addLayer({
                child: props.drawing,
                canvases: canvases
            })
            sup.stateManager.size = props.size
            sup.start()
        }
    }, [props.drawing, containerRef, props.size])

    const handleEvent = (event: Event) => {
        let sup = getSharedSupervisor()
        sup.stateManager.handleEvent(event)
    }

    useEffect(() => {
        containerRef.current!.addEventListener("click", handleEvent)
        containerRef.current!.addEventListener("dblclick", handleEvent)
        containerRef.current!.addEventListener("mouseup", handleEvent)
        containerRef.current!.addEventListener("mousedown", handleEvent)
        containerRef.current!.addEventListener("mousemove", handleEvent)

        containerRef.current!.addEventListener("touchstart", handleEvent)
        containerRef.current!.addEventListener("touchend", handleEvent)
        containerRef.current!.addEventListener("touchmove", handleEvent)
        containerRef.current!.addEventListener("touchcancel", handleEvent)
        return () => {
            containerRef.current!.removeEventListener("click", handleEvent)
            containerRef.current!.removeEventListener("dblclick", handleEvent)
            containerRef.current!.removeEventListener("mouseup", handleEvent)
            containerRef.current!.removeEventListener("mousedown", handleEvent)
            containerRef.current!.removeEventListener("mousemove", handleEvent)

            containerRef.current!.removeEventListener("touchstart", handleEvent)
            containerRef.current!.removeEventListener("touchend", handleEvent)
            containerRef.current!.removeEventListener("touchmove", handleEvent)
            containerRef.current!.removeEventListener(
                "touchcancel",
                handleEvent
            )
        }
    }, [])

    return (
        <div ref={containerRef} className="PinkKoala">
            {props.layers.map((layer) => (
                <canvas
                    key={layer}
                    id={layer}
                    width={props.size.width}
                    height={props.size.height}
                />
            ))}
        </div>
    )
}
