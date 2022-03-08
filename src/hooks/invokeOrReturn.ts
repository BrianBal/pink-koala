export function invokeOrReturn(arg: any, f: any): any {
	return typeof f == "function" ? f(arg) : f
}
