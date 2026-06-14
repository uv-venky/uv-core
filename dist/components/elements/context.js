'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { Progress } from '../../components/ui/progress';
import { Separator } from '../../components/ui/separator';
import { cn } from '@/lib/chat/utils';
const _THOUSAND = 1000;
const _MILLION = 1_000_000;
const _BILLION = 1_000_000_000;
const PERCENT_MAX = 100;
// Lucide CircleIcon geometry
const ICON_VIEWBOX = 24;
const ICON_CENTER = 12;
const ICON_RADIUS = 10;
const ICON_STROKE_WIDTH = 2;
export const ContextIcon = ({ percent }) => {
    const radius = ICON_RADIUS;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference * (1 - percent / PERCENT_MAX);
    return (_jsxs("svg", { "aria-label": `${percent.toFixed(2)}% of model context used`, height: "28", role: "img", style: { color: 'currentcolor' }, viewBox: `0 0 ${ICON_VIEWBOX} ${ICON_VIEWBOX}`, width: "28", children: [_jsx("circle", { cx: ICON_CENTER, cy: ICON_CENTER, fill: "none", opacity: "0.25", r: radius, stroke: "currentColor", strokeWidth: ICON_STROKE_WIDTH }), _jsx("circle", { cx: ICON_CENTER, cy: ICON_CENTER, fill: "none", opacity: "0.7", r: radius, stroke: "currentColor", strokeDasharray: `${circumference} ${circumference}`, strokeDashoffset: dashOffset, strokeLinecap: "round", strokeWidth: ICON_STROKE_WIDTH, transform: `rotate(-90 ${ICON_CENTER} ${ICON_CENTER})` })] }));
};
function InfoRow({ label, tokens, costText }) {
    return (_jsxs("div", { className: "flex items-center justify-between text-xs", children: [_jsx("span", { className: "text-muted-foreground", children: label }), _jsxs("div", { className: "flex items-center gap-2 font-mono", children: [_jsx("span", { className: "min-w-[4ch] text-right", children: tokens === undefined ? '—' : tokens.toLocaleString() }), costText !== undefined && costText !== null && !Number.isNaN(Number.parseFloat(costText)) && (_jsxs("span", { className: "text-muted-foreground", children: ["$", Number.parseFloat(costText).toFixed(6)] }))] })] }));
}
export const Context = ({ className, usage, ...props }) => {
    const used = usage?.totalTokens ?? 0;
    const max = usage?.context?.totalMax ?? usage?.context?.combinedMax ?? usage?.context?.inputMax;
    const hasMax = typeof max === 'number' && Number.isFinite(max) && max > 0;
    const usedPercent = hasMax ? Math.min(100, (used / max) * 100) : 0;
    return (_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsxs("button", { className: cn('inline-flex select-none items-center gap-1 rounded-md text-sm', 'cursor-pointer bg-background text-foreground', className), type: "button", ...props, children: [_jsxs("span", { className: "hidden font-medium text-muted-foreground", children: [usedPercent.toFixed(1), "%"] }), _jsx(ContextIcon, { percent: usedPercent })] }) }), _jsx(DropdownMenuContent, { align: "end", className: "w-fit p-3", side: "top", children: _jsxs("div", { className: "min-w-[240px] space-y-2", children: [_jsxs("div", { className: "flex items-start justify-between text-sm", children: [_jsxs("span", { children: [usedPercent.toFixed(1), "%"] }), _jsx("span", { className: "text-muted-foreground", children: hasMax ? `${used} / ${max} tokens` : `${used} tokens` })] }), _jsx("div", { className: "space-y-2", children: _jsx(Progress, { className: "h-2 bg-muted", value: usedPercent }) }), _jsxs("div", { className: "mt-1 space-y-1", children: [usage?.cachedInputTokens && usage.cachedInputTokens > 0 && (_jsx(InfoRow, { costText: usage?.costUSD?.cacheReadUSD?.toString(), label: "Cache Hits", tokens: usage?.cachedInputTokens })), _jsx(InfoRow, { costText: usage?.costUSD?.inputUSD?.toString(), label: "Input", tokens: usage?.inputTokens }), _jsx(InfoRow, { costText: usage?.costUSD?.outputUSD?.toString(), label: "Output", tokens: usage?.outputTokens }), _jsx(InfoRow, { costText: usage?.costUSD?.reasoningUSD?.toString(), label: "Reasoning", tokens: usage?.reasoningTokens && usage.reasoningTokens > 0 ? usage.reasoningTokens : undefined }), usage?.costUSD?.totalUSD !== undefined && (_jsxs(_Fragment, { children: [_jsx(Separator, { className: "mt-1" }), _jsxs("div", { className: "flex items-center justify-between pt-1 text-xs", children: [_jsx("span", { className: "text-muted-foreground", children: "Total cost" }), _jsxs("div", { className: "flex items-center gap-2 font-mono", children: [_jsx("span", { className: "min-w-[4ch] text-right" }), _jsx("span", { children: Number.isNaN(Number.parseFloat(usage.costUSD.totalUSD.toString()))
                                                                ? '—'
                                                                : `$${Number.parseFloat(usage.costUSD.totalUSD.toString()).toFixed(6)}` })] })] })] }))] })] }) })] }));
};
//# sourceMappingURL=context.js.map