/* Copyright (c) 2023-present Wayvo Corp. */

import { cn } from '@/lib/utils';
import { ClearButton } from '@/components/core/smart-search/ClearButton';
import { SearchButton } from '@/components/core/smart-search/SearchButton';
import { SearchInput } from '@/components/core/smart-search/SearchInput';
import { SmartSearchColumnsProvider, SmartSearchProvider } from '@/components/core/smart-search/context';
import type { Column, SavedSearchAction } from '@/components/core/smart-search/types';
import type { Filters, SingleFilter } from '@/lib/core/common/ds/types/filter';
import type { SavedSearchPayload } from '@/lib/common/ds/types/core/SavedSearch';
import { memo } from 'react';
import ErrorBoundary from '../common/ErrorBoundary';

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

function SmartSearch<T extends object>(props: Props<T>) {
  const {
    onSearch,
    columns,
    filters,
    headerFilters,
    searchOnBlur = true,
    savedSearch,
    placeholder,
    readOnly,
    border,
    className,
    roundedCorners,
    hideSearchButton,
    isBusy,
    stickyFilters,
  } = props;
  return (
    <ErrorBoundary showDetails={process.env.NODE_ENV === 'development'}>
      <SmartSearchColumnsProvider columns={columns}>
        <SmartSearchProvider
          filters={filters}
          headerFilters={headerFilters}
          searchOnBlur={searchOnBlur}
          onSearch={onSearch}
          stickyFilters={stickyFilters}
        >
          <div
            data-smart-search={true}
            className={cn('smart-search flex min-h-[40px] w-full gap-2 p-1', className, {
              border: border === 'full',
              'border-b': border === 'bottom',
              'rounded-md': roundedCorners && border === 'full',
            })}
          >
            {savedSearch}
            <SearchInput placeholder={placeholder} readOnly={readOnly} stickyFilters={stickyFilters} />
            {!readOnly && (
              <>
                <ClearButton stickyFilters={stickyFilters} />
                {!hideSearchButton && <SearchButton isBusy={isBusy} />}
              </>
            )}
          </div>
        </SmartSearchProvider>
      </SmartSearchColumnsProvider>
    </ErrorBoundary>
  );
}

export default memo(SmartSearch) as <T extends object>(props: Props<T>) => React.ReactNode;
