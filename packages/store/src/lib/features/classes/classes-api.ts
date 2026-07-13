import type { DanceClass } from '@inithium/types';
import type { PaginatedResult, PaginationQuery } from '@inithium/api-core';
import { createCrudEndpoints } from '../../base/crud-api-factory.js';
import { baseApi } from '../../base/base-api.js';
import type { ClassSyncResult } from '@inithium/api-collections';

export type CreateClassDto = Omit<DanceClass, '_id'>;
export type UpdateClassDto = Partial<CreateClassDto>;

const endpoints = createCrudEndpoints<DanceClass, CreateClassDto, UpdateClassDto>('classes', 'Class');

export const classesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    ...endpoints(builder),

    readAllClasses: builder.query<PaginatedResult<DanceClass>, PaginationQuery | void>({
      query: (params) => ({ url: '/classes', params: params ?? {} }),
      providesTags: ['Class'],
    }),

    syncClasses: builder.mutation<ClassSyncResult, void>({
      query: () => ({
        url: '/classes/sync',
        method: 'POST',
      }),
      invalidatesTags: ['Class'],
    }),

    readClassesByCategory: builder.query<readonly DanceClass[], string>({
      query: (category) => `/classes/category/${category}`,
      providesTags: (result) =>
        result
          ? [...result.map(({ _id }) => ({ type: 'Class' as const, id: _id })), 'Class']
          : ['Class'],
    }),

    readOpenClasses: builder.query<readonly DanceClass[], void>({
      query: () => '/classes/open',
      providesTags: (result) =>
        result
          ? [...result.map(({ _id }) => ({ type: 'Class' as const, id: _id })), 'Class']
          : ['Class'],
    }),
  }),
  overrideExisting: false,
});

const dynamicHooks = classesApi as any;

const {
  useCreateClassMutation,
  useReadOneClassQuery:        useClassQuery,
  useLazyReadOneClassQuery:    useLazyClassQuery,
  useReadManyClassQuery:       useClassesBatchQuery,
  useReadPageClassQuery:       useClassesPageQuery,
  useUpdateOneClassMutation:   useUpdateClassMutation,
  useDeleteOneClassMutation:   useDeleteClassMutation,
  useDeleteManyClassMutation:  useDeleteClassesBatchMutation,
} = dynamicHooks;

const {
  useReadAllClassesQuery,
  useSyncClassesMutation,
  useReadClassesByCategoryQuery,
  useReadOpenClassesQuery,
} = classesApi;

export {
  useCreateClassMutation,
  useClassQuery,
  useLazyClassQuery,
  useClassesBatchQuery,
  useClassesPageQuery,
  useUpdateClassMutation,
  useDeleteClassMutation,
  useDeleteClassesBatchMutation,
  useReadAllClassesQuery,
  useSyncClassesMutation,
  useReadClassesByCategoryQuery,
  useReadOpenClassesQuery,
};