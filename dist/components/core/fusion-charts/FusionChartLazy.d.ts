import { type ComponentProps } from 'react';
import type { FusionChartProps } from '../../../components/core/fusion-charts/types';
/**
 * Lazy-loaded FusionChart component.
 * This significantly reduces the initial bundle size by deferring
 * the loading of react-fusioncharts and FusionCharts libraries.
 */
declare const LazyFusionChartInner: import("react").LazyExoticComponent<typeof import("./FusionChart").default>;
declare function LazyFusionChart(props: ComponentProps<typeof LazyFusionChartInner>): import("react/jsx-runtime").JSX.Element;
export { LazyFusionChart };
export type { FusionChartProps };
//# sourceMappingURL=FusionChartLazy.d.ts.map