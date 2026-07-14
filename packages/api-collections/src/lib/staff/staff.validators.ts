import { z } from 'zod';
import type { StaffMember } from '@inithium/types';

type StaffInputPayload = Omit<StaffMember, '_id' | 'profile'> & { profile: string };

export const CreateStaffSchema = z.object({
  profile: z.string().regex(/^[0-9a-fA-F]{24}$/),
  title: z.string().min(1),
  order: z.number().int().default(0),
  staffImageUrl: z.string().url().or(z.string().min(1)),
}) satisfies z.ZodType<StaffInputPayload> as unknown as z.ZodType<Omit<StaffMember, '_id'>>;

export const UpdateStaffSchema = (CreateStaffSchema as any).partial() as z.ZodType<Partial<Omit<StaffMember, '_id'>>>;

export type CreateStaffDto = z.infer<typeof CreateStaffSchema>;
export type UpdateStaffDto = z.infer<typeof UpdateStaffSchema>;