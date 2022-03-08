import { useEffect } from "./useEffect"

export function useEventListener(event: string, handler: any, args: any[]) {
	useEffect(() => {
		document.addEventListener(event, handler)
		return () => {
			document.removeEventListener(event, handler)
		}
	}, [...args, event, handler])
}
