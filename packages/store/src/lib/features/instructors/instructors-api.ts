import type { Instructor } from '@inithium/types';
import type { PaginatedResult, PaginationQuery } from '@inithium/api-core';
import { createCrudEndpoints } from '../../base/crud-api-factory.js';
import { baseApi } from '../../base/base-api.js';

export type CreateInstructorDto = Omit<Instructor, '_id'>;
export type UpdateInstructorDto = Partial<CreateInstructorDto>;

export interface InstructorsQuery extends PaginationQuery {
  readonly q?: string;
  readonly status?: string;
  readonly orgID?: string;
  readonly position?: string;
}

export interface InstructorFilterOptions {
  readonly positions: readonly string[];
  readonly statuses: readonly string[];
}

const endpoints = createCrudEndpoints<Instructor, CreateInstructorDto, UpdateInstructorDto>('instructors', 'Instructor');

export const instructorsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    ...endpoints(builder),

    readAllInstructors: builder.query<PaginatedResult<Instructor>, InstructorsQuery | void>({
      query: (params) => ({ url: '/instructors', params: params ?? {} }),
      providesTags: ['Instructor'],
    }),

    readInstructorFilterOptions: builder.query<InstructorFilterOptions, void>({
      query: () => '/instructors/filters',
      providesTags: ['Instructor'],
    }),

    readInstructorsByPosition: builder.query<readonly Instructor[], string>({
      query: (position) => `/instructors/position/${position}`,
      providesTags: (result) =>
        result
          ? [...result.map(({ _id }) => ({ type: 'Instructor' as const, id: _id })), 'Instructor']
          : ['Instructor'],
    }),

    readActiveInstructors: builder.query<readonly Instructor[], void>({
      query: () => '/instructors/active',
      providesTags: (result) =>
        result
          ? [...result.map(({ _id }) => ({ type: 'Instructor' as const, id: _id })), 'Instructor']
          : ['Instructor'],
    }),
  }),
  overrideExisting: false,
});

const dynamicHooks = instructorsApi as any;

const {
  useCreateInstructorMutation,
  useReadOneInstructorQuery:        useInstructorQuery,
  useLazyReadOneInstructorQuery:    useLazyInstructorQuery,
  useReadManyInstructorQuery:       useInstructorsBatchQuery,
  useReadPageInstructorQuery:       useInstructorsPageQuery,
  useUpdateOneInstructorMutation:   useUpdateInstructorMutation,
  useDeleteOneInstructorMutation:   useDeleteInstructorMutation,
  useDeleteManyInstructorMutation:  useDeleteInstructorsBatchMutation,
} = dynamicHooks;

const {
  useReadAllInstructorsQuery,
  useReadInstructorFilterOptionsQuery,
  useReadInstructorsByPositionQuery,
  useReadActiveInstructorsQuery,
} = instructorsApi;

export {
  useCreateInstructorMutation,
  useInstructorQuery,
  useLazyInstructorQuery,
  useInstructorsBatchQuery,
  useInstructorsPageQuery,
  useUpdateInstructorMutation,
  useDeleteInstructorMutation,
  useDeleteInstructorsBatchMutation,
  useReadAllInstructorsQuery,
  useReadInstructorFilterOptionsQuery,
  useReadInstructorsByPositionQuery,
  useReadActiveInstructorsQuery,
};