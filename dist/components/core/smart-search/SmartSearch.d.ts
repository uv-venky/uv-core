import type { Column, SavedSearchAction } from '../../../components/core/smart-search/types';
import type { Filters, SingleFilter } from '../../../lib/core/common/ds/types/filter';
import type { SavedSearchPayload } from '../../../lib/common/ds/types/core/SavedSearch';
export type OnSearchCallback<T extends object> = (payload: SavedSearchPayload<T>, action: SavedSearchAction) => void;
interface Props<T extends object> {
    columns: Column<T>[];
    border?: 'full' | 'bottom' | 'none';
    className?: string;
    filters: Filters<T>;
    headerFilters?: SingleFilter<T>[];
    hideSearchButton?: boolean;
    isBusy?: boolean;
    placeholder?: string;
    readOnly?: boolean;
    roundedCorners?: boolean;
    searchOnBlur?: boolean;
    onSearch: OnSearchCallback<T>;
    savedSearch?: React.ReactNode;
    stickyFilters?: (keyof T)[];
}
declare const _default: <T extends object>(props: Props<T>) => React.ReactNode;
export default _default;
//# sourceMappingURL=SmartSearch.d.ts.map