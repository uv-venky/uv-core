import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
/* Copyright (c) 2023-present Wayvo Corp. */
import { cn } from '../../../lib/utils';
import { ClearButton } from '../../../components/core/smart-search/ClearButton';
import { SearchButton } from '../../../components/core/smart-search/SearchButton';
import { SearchInput } from '../../../components/core/smart-search/SearchInput';
import { SmartSearchColumnsProvider, SmartSearchProvider } from '../../../components/core/smart-search/context';
import { memo } from 'react';
import ErrorBoundary from '../common/ErrorBoundary';
function SmartSearch(props) {
    const { onSearch, columns, filters, headerFilters, searchOnBlur = true, savedSearch, placeholder, readOnly, border, className, roundedCorners, hideSearchButton, isBusy, stickyFilters, } = props;
    return (_jsx(ErrorBoundary, { showDetails: process.env.NODE_ENV === 'development', children: _jsx(SmartSearchColumnsProvider, { columns: columns, children: _jsx(SmartSearchProvider, { filters: filters, headerFilters: headerFilters, searchOnBlur: searchOnBlur, onSearch: onSearch, stickyFilters: stickyFilters, children: _jsxs("div", { "data-smart-search": true, className: cn('smart-search flex min-h-[40px] w-full gap-2 p-1', className, {
                        border: border === 'full',
                        'border-b': border === 'bottom',
                        'rounded-md': roundedCorners && border === 'full',
                    }), children: [savedSearch, _jsx(SearchInput, { placeholder: placeholder, readOnly: readOnly, stickyFilters: stickyFilters }), !readOnly && (_jsxs(_Fragment, { children: [_jsx(ClearButton, { stickyFilters: stickyFilters }), !hideSearchButton && _jsx(SearchButton, { isBusy: isBusy })] }))] }) }) }) }));
}
export default memo(SmartSearch);
//# sourceMappingURL=SmartSearch.js.map