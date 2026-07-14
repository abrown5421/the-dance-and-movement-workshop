import React, { useState } from 'react';
import { Box, Loader, Text, Pagination } from '@inithium/ui';
import { useReadAllStaffQuery } from '@inithium/store';
import type { StaffMember } from '@inithium/types';
import { OurTeamCard } from './our-team-card';

const LayoutConfiguration = {
  SINGLE_ROW: {
    container: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-fr gap-6 p-4 w-full h-full",
    card: "h-full",
    hasPagination: false
  },
  DOUBLE_ROW_STATIC: {
    container: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-fr gap-6 p-4 w-full h-full",
    card: "h-full",
    hasPagination: false
  },
  DOUBLE_ROW_PAGINATED: {
    container: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-fr gap-6 p-4 w-full h-full",
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

const OurTeam: React.FC = () => {
  const [page, setPage] = useState(1);
  
  const { data: initialData, isLoading: isInitialLoading } = useReadAllStaffQuery({ page: 1, limit: 1 });
  const totalStaffCount = initialData?.meta?.total ?? 0;
  
  const layout = evaluateLayoutType(totalStaffCount);
  const currentLimit = getFetchLimit(totalStaffCount);

  const { data, isLoading, isFetching, isError } = useReadAllStaffQuery(
    { page, limit: currentLimit },
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
          Unable to load staff profiles at this time.
        </Text>
      </Box>
    );
  }

  const currentStaffList = data.data ?? [];

  return (
    <Box padding="md" className='h-m-nav flex flex-col gap-6 w-full box-border'>
      {currentStaffList.length === 0 ? (
        <Box padding="md" flex justify="center" align="center" overrideClassName="w-full flex-1 min-h-0">
          <Text variant="body" color="surface">
            No team members found in the records.
          </Text>
        </Box>
      ) : (
        <Box
          overrideClassName={`${layout.container} flex-1 min-h-0`}
          style={{ opacity: isFetching ? 0.6 : 1, transition: 'opacity 0.2s' }}
        >
          {currentStaffList.map((member: StaffMember) => (
            <OurTeamCard
              key={member._id}
              member={member}
              heightClass={layout.card}
            />
          ))}
        </Box>
      )}

      {layout.hasPagination && (
        <Box flex justify="center" align="center" overrideClassName="w-full pt-2 shrink-0">
          <Pagination
            totalItems={totalStaffCount}
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

export default OurTeam;