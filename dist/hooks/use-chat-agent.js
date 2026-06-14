'use client';
import { useCallback } from 'react';
import { proxy, useSnapshot } from 'valtio';
import { showError } from '../components/core/common';
const chatAgentProxy = proxy({
    agent: '',
    pendingToolCallId: null,
});
export function setDefaultChatAgent(agent) {
    if (chatAgentProxy.agent === agent) {
        return;
    }
    chatAgentProxy.agent = agent;
}
// export function setDefaultChatAgent(agent: string) {
//   if (chatAgentProxy.agent === 'chatbot') {
//     chatAgentProxy.agent = DEFAULT_CHAT_AGENT;
//   }
// }
export function useChatAgent() {
    const agent = useSnapshot(chatAgentProxy).agent;
    const setAgent = useCallback((agent) => {
        chatAgentProxy.agent = agent;
    }, []);
    return [agent, setAgent];
}
export function useChatPendingToolCallId() {
    const pendingToolCallId = useSnapshot(chatAgentProxy).pendingToolCallId;
    const setPendingToolCallId = useCallback((pendingToolCallId) => {
        if (chatAgentProxy.pendingToolCallId != null) {
            showError(`Pending tool call ID is already set with value ${chatAgentProxy.pendingToolCallId}. Cannot set to ${pendingToolCallId}.`);
            return () => {
                showError(`Pending tool call ID is already set with value ${chatAgentProxy.pendingToolCallId}. Cannot set to ${pendingToolCallId}. Hence this action is not allowed.`);
            };
        }
        chatAgentProxy.pendingToolCallId = pendingToolCallId;
        return () => {
            chatAgentProxy.pendingToolCallId = null;
        };
    }, []);
    return [pendingToolCallId, setPendingToolCallId];
}
//# sourceMappingURL=use-chat-agent.js.map