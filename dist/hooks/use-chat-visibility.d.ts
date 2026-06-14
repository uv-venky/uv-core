import type { VisibilityType } from '@/components/chat/visibility-selector';
export declare function useChatVisibility({ chatId, initialVisibilityType, }: {
    chatId: string;
    initialVisibilityType: VisibilityType;
}): {
    visibilityType: any;
    setVisibilityType: (updatedVisibilityType: VisibilityType) => void;
};
//# sourceMappingURL=use-chat-visibility.d.ts.map