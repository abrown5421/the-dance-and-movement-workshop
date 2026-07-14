import type { StaffMember } from '@inithium/types';
import type { PaginatedResult, PaginationQuery } from '@inithium/api-core';
import { createCrudEndpoints } from '../../base/crud-api-factory.js';
import { baseApi } from '../../base/base-api.js';

export type StaffRole = 'super-admin' | 'admin' | 'editor' | 'writer';

export interface NewStaffUserDto {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export type CreateStaffDto =
  | {
      mode: 'existing';
      profile: string;
      title: string;
      order: number;
      staffImageUrl: string;
      role: StaffRole;
    }
  | {
      mode: 'new';
      title: string;
      order: number;
      staffImageUrl: string;
      role: StaffRole;
      newUser: NewStaffUserDto;
    };

export interface UpdateStaffDto {
  title?: string;
  order?: number;
  staffImageUrl?: string;
  role?: StaffRole;
  profile?: {
    first_name?: string;
    last_name?: string;
    email?: string;
  };
}

const endpoints = createCrudEndpoints<StaffMember, CreateStaffDto, UpdateStaffDto>('staff', 'Staff');

export const staffApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    ...endpoints(builder),
    readAllStaff: builder.query<PaginatedResult<StaffMember>, PaginationQuery | void>({
      query: (params) => ({ url: '/staff', params: params ?? {} }),
      providesTags: ['Staff'],
    }),
    createStaff: builder.mutation<StaffMember, CreateStaffDto>({
      query: (body) => ({
        url: '/staff',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Staff', 'User'],
    }),
    updateOneStaff: builder.mutation<StaffMember, { id: string; data: UpdateStaffDto }>({
      query: ({ id, data }) => ({
        url: `/staff/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_res: any, _err: any, { id }: any) => [{ type: 'Staff', id } as any, 'Staff' as any, 'User' as any],
    }),
    deleteOneStaff: builder.mutation<StaffMember, string>({
      query: (id) => ({
        url: `/staff/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_res: any, _err: any, id: string) => [{ type: 'Staff', id } as any, 'Staff' as any, 'User' as any],
    }),
  }),
  overrideExisting: false,
});

const dynamicHooks = staffApi as any;

const {
  useReadOneStaffQuery: useStaffQuery,
  useLazyReadOneStaffQuery: useLazyStaffQuery,
  useReadManyStaffQuery: useStaffBatchQuery,
  useReadPageStaffQuery: useStaffPageQuery,
  useDeleteManyStaffMutation: useDeleteStaffBatchMutation,
} = dynamicHooks;

const {
  useReadAllStaffQuery,
  useCreateStaffMutation,
  useUpdateOneStaffMutation: useUpdateStaffMutation,
  useDeleteOneStaffMutation: useDeleteStaffMutation,
} = staffApi;

export {
  useCreateStaffMutation,
  useStaffQuery,
  useLazyStaffQuery,
  useStaffBatchQuery,
  useStaffPageQuery,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
  useDeleteStaffBatchMutation,
  useReadAllStaffQuery,
};