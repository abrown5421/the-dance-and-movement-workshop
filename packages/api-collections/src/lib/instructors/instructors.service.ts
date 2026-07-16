import type { Instructor } from '@inithium/types';
import { createCrudService, CrudService } from '@inithium/api-core';
import type { CreateInstructorDto } from './instructors.validators.js';
import { InstructorModel } from './instructors.model.js';

export interface InstructorsService extends CrudService<Instructor> {
  readonly findByPosition: (position: string) => Promise<readonly Instructor[]>;
  readonly findActiveInstructors: () => Promise<readonly Instructor[]>;
  readonly findFilterOptions: () => Promise<{
    readonly positions: readonly string[];
    readonly statuses: readonly string[];
  }>;
  readonly upsertByJackrabbitId: (data: CreateInstructorDto) => Promise<Instructor>;
}

type UserLookupFn = (email: string) => Promise<{ _id: string } | null>;

let userLookupFn: UserLookupFn | null = null;

export const setUserLookupFn = (fn: UserLookupFn): void => {
  userLookupFn = fn;
};

const base = createCrudService<Instructor>(InstructorModel);

export const findByPosition = async (position: string): Promise<readonly Instructor[]> =>
  InstructorModel.find({
    $or: [{ position1: position }, { position2: position }, { position3: position }],
  })
    .lean<Instructor[]>()
    .exec();

export const findActiveInstructors = async (): Promise<readonly Instructor[]> =>
  InstructorModel.find({ isInstructor: true, status: 'Active' })
    .lean<Instructor[]>()
    .exec();

export const findFilterOptions = async (): Promise<{
  positions: readonly string[];
  statuses: readonly string[];
}> => {
  const [position1s, position2s, position3s, statuses] = await Promise.all([
    InstructorModel.distinct('position1'),
    InstructorModel.distinct('position2'),
    InstructorModel.distinct('position3'),
    InstructorModel.distinct('status'),
  ]);

  const positions = Array.from(
    new Set([...position1s, ...position2s, ...position3s].filter(Boolean))
  ).sort() as string[];

  return {
    positions,
    statuses: (statuses as string[]).filter(Boolean).sort(),
  };
};

export const upsertByJackrabbitId = async (data: CreateInstructorDto): Promise<Instructor> => {
  const existing = await InstructorModel.findOne({ jackrabbit_id: data.jackrabbit_id })
    .lean<Instructor | null>()
    .exec();

  let user_id = existing?.user_id;

  if (!user_id && data.email && userLookupFn) {
    const matchedUser = await userLookupFn(data.email.trim().toLowerCase());
    if (matchedUser) {
      user_id = matchedUser._id;
    }
  }

  return InstructorModel.findOneAndUpdate(
    { jackrabbit_id: data.jackrabbit_id },
    {
      $set: {
        ...data,
        ...(user_id ? { user_id } : {}),
        last_synced_at: new Date().toISOString(),
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  )
    .lean<Instructor>()
    .exec() as Promise<Instructor>;
};

export const instructorsService: InstructorsService = {
  ...base,
  findByPosition,
  findActiveInstructors,
  findFilterOptions,
  upsertByJackrabbitId,
};