import type { ToolUIPart } from 'ai';
import type { ComponentProps, ReactNode } from 'react';
import { Collapsible, CollapsibleContent } from '../../components/ui/collapsible';
type ToolProps = ComponentProps<typeof Collapsible>;
export declare const Tool: ({ className, ...props }: ToolProps) => import("react/jsx-runtime").JSX.Element;
type ToolHeaderProps = {
    type: ToolUIPart['type'];
    state: ToolUIPart['state'];
    className?: string;
};
export declare const ToolHeader: ({ className, type, state, ...props }: ToolHeaderProps) => import("react/jsx-runtime").JSX.Element;
type ToolContentProps = ComponentProps<typeof CollapsibleContent>;
export declare const ToolContent: ({ className, ...props }: ToolContentProps) => import("react/jsx-runtime").JSX.Element;
type ToolInputProps = ComponentProps<'div'> & {
    input: ToolUIPart['input'];
};
export declare const ToolInput: ({ className, input, ...props }: ToolInputProps) => import("react/jsx-runtime").JSX.Element;
type ToolOutputProps = ComponentProps<'div'> & {
    output: ReactNode;
    errorText: ToolUIPart['errorText'];
};
export declare const ToolOutput: ({ className, output, errorText, ...props }: ToolOutputProps) => import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=tool.d.ts.map