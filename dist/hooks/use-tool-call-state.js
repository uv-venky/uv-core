'use client';
import { useMutation } from '../lib/core/client/useQuery';
import { useCallback, useState } from 'react';
export function useToolCallState({ chatId, toolCallId, initialState, }) {
    const [state, setState] = useState(initialState);
    const [updatedAt, setUpdatedAt] = useState();
    const [loaded, setLoaded] = useState(false);
    const getToolCallStateMutation = useMutation('getToolCallState');
    const setToolCallStateMutation = useMutation('setToolCallState');
    const fetchToolCallState = useCallback(async () => {
        try {
            setLoaded(false);
            const response = await getToolCallStateMutation(chatId, toolCallId);
            setState(response?.state);
            setUpdatedAt(response?.updatedAt);
        }
        finally {
            setLoaded(true);
        }
    }, [chatId, toolCallId, getToolCallStateMutation]);
    const setToolCallState = useCallback(async (key, value) => {
        const updatedAt = await setToolCallStateMutation(chatId, toolCallId, key, value);
        // @ts-expect-error - we know that T is an object
        setState((prev) => (prev != null ? { ...prev, [key]: value } : { [key]: value }));
        setUpdatedAt(updatedAt);
    }, [chatId, toolCallId, setToolCallStateMutation]);
    return {
        state,
        updatedAt,
        setState: setToolCallState,
        loaded,
        startLoadingState: fetchToolCallState,
    };
}
//# sourceMappingURL=use-tool-call-state.js.map