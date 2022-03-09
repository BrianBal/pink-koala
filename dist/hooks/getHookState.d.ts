import type { Hook } from "../models";
import { StateManager } from "../render/StateManager";
declare type HookState = {
    context: StateManager | null;
    prevHook: Hook | null;
};
export declare function getHookState(): HookState;
export {};
