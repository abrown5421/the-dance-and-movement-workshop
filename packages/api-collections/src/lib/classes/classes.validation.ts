import { z } from 'zod';
import type { DanceClass } from '@inithium/types';

export const CreateClassSchema = z.object({
  jackrabbit_id:   z.coerce.number(),
  name:            z.string().min(1),
  description:     z.string(),
  status:          z.string().default('Active'),
  location:        z.string().min(1),
  category1:       z.string().min(1),
  category2:       z.string().optional(),
  category3:       z.string().optional(),
  session:         z.string().optional(),
  reg_start_date:  z.string(),
  start_date:      z.string(),
  end_date:        z.string(),
  days:            z.string(),
  start_time:      z.string(),
  end_time:        z.string(),
  instructors:     z.string().default(''),
  instructor_ids:  z.array(z.coerce.number()).default([]),
  open_spots:      z.coerce.number().default(0),
  waitlist_count:  z.coerce.number().default(0),
  future_drops:    z.coerce.number().default(0),
  future_enrolls:  z.coerce.number().default(0),
  resources:       z.coerce.number().default(0),
  class_size:      z.coerce.number().default(0),
  policy_groups:   z.string().optional(),
  notes:           z.string().optional(),
  lesson_plans:    z.coerce.number().default(0),
  last_synced_at:  z.string().optional(),
  min_age:      z.string().optional(),
  max_age:      z.string().optional(),
  room:         z.string().optional(),
  gender:       z.string().optional(),
  master_class: z.boolean().optional(),
  tuition_fee:  z.coerce.number().optional(),
}) satisfies z.ZodType<Omit<DanceClass, '_id'>>;

export const UpdateClassSchema = CreateClassSchema.partial();

export type CreateClassDto = z.infer<typeof CreateClassSchema>;
export type UpdateClassDto = z.infer<typeof UpdateClassSchema>;