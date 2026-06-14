import type { UseChatHelpers } from '@ai-sdk/react';
import type { ChatMessage } from '@/lib/chat/types';
type UseAutoResumeParams = {
    autoResume: boolean;
    initialMessages: ChatMessage[];
    resumeStream: UseChatHelpers<ChatMessage>['resumeStream'];
    setMessages: UseChatHelpers<ChatMessage>['setMessages'];
};
export declare function useAutoResume({ autoResume, initialMessages, resumeStream, setMessages }: UseAutoResumeParams): void;
export {};
//# sourceMappingURL=use-auto-resume.d.ts.map