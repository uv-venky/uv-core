import type { UseChatHelpers } from '@ai-sdk/react';
import type { ChatMessage } from '@/lib/chat/types';
export declare function useMessages({ status }: {
    status: UseChatHelpers<ChatMessage>['status'];
}): {
    containerRef: import("react").RefObject<HTMLDivElement | null>;
    endRef: import("react").RefObject<HTMLDivElement | null>;
    isAtBottom: boolean;
    scrollToBottom: (currentScrollBehavior?: ScrollBehavior) => void;
    onViewportEnter: () => void;
    onViewportLeave: () => void;
    hasSentMessage: boolean;
};
//# sourceMappingURL=use-messages.d.ts.map