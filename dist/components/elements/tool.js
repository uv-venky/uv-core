'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CheckCircleIcon, ChevronDownIcon, CircleIcon, ClockIcon, WrenchIcon, XCircleIcon } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../components/ui/collapsible';
import { cn } from '@/lib/chat/utils';
import { CodeBlock } from './code-block';
export const Tool = ({ className, ...props }) => (_jsx(Collapsible, { className: cn('not-prose mb-4 w-full rounded-md border', className), ...props }));
const getStatusBadge = (status) => {
    const labels = {
        'input-streaming': 'Pending',
        'input-available': 'Running',
        'approval-requested': 'Approval Requested',
        'approval-responded': 'Approval Responded',
        'output-available': 'Completed',
        'output-denied': 'Denied',
        'output-error': 'Error',
    };
    const icons = {
        'input-streaming': _jsx(CircleIcon, { className: "size-4" }),
        'input-available': _jsx(ClockIcon, { className: "size-4 animate-pulse" }),
        'approval-requested': _jsx(ClockIcon, { className: "size-4 text-amber-500" }),
        'approval-responded': _jsx(ClockIcon, { className: "size-4 animate-pulse" }),
        'output-available': _jsx(CheckCircleIcon, { className: "size-4 text-green-600" }),
        'output-denied': _jsx(XCircleIcon, { className: "size-4 text-amber-500" }),
        'output-error': _jsx(XCircleIcon, { className: "size-4 text-red-600" }),
    };
    return (_jsxs(Badge, { className: "flex items-center gap-1 rounded-full text-xs", variant: "secondary", children: [icons[status], _jsx("span", { children: labels[status] })] }));
};
export const ToolHeader = ({ className, type, state, ...props }) => (_jsxs(CollapsibleTrigger, { className: cn('flex w-full min-w-0 items-center justify-between gap-2 p-3', className), ...props, children: [_jsxs("div", { className: "flex min-w-0 flex-1 items-center gap-2", children: [_jsx(WrenchIcon, { className: "size-4 shrink-0 text-muted-foreground" }), _jsx("span", { className: "truncate font-medium text-sm", children: type })] }), _jsxs("div", { className: "flex shrink-0 items-center gap-2", children: [getStatusBadge(state), _jsx(ChevronDownIcon, { className: "size-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" })] })] }));
export const ToolContent = ({ className, ...props }) => (_jsx(CollapsibleContent, { className: cn('data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 text-popover-foreground outline-hidden data-[state=closed]:animate-out data-[state=open]:animate-in', className), ...props }));
export const ToolInput = ({ className, input, ...props }) => (_jsxs("div", { className: cn('space-y-2 overflow-hidden p-4', className), ...props, children: [_jsx("h4", { className: "font-medium text-muted-foreground text-xs uppercase tracking-wide", children: "Parameters" }), _jsx("div", { className: "rounded-md bg-muted/50", children: _jsx(CodeBlock, { code: JSON.stringify(input, null, 2), language: "json" }) })] }));
export const ToolOutput = ({ className, output, errorText, ...props }) => {
    if (!(output || errorText)) {
        return null;
    }
    return (_jsxs("div", { className: cn('space-y-2 p-4', className), ...props, children: [_jsx("h4", { className: "font-medium text-muted-foreground text-xs uppercase tracking-wide", children: errorText ? 'Error' : 'Result' }), _jsxs("div", { className: cn('overflow-x-auto rounded-md text-xs [&_table]:w-full', errorText ? 'bg-destructive/10 text-destructive' : 'bg-muted/50 text-foreground'), children: [errorText && _jsx("div", { children: errorText }), output && _jsx("div", { children: output })] })] }));
};
//# sourceMappingURL=tool.js.map