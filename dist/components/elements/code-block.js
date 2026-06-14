'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CheckIcon, CopyIcon } from 'lucide-react';
import { createContext, useContext, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from '../../components/ui/button';
import { cn } from '@/lib/chat/utils';
const CodeBlockContext = createContext({
    code: '',
});
export const CodeBlock = ({ code, language, showLineNumbers = false, className, children, ...props }) => (_jsx(CodeBlockContext.Provider, { value: { code }, children: _jsx("div", { className: cn('relative w-full overflow-hidden rounded-md border bg-background text-foreground', className), ...props, children: _jsxs("div", { className: "relative", children: [_jsx(SyntaxHighlighter, { className: "overflow-hidden dark:hidden", codeTagProps: {
                        className: 'font-mono text-sm',
                    }, customStyle: {
                        margin: 0,
                        padding: '1rem',
                        fontSize: '0.875rem',
                        background: 'hsl(var(--background))',
                        color: 'hsl(var(--foreground))',
                        overflowX: 'auto',
                        overflowWrap: 'break-word',
                        wordBreak: 'break-all',
                    }, language: language, lineNumberStyle: {
                        color: 'hsl(var(--muted-foreground))',
                        paddingRight: '1rem',
                        minWidth: '2.5rem',
                    }, showLineNumbers: showLineNumbers, style: oneLight, children: code }), _jsx(SyntaxHighlighter, { className: "hidden overflow-hidden dark:block", codeTagProps: {
                        className: 'font-mono text-sm',
                    }, customStyle: {
                        margin: 0,
                        padding: '1rem',
                        fontSize: '0.875rem',
                        background: 'hsl(var(--background))',
                        color: 'hsl(var(--foreground))',
                        overflowX: 'auto',
                        overflowWrap: 'break-word',
                        wordBreak: 'break-all',
                    }, language: language, lineNumberStyle: {
                        color: 'hsl(var(--muted-foreground))',
                        paddingRight: '1rem',
                        minWidth: '2.5rem',
                    }, showLineNumbers: showLineNumbers, style: oneDark, children: code }), children && _jsx("div", { className: "absolute top-2 right-2 flex items-center gap-2", children: children })] }) }) }));
export const CodeBlockCopyButton = ({ onCopy, onError, timeout = 2000, children, className, ...props }) => {
    const [isCopied, setIsCopied] = useState(false);
    const { code } = useContext(CodeBlockContext);
    const copyToClipboard = async () => {
        if (typeof window === 'undefined' || !navigator.clipboard.writeText) {
            onError?.(new Error('Clipboard API not available'));
            return;
        }
        try {
            await navigator.clipboard.writeText(code);
            setIsCopied(true);
            onCopy?.();
            setTimeout(() => setIsCopied(false), timeout);
        }
        catch (error) {
            onError?.(error);
        }
    };
    const Icon = isCopied ? CheckIcon : CopyIcon;
    return (_jsx(Button, { className: cn('shrink-0', className), onClick: copyToClipboard, size: "icon", variant: "ghost", ...props, children: children ?? _jsx(Icon, { size: 14 }) }));
};
//# sourceMappingURL=code-block.js.map