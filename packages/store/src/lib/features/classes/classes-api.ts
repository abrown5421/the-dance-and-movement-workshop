import type { DanceClass } from '@inithium/types';
import type { PaginatedResult, PaginationQuery } from '@inithium/api-core';
import { createCrudEndpoints } from '../../base/crud-api-factory.js';
import { baseApi } from '../../base/base-api.js';

export type CreateClassDto = Omit<DanceClass, '_id'>;
export type UpdateClassDto = Partial<CreateClassDto>;

export interface ClassesQuery extends PaginationQuery {
  readonly q?: string;
  readonly status?: string;
  readonly category?: string;
  readonly startDate?: string;
  readonly endDate?: string;
}

export interface ClassFilterOptions {
  readonly categories: readonly string[];
  readonly statuses: readonly string[];
}

const endpoints = createCrudEndpoints<DanceClass, CreateClassDto, UpdateClassDto>('classes', 'Class');

export const classesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    ...endpoints(builder),

    readAllClasses: builder.query<PaginatedResult<DanceClass>, ClassesQuery | void>({
      query: (params) => ({ url: '/classes', params: params ?? {} }),
      providesTags: ['Class'],
    }),

    readClassFilterOptions: builder.query<ClassFilterOptions, void>({
      query: () => '/classes/filters',
      providesTags: ['Class'],
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
  useReadClassFilterOptionsQuery,
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
  useReadClassFilterOptionsQuery,
  useReadClassesByCategoryQuery,
  useReadOpenClassesQuery,
};