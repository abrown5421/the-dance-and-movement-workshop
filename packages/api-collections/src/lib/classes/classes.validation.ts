import { z } from 'zod';
import type { DanceClass } from '@inithium/types';

const MeetingDaysSchema = z.object({
  mon: z.boolean(),
  tue: z.boolean(),
  wed: z.boolean(),
  thu: z.boolean(),
  fri: z.boolean(),
  sat: z.boolean(),
  sun: z.boolean(),
});

const OpeningsDaysSchema = z.object({
  mon: z.number(),
  tue: z.number(),
  wed: z.number(),
  thu: z.number(),
  fri: z.number(),
  sat: z.number(),
  sun: z.number(),
});

const OpeningsSchema = z.object({
  calculated_openings: z.number(),
  days: OpeningsDaysSchema,
});

const TuitionDaysSchema = z.object({
  day_2: z.number(),
  day_3: z.number(),
  day_4: z.number(),
  day_5: z.number(),
  day_6: z.number(),
  day_7: z.number(),
});

const TuitionSchema = z.object({
  fee: z.number(),
  days: TuitionDaysSchema,
});

export const CreateClassSchema = z.object({
  jackrabbit_id:       z.number(),
  category1:           z.string().min(1),
  category2:           z.string().optional(),
  category3:           z.string().optional(),
  description:         z.string(),
  end_date:            z.string(),
  end_time:            z.string(),
  gender:              z.string().default('All'),
  instructors:         z.array(z.string()).default([]),
  location:            z.string().min(1),
  location_code:       z.string().min(1),
  location_name:       z.string().min(1),
  master_class:        z.boolean().default(false),
  max_age:             z.string().default(''),
  meeting_days:        MeetingDaysSchema,
  min_age:             z.string().default(''),
  name:                z.string().min(1),
  online_reg_link:     z.string(),
  openings:            OpeningsSchema,
  reg_start_date:      z.string(),
  room:                z.string().optional(),
  session:             z.string().optional(),
  start_date:          z.string(),
  start_time:          z.string(),
  waitlist:            z.boolean().default(false),
  location_addr1:      z.string().optional(),
  location_addr2:      z.string().optional(),
  location_city:       z.string().optional(),
  location_state:      z.string().optional(),
  location_postalcode: z.string().optional(),
  location_phone:      z.string().optional(),
  billing_cycle:       z.string().default('Monthly'),
  tuition:             TuitionSchema,
  last_synced_at:      z.string().optional(),
}) satisfies z.ZodType<Omit<DanceClass, '_id'>>;

export const UpdateClassSchema = CreateClassSchema.partial();

export type CreateClassDto = z.infer<typeof CreateClassSchema>;
export type UpdateClassDto = z.infer<typeof UpdateClassSchema>;