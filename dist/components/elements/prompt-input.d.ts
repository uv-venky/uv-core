import type { ChatStatus } from 'ai';
import type { ComponentProps, HTMLAttributes } from 'react';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
type PromptInputProps = HTMLAttributes<HTMLFormElement>;
export declare const PromptInput: ({ className, ...props }: PromptInputProps) => import("react/jsx-runtime").JSX.Element;
type PromptInputTextareaProps = ComponentProps<typeof Textarea> & {
    minHeight?: number;
    maxHeight?: number;
    disableAutoResize?: boolean;
    resizeOnNewLinesOnly?: boolean;
};
export declare const PromptInputTextarea: ({ onChange, className, placeholder, minHeight, maxHeight, disableAutoResize, resizeOnNewLinesOnly, ...props }: PromptInputTextareaProps) => import("react/jsx-runtime").JSX.Element;
type PromptInputToolbarProps = HTMLAttributes<HTMLDivElement>;
export declare const PromptInputToolbar: ({ className, ...props }: PromptInputToolbarProps) => import("react/jsx-runtime").JSX.Element;
type PromptInputToolsProps = HTMLAttributes<HTMLDivElement>;
export declare const PromptInputTools: ({ className, ...props }: PromptInputToolsProps) => import("react/jsx-runtime").JSX.Element;
type PromptInputButtonProps = ComponentProps<typeof Button>;
export declare const PromptInputButton: ({ variant, className, size, ...props }: PromptInputButtonProps) => import("react/jsx-runtime").JSX.Element;
type PromptInputSubmitProps = ComponentProps<typeof Button> & {
    status?: ChatStatus;
};
export declare const PromptInputSubmit: ({ className, variant, size, status, children, ...props }: PromptInputSubmitProps) => import("react/jsx-runtime").JSX.Element;
type PromptInputModelSelectProps = ComponentProps<typeof Select>;
export declare const PromptInputModelSelect: (props: PromptInputModelSelectProps) => import("react/jsx-runtime").JSX.Element;
type PromptInputModelSelectTriggerProps = ComponentProps<typeof SelectTrigger>;
export declare const PromptInputModelSelectTrigger: ({ className, ...props }: PromptInputModelSelectTriggerProps) => import("react/jsx-runtime").JSX.Element;
type PromptInputModelSelectContentProps = ComponentProps<typeof SelectContent>;
export declare const PromptInputModelSelectContent: ({ className, ...props }: PromptInputModelSelectContentProps) => import("react/jsx-runtime").JSX.Element;
type PromptInputModelSelectItemProps = ComponentProps<typeof SelectItem>;
export declare const PromptInputModelSelectItem: ({ className, ...props }: PromptInputModelSelectItemProps) => import("react/jsx-runtime").JSX.Element;
type PromptInputModelSelectValueProps = ComponentProps<typeof SelectValue>;
export declare const PromptInputModelSelectValue: ({ className, ...props }: PromptInputModelSelectValueProps) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=prompt-input.d.ts.map