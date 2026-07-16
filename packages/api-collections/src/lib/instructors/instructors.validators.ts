import { z } from 'zod';
import type { Instructor } from '@inithium/types';

const AddressSchema = z.object({
  address1: z.string().min(1),
  address2: z.string().optional(),
  city:     z.string().min(1),
  state:    z.string().min(1),
  zip:      z.string().min(1),
});

export const CreateInstructorSchema = z.object({
  jackrabbit_id:   z.coerce.number(),
  orgID:           z.string().min(1),
  firstName:       z.string().min(1),
  lastName:        z.string().min(1),
  nickname:        z.string().optional(),
  email:           z.string().email().optional(),
  status:          z.string().default('Active'),
  position1:       z.string().optional(),
  position2:       z.string().optional(),
  position3:       z.string().optional(),
  isInstructor:    z.coerce.boolean().default(false),
  birthDate:       z.string().optional(),
  startDate:       z.string().optional(),
  cellPhone:       z.string().optional(),
  homePhone:       z.string().optional(),
  workPhone:       z.string().optional(),
  classes:         z.string().optional(),
  address:         AddressSchema,
  user_id:         z.string().optional(),
  last_synced_at:  z.string().optional(),
}) satisfies z.ZodType<Omit<Instructor, '_id'>>;

export const UpdateInstructorSchema = CreateInstructorSchema.partial();

export type CreateInstructorDto = z.infer<typeof CreateInstructorSchema>;
export type UpdateInstructorDto = z.infer<typeof UpdateInstructorSchema>;