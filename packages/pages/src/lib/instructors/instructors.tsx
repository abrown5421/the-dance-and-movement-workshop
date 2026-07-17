import React, { useState } from 'react';
import { Box, Loader, Text, Pagination } from '@inithium/ui';
import { useReadAllInstructorsQuery } from '@inithium/store';
import type { Instructor } from '@inithium/types';
import { InstructorCard } from './instructor-card';

const LayoutConfiguration = {
  SINGLE_ROW: {
    container: "grid grid-cols-1 auto-rows-[100%] overflow-y-auto sm:overflow-visible sm:grid-cols-2 lg:grid-cols-4 sm:auto-rows-fr gap-6 p-4 w-full h-full",
    card: "h-full",
    hasPagination: false
  },
  DOUBLE_ROW_STATIC: {
    container: "grid grid-cols-1 auto-rows-[100%] overflow-y-auto sm:overflow-visible sm:grid-cols-2 lg:grid-cols-4 sm:auto-rows-fr gap-6 p-4 w-full h-full",
    card: "h-full",
    hasPagination: false
  },
  DOUBLE_ROW_PAGINATED: {
    container: "grid grid-cols-1 auto-rows-[100%] overflow-y-auto sm:overflow-visible sm:grid-cols-2 lg:grid-cols-4 sm:auto-rows-fr gap-6 p-4 w-full h-full",
    card: "h-full",
    hasPagination: true
  }
};

const evaluateLayoutType = (totalCount: number) => {
  if (totalCount <= 4) return LayoutConfiguration.SINGLE_ROW;
  if (totalCount < 9) return LayoutConfiguration.DOUBLE_ROW_STATIC;
  return LayoutConfiguration.DOUBLE_ROW_PAGINATED;
};

const getFetchLimit = (totalCount: number) => totalCount <= 4 ? 4 : 8;

const Instructors: React.FC = () => {
  const [page, setPage] = useState(1);

  const { data: initialData, isLoading: isInitialLoading } = useReadAllInstructorsQuery({
    page: 1,
    limit: 1,
    status: 'Active',
  });
  const totalInstructorCount = initialData?.meta?.total ?? 0;

  const layout = evaluateLayoutType(totalInstructorCount);
  const currentLimit = getFetchLimit(totalInstructorCount);

  const { data, isLoading, isFetching, isError } = useReadAllInstructorsQuery(
    { page, limit: currentLimit, status: 'Active' },
    { skip: isInitialLoading }
  );

  if (isInitialLoading || isLoading) {
    return (
      <Box padding="md" flex justify="center" align="center" overrideClassName="h-m-nav w-full">
        <Loader variant="spinner" size="lg" color="primary" />
      </Box>
    );
  }

  if (isError || !data) {
    return (
      <Box padding="md" flex justify="center" align="center" overrideClassName="h-m-nav w-full">
        <Text variant="body" color="surface">
          Unable to load instructor profiles at this time.
        </Text>
      </Box>
    );
  }

  const currentInstructorList = data.data ?? [];

  return (
    <Box padding="md" className='h-m-nav flex flex-col gap-6 w-full box-border'>
      {currentInstructorList.length === 0 ? (
        <Box padding="md" flex justify="center" align="center" overrideClassName="w-full flex-1 min-h-0">
          <Text variant="body" color="surface">
            No instructors found in the records.
          </Text>
        </Box>
      ) : (
        <Box
          overrideClassName={`${layout.container} flex-1 min-h-0`}
          style={{ opacity: isFetching ? 0.6 : 1, transition: 'opacity 0.2s' }}
        >
          {currentInstructorList.map((instructor: Instructor) => (
            <InstructorCard
              key={instructor._id}
              instructor={instructor}
              heightClass={layout.card}
            />
          ))}
        </Box>
      )}

      {layout.hasPagination && (
        <Box flex justify="center" align="center" overrideClassName="w-full pt-2 shrink-0">
          <Pagination
            totalItems={totalInstructorCount}
            itemsPerPage={currentLimit}
            currentPage={page}
            onPageChange={setPage}
            className="flex flex-row items-center justify-center"
          />
        </Box>
      )}
    </Box>
  );
};

export default Instructors;