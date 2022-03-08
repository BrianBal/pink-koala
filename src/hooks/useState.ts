import { useReducer } from "./useReducer"
import { createHook } from "../models"
import { getHookState } from "./getHookState"
import { invokeOrReturn } from "./invokeOrReturn"

export function useState(initialState: any): any[] {
	return useReducer(invokeOrReturn, initialState)
}
