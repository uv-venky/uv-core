'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { Loader2Icon, SendIcon, SquareIcon, XIcon } from 'lucide-react';
import { Children } from 'react';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { cn } from '@/lib/chat/utils';
export const PromptInput = ({ className, ...props }) => (_jsx("form", { className: cn('w-full overflow-hidden rounded-xl border bg-background shadow-xs', className), ...props }));
export const PromptInputTextarea = ({ onChange, className, placeholder = 'What would you like to know?', minHeight = 48, maxHeight = 164, disableAutoResize = false, resizeOnNewLinesOnly = false, ...props }) => {
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            // Don't submit if IME composition is in progress
            if (e.nativeEvent.isComposing) {
                return;
            }
            if (e.shiftKey) {
                // Allow newline
                return;
            }
            if (!e.currentTarget.value.trim()) {
                return;
            }
            // Submit on Enter (without Shift)
            e.preventDefault();
            const form = e.currentTarget.form;
            if (form) {
                form.requestSubmit();
            }
        }
    };
    return (_jsx(Textarea, { className: cn('w-full resize-none rounded-none border-none p-3 shadow-none outline-hidden ring-0', disableAutoResize
            ? 'field-sizing-fixed'
            : resizeOnNewLinesOnly
                ? 'field-sizing-fixed'
                : 'field-sizing-content max-h-[6lh]', 'bg-transparent dark:bg-transparent', 'focus-visible:ring-0', className), name: "message", onChange: (e) => {
            onChange?.(e);
        }, onKeyDown: handleKeyDown, placeholder: placeholder, autoComplete: "off", autoCapitalize: "off", autoCorrect: "off", ...props }));
};
export const PromptInputToolbar = ({ className, ...props }) => (_jsx("div", { className: cn('flex items-center justify-between p-1', className), ...props }));
export const PromptInputTools = ({ className, ...props }) => (_jsx("div", { className: cn('flex items-center gap-1', '[&_button:first-child]:rounded-bl-xl', className), ...props }));
export const PromptInputButton = ({ variant = 'ghost', className, size, ...props }) => {
    const newSize = (size ?? Children.count(props.children) > 1) ? 'default' : 'icon';
    return (_jsx(Button, { className: cn('shrink-0 gap-1.5 rounded-lg', variant === 'ghost' && 'text-muted-foreground', newSize === 'default' && 'px-3', className), size: newSize, type: "button", variant: variant, ...props }));
};
export const PromptInputSubmit = ({ className, variant = 'default', size = 'icon', status, children, ...props }) => {
    let Icon = _jsx(SendIcon, { className: "size-4" });
    if (status === 'submitted') {
        Icon = _jsx(Loader2Icon, { className: "size-4 animate-spin" });
    }
    else if (status === 'streaming') {
        Icon = _jsx(SquareIcon, { className: "size-4" });
    }
    else if (status === 'error') {
        Icon = _jsx(XIcon, { className: "size-4" });
    }
    return (_jsx(Button, { className: cn('gap-1.5 rounded-lg', className), size: size, type: "submit", variant: variant, ...props, children: children ?? Icon }));
};
export const PromptInputModelSelect = (props) => _jsx(Select, { ...props });
export const PromptInputModelSelectTrigger = ({ className, ...props }) => (_jsx(SelectTrigger, { className: cn('border-none bg-transparent font-medium text-muted-foreground shadow-none transition-colors', 'hover:bg-accent hover:text-foreground aria-expanded:bg-accent aria-expanded:text-foreground', 'h-auto px-2 py-1.5', className), ...props }));
export const PromptInputModelSelectContent = ({ className, ...props }) => (_jsx(SelectContent, { className: cn(className), ...props }));
export const PromptInputModelSelectItem = ({ className, ...props }) => (_jsx(SelectItem, { className: cn(className), ...props }));
export const PromptInputModelSelectValue = ({ className, ...props }) => (_jsx(SelectValue, { className: cn(className), ...props }));
//# sourceMappingURL=prompt-input.js.map