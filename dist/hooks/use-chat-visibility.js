'use client';
import { useMemo } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { unstable_serialize } from 'swr/infinite';
import { makeChatHistoryPaginationKey } from '@/components/chat/sidebar-history';
import { useChatAgent } from './use-chat-agent';
import { useChatContext } from '../components/chat/chat-context';
import { useMutation } from '../lib/core/client/useQuery';
export function useChatVisibility({ chatId, initialVisibilityType, }) {
    const { mutate, cache } = useSWRConfig();
    const { source } = useChatContext();
    const [selectedAgent] = useChatAgent();
    const history = cache.get('/api/history')?.data;
    const updateChatVisibilityMutation = useMutation('updateChatVisibility');
    const { data: localVisibility, mutate: setLocalVisibility } = useSWR(`${chatId}-visibility`, null, {
        fallbackData: initialVisibilityType,
    });
    const visibilityType = useMemo(() => {
        if (!history) {
            return localVisibility;
        }
        const chat = history.chats.find((currentChat) => currentChat.id === chatId);
        if (!chat) {
            return 'private';
        }
        return chat.visibility;
    }, [history, chatId, localVisibility]);
    const setVisibilityType = (updatedVisibilityType) => {
        setLocalVisibility(updatedVisibilityType);
        mutate(unstable_serialize(makeChatHistoryPaginationKey(selectedAgent, source)));
        updateChatVisibilityMutation(chatId, updatedVisibilityType);
    };
    return { visibilityType, setVisibilityType };
}
//# sourceMappingURL=use-chat-visibility.js.map