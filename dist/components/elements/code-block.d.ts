import type { ComponentProps, HTMLAttributes, ReactNode } from 'react';
import { Button } from '../../components/ui/button';
type CodeBlockProps = HTMLAttributes<HTMLDivElement> & {
    code: string;
    language: string;
    showLineNumbers?: boolean;
    children?: ReactNode;
};
export declare const CodeBlock: ({ code, language, showLineNumbers, className, children, ...props }: CodeBlockProps) => import("react/jsx-runtime").JSX.Element;
type CodeBlockCopyButtonProps = ComponentProps<typeof Button> & {
    onCopy?: () => void;
    onError?: (error: Error) => void;
    timeout?: number;
};
export declare const CodeBlockCopyButton: ({ onCopy, onError, timeout, children, className, ...props }: CodeBlockCopyButtonProps) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=code-block.d.ts.map