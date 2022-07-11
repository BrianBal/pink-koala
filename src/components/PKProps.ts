import { PKEvent } from "../models"

export type PKProps = {
    id?: string
    x?: number | string
    y?: number | string
    width?: number | string
    height?: number | string
    fill?: string
    stroke?: string
    strokeWidth?: number
    flex?: number | string
    onClick?: (event: PKEvent) => void
    onDoubleClick?: (event: PKEvent) => void
    onMouseDown?: (event: PKEvent) => void
    onMouseUp?: (event: PKEvent) => void
    onMouseMove?: (event: PKEvent) => void
}
