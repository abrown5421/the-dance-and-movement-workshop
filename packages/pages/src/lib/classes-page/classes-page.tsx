import React, { useEffect, useMemo, useState } from 'react';
import { Box, Loader, Text, Pagination, Input, Select, Button } from '@inithium/ui';
import { ClassCard } from './class-card';
import {
  useReadAllClassesQuery,
  useReadClassFilterOptionsQuery,
  useSyncClassesMutation,
} from '@inithium/store';

const ITEMS_PER_PAGE = 12;
const SEARCH_DEBOUNCE_MS = 300;

const useDebouncedValue = <T,>(value: T, delayMs: number): T => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timeout);
  }, [value, delayMs]);

  return debounced;
};

const ClassesPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [areFiltersOpen, setAreFiltersOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const debouncedSearch = useDebouncedValue(searchInput, SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category, startDate, endDate]);

  const { data: filterOptions } = useReadClassFilterOptionsQuery();

  const categoryOptions = useMemo(
    () => [
      { value: '', label: 'All Categories' },
      ...(filterOptions?.categories ?? []).map((c) => ({ value: c, label: c })),
    ],
    [filterOptions]
  );

  const hasActiveFilters = Boolean(searchInput || category || startDate || endDate);

  const { data, isLoading, isFetching, isError } = useReadAllClassesQuery({
    page,
    limit: ITEMS_PER_PAGE,
    q: debouncedSearch || undefined,
    category: category || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const [syncClasses, { isLoading: isSyncing }] = useSyncClassesMutation();

  useEffect(() => {
    syncClasses().catch(() => {});
  }, []);
  
  const isInitialLoading = isLoading || isSyncing;

  if (isInitialLoading) {
    return (
      <Box padding="md" flex justify="center" align="center" className="h-m-nav">
        <Loader variant="spinner" size="lg" color="primary" />
      </Box>
    );
  }

  if (isError || !data) {
    return (
      <Box padding="md" flex justify="center" align="center" className="h-m-nav">
        <Text variant="body" color="surface">
          Unable to load classes right now.
        </Text>
      </Box>
    );
  }

  return (
    <Box padding="md" className="h-m-nav flex flex-col gap-6">
      <Box flex direction="col" className="gap-3 w-full">
        <Box flex direction="row" justify="between" align="center" className="gap-2">
          <Input
            label="Search for a class"
            leadingIcon="search"
            value={searchInput}
            size="sm"
            onChange={(e) => setSearchInput(e.target.value)}
            fullWidth
            overrideClassName="peer block appearance-none outline-hidden transition-all duration-200 ease-in-out placeholder-transparent! pt-5 pb-1.5 text-base pl-10 pr-4 bg-transparent border border-slate-300 focus:border-2 focus:pt-[19px] focus:pb-[5px] focus:border-primary focus:ring-primary text-surface-contrast rounded-md w-full min-w-[220px]"
          />

          <Box overrideClassName="relative">
            <Button
              icon="sliders-horizontal"
              variant={areFiltersOpen ? 'solid' : 'outline'}
              color="primary"
              size="md"
              aria-label={areFiltersOpen ? 'Hide filters' : 'Show filters'}
              aria-expanded={areFiltersOpen}
              onClick={() => setAreFiltersOpen((open) => !open)}
            />
            {hasActiveFilters && !areFiltersOpen && (
              <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-surface4" />
            )}
          </Box>
        </Box>

        <Box
          overrideClassName={`grid transition-all duration-300 ease-in-out ${
            areFiltersOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <Box overrideClassName="overflow-hidden">
            <Box overrideClassName="grid grid-cols-1 md:grid-cols-3 gap-3 items-end w-full pt-1 pb-2">
              <Select
                label="Category"
                options={categoryOptions}
                value={category}
                size="sm"
                fullWidth
                onChange={(e) => setCategory(e.target.value)}
              />

              <Input
                label="Start Date"
                type="date"
                size="sm"
                value={startDate}
                fullWidth
                onChange={(e) => setStartDate(e.target.value)}
              />

              <Input
                label="End Date"
                type="date"
                size="sm"
                value={endDate}
                fullWidth
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {data.data.length === 0 ? (
        <Box padding="md" flex justify="center" align="center">
          <Text variant="body" color="surface">
            No classes match your filters.
          </Text>
        </Box>
      ) : (
        <Box
          overrideClassName="flex flex-row flex-wrap gap-4 w-full items-stretch justify-start"
          style={{ opacity: isFetching ? 0.6 : 1 }}
        >
          {data.data.map((danceClass) => (
            <ClassCard key={danceClass._id} danceClass={danceClass} />
          ))}
        </Box>
      )}

      <Pagination
        totalItems={data.meta.total}
        itemsPerPage={data.meta.limit}
        currentPage={data.meta.page}
        onPageChange={setPage}
        className="flex flex-row items-center justify-center"
      />
    </Box>
  );
};

export default ClassesPage;