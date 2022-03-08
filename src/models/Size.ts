export type Size = {
	width: number
	height: number
}

export const mkSize = (width: number, height: number): Size => ({
	width,
	height,
})
