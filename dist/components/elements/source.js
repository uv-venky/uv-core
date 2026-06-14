'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { BookOpenTextIcon, ChevronDownIcon } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../components/ui/collapsible';
import { cn } from '@/lib/chat/utils';
export const Sources = ({ className, ...props }) => (_jsx(Collapsible, { className: cn('not-prose mb-4 text-primary text-xs', className), ...props }));
export const SourcesTrigger = ({ className, count, children, ...props }) => (_jsx(CollapsibleTrigger, { className: "flex items-center gap-2", ...props, children: children ?? (_jsxs(_Fragment, { children: [_jsxs("p", { className: "font-medium", children: ["Used ", count, " sources"] }), _jsx(ChevronDownIcon, { className: "size-4" })] })) }));
export const SourcesContent = ({ className, ...props }) => (_jsx(CollapsibleContent, { className: cn('mt-3 flex w-fit flex-col gap-2', 'data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 outline-hidden data-[state=closed]:animate-out data-[state=open]:animate-in', className), ...props }));
export const Source = ({ title, page }) => (_jsxs("button", { className: "inline-flex cursor-pointer items-center gap-2 border-0 text-muted-foreground text-sm hover:text-blue-500 hover:underline", onClick: (e) => {
        e.preventDefault();
    }, type: "button", children: [_jsx(BookOpenTextIcon, { className: "size-3" }), _jsx("span", { className: "block", children: title }), page && _jsxs("span", { className: "block", children: ["Page ", page] })] }));
//# sourceMappingURL=source.js.map