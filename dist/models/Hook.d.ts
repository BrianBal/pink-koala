export declare type EffectHookCallback = () => EffectHookCallback | null | void;
export declare type TickHookCallback = (now: number, delta: number) => void;
export declare type Hook = {
    state: any;
    queue: any[];
    pendingEffects: EffectHookCallback[];
    pendingTicks: EffectHookCallback[];
    pendingUnmount: EffectHookCallback[];
};
export declare function createHook(): Hook;
