import React, { useRef, useEffect } from "react"
import type { Size, AttributeCollection } from "./models/"
import { getSharedSupervisor } from "./render"

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

            getSharedSupervisor().addLayer({
                child: props.drawing,
                canvases: canvases
            })
            getSharedSupervisor().start()
        }
    }, [props.drawing, containerRef])

    return (
        <div ref={containerRef} className="Drawing">
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
