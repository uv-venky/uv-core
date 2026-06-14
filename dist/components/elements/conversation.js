'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { ArrowDownIcon } from 'lucide-react';
import { useCallback } from 'react';
import { StickToBottom, useStickToBottomContext } from 'use-stick-to-bottom';
import { Button } from '../../components/ui/button';
import { cn } from '@/lib/chat/utils';
export const Conversation = ({ className, ...props }) => (_jsx(StickToBottom, { className: cn('relative flex-1 touch-pan-y overflow-y-auto will-change-scroll', className), initial: "smooth", resize: "smooth", role: "log", ...props }));
export const ConversationContent = ({ className, style, ...props }) => (_jsx(StickToBottom.Content, { className: cn('[&>div:first-child]:!min-h-full [&>div:first-child]:!h-auto p-4', className), style: style, ...props }));
export const ConversationScrollButton = ({ className, ...props }) => {
    const { isAtBottom, scrollToBottom } = useStickToBottomContext();
    const handleScrollToBottom = useCallback(() => {
        scrollToBottom();
    }, [scrollToBottom]);
    return (!isAtBottom && (_jsx(Button, { className: cn('absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full shadow-lg', className), onClick: handleScrollToBottom, size: "icon", type: "button", variant: "outline", ...props, children: _jsx(ArrowDownIcon, { className: "size-4" }) })));
};
//# sourceMappingURL=conversation.js.map