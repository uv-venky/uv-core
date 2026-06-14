import type { ComponentProps } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../components/ui/collapsible';
type ReasoningProps = ComponentProps<typeof Collapsible> & {
    isStreaming?: boolean;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    duration?: number;
};
export declare const Reasoning: import("react").MemoExoticComponent<({ className, isStreaming, open, defaultOpen, onOpenChange, duration: durationProp, children, ...props }: ReasoningProps) => import("react/jsx-runtime").JSX.Element>;
type ReasoningTriggerProps = ComponentProps<typeof CollapsibleTrigger>;
export declare const ReasoningTrigger: import("react").MemoExoticComponent<({ className, children, ...props }: ReasoningTriggerProps) => import("react/jsx-runtime").JSX.Element>;
type ReasoningContentProps = ComponentProps<typeof CollapsibleContent> & {
    children: string;
};
export declare const ReasoningContent: import("react").MemoExoticComponent<({ className, children, ...props }: ReasoningContentProps) => import("react/jsx-runtime").JSX.Element>;
export {};
//# sourceMappingURL=reasoning.d.ts.map