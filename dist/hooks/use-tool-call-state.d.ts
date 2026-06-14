import type { StringKeyof } from '../lib/core/common/ds/types/filter';
export declare function useToolCallState<T extends object>({ chatId, toolCallId, initialState, }: {
    chatId: string;
    toolCallId: string;
    initialState: T;
}): {
    state: T | undefined;
    updatedAt: string | undefined;
    setState: (key: StringKeyof<T>, value: T[StringKeyof<T>]) => Promise<void>;
    loaded: boolean;
    startLoadingState: () => Promise<void>;
};
//# sourceMappingURL=use-tool-call-state.d.ts.map