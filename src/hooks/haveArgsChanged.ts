export function haveArgsChanged(a: any[], b: any[]) {
	if (!a && !b) {
		return false
	}
	if ((!a && b) || (!b && a)) {
		//console.log("args changed nulls", a, b)
		return true
	}
	if (a.length !== b.length) {
		//console.log("args changed length", a, b)
		return true
	}
	for (let i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) {
			//console.log("args changed value", a, b)
			return true
		}
	}
	//console.log("args not chagned", a, b)
	return false
}
