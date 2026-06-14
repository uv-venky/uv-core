'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { BrainIcon, ChevronDownIcon } from 'lucide-react';
import { createContext, memo, useContext, useEffect, useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../components/ui/collapsible';
import { cn } from '@/lib/chat/utils';
import { Response } from './response';
import { useChatContext } from '../chat/chat-context';
const ReasoningContext = createContext(null);
const useReasoning = () => {
    const context = useContext(ReasoningContext);
    if (!context) {
        throw new Error('Reasoning components must be used within Reasoning');
    }
    return context;
};
const AUTO_CLOSE_DELAY = 500;
const MS_IN_S = 1000;
export const Reasoning = memo(({ className, isStreaming = false, open, defaultOpen = true, onOpenChange, duration: durationProp, children, ...props }) => {
    const [isOpen, setIsOpen] = useControllableState({
        prop: open,
        defaultProp: defaultOpen,
        onChange: onOpenChange,
    });
    const [duration, setDuration] = useControllableState({
        prop: durationProp,
        defaultProp: 0,
    });
    const [hasAutoClosedRef, setHasAutoClosedRef] = useState(false);
    const [startTime, setStartTime] = useState(null);
    // Track duration when streaming starts and ends
    useEffect(() => {
        if (isStreaming) {
            if (startTime === null) {
                setStartTime(Date.now());
            }
        }
        else if (startTime !== null) {
            setDuration(Math.round((Date.now() - startTime) / MS_IN_S));
            setStartTime(null);
        }
    }, [isStreaming, startTime, setDuration]);
    // Auto-open when streaming starts, auto-close when streaming ends (once only)
    useEffect(() => {
        if (defaultOpen && !isStreaming && isOpen && !hasAutoClosedRef) {
            // Add a small delay before closing to allow user to see the content
            const timer = setTimeout(() => {
                setIsOpen(false);
                setHasAutoClosedRef(true);
            }, AUTO_CLOSE_DELAY);
            return () => clearTimeout(timer);
        }
    }, [isStreaming, isOpen, defaultOpen, setIsOpen, hasAutoClosedRef]);
    const handleOpenChange = (newOpen) => {
        setIsOpen(newOpen);
    };
    return (_jsx(ReasoningContext.Provider, { value: { isStreaming, isOpen, setIsOpen, duration }, children: _jsx(Collapsible, { className: cn('not-prose', className), onOpenChange: handleOpenChange, open: isOpen, ...props, children: children }) }));
});
export const ReasoningTrigger = memo(({ className, children, ...props }) => {
    const { isStreaming, isOpen, duration } = useReasoning();
    const { source } = useChatContext();
    return (_jsx(CollapsibleTrigger, { className: cn('flex items-center gap-1.5 text-muted-foreground text-xs transition-colors hover:text-foreground', className), ...props, children: children ?? (_jsxs(_Fragment, { children: [_jsx(BrainIcon, { className: "size-4" }), source === 'chatbot' ? (_jsx("p", { children: "Thinking..." })) : isStreaming || duration === 0 ? (_jsx("p", { children: "Thinking..." })) : (_jsxs("p", { children: ["Thought for ", duration, "s"] })), _jsx(ChevronDownIcon, { className: cn('size-3 text-muted-foreground transition-transform', isOpen ? 'rotate-180' : 'rotate-0') })] })) }));
});
export const ReasoningContent = memo(({ className, children, ...props }) => (_jsx(CollapsibleContent, { className: cn('mt-2 text-muted-foreground text-xs', 'data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 outline-hidden data-[state=closed]:animate-out data-[state=open]:animate-in', className), ...props, children: _jsx(Response, { className: "grid gap-2", children: children }) })));
Reasoning.displayName = 'Reasoning';
ReasoningTrigger.displayName = 'ReasoningTrigger';
ReasoningContent.displayName = 'ReasoningContent';
//# sourceMappingURL=reasoning.js.map