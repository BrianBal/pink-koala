import type { AttributeCollection } from "../models"

export function havePropsChanged(
	a: AttributeCollection,
	b: AttributeCollection
) {
	const ignoreKeys = ["__source", "__self"]
	if (a === null || b === null) {
		return true
	}
	for (let key in a) {
		if (ignoreKeys.indexOf(key) === -1) {
			if (Array.isArray(a[key])) {
				if (a[key].length !== b[key].length) {
					return true
				}
				for (let i = 0; i < a[key].length; i++) {
					if (havePropsChanged(a[key][i], b[key][i])) {
						return true
					}
				}
			} else if (typeof a[key] === "object") {
				if (havePropsChanged(a[key], b[key])) {
					return true
				}
			} else if (a[key] !== b[key]) {
				return true
			}
		}
	}

	return false
}
