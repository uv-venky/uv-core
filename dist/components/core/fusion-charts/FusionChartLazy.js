'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { lazy, Suspense } from 'react';
const FusionChartLoading = () => (_jsx("div", { className: "flex h-full w-full items-center justify-center bg-muted/30", children: _jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" }) }));
/**
 * Lazy-loaded FusionChart component.
 * This significantly reduces the initial bundle size by deferring
 * the loading of react-fusioncharts and FusionCharts libraries.
 */
const LazyFusionChartInner = lazy(() => import('./FusionChart'));
function LazyFusionChart(props) {
    return (_jsx(Suspense, { fallback: _jsx(FusionChartLoading, {}), children: _jsx(LazyFusionChartInner, { ...props }) }));
}
export { LazyFusionChart };
//# sourceMappingURL=FusionChartLazy.js.map