import React, { useEffect, useState } from 'react';
import { Box, Loader, Text, Pagination } from '@inithium/ui';
import { ClassCard } from './class-card';
import { useReadAllClassesQuery, useSyncClassesMutation } from '@inithium/store';

const ITEMS_PER_PAGE = 12;

const ClassesPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [syncClasses, { isLoading: isSyncing, isError: isSyncError }] = useSyncClassesMutation();

  useEffect(() => {
    syncClasses();
  }, [syncClasses]);

  const { data, isLoading, isFetching, isError } = useReadAllClassesQuery({
    page,
    limit: ITEMS_PER_PAGE,
  });

  const isInitialLoading = isSyncing || isLoading;

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
      <Box flex direction="row" justify="between" align="center">
        <Text variant="h5" color="surface2-contrast" overrideClassName='primary-font'>Classes</Text>
      </Box>

      {isSyncError && (
        <Text variant="caption" color="danger">
          Could not sync with Jackrabbit — showing last known class list.
        </Text>
      )}

      <Box
        overrideClassName="flex flex-row flex-wrap gap-4 w-full items-stretch justify-start"
        style={{ opacity: isFetching ? 0.6 : 1 }}
      >
        {data.data.map((danceClass) => (
          <ClassCard key={danceClass._id} danceClass={danceClass} />
        ))}
      </Box>

      <Pagination
        totalItems={data.meta.total}
        itemsPerPage={data.meta.limit}
        currentPage={data.meta.page}
        onPageChange={setPage}
      />
    </Box>
  );
};

export default ClassesPage;