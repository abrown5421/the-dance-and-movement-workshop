import type { DanceClass } from '@inithium/types';
import { createCrudService, CrudService } from '@inithium/api-core';
import type { CreateClassDto, UpdateClassDto } from './classes.validation.js';
import { ClassModel } from './classes.model.js';
import { syncFromJackrabbitOpenings, type JackrabbitSyncResult } from './classes.jackrabbit-sync.js';

export interface ClassesService extends CrudService<DanceClass> {
  readonly findByCategory: (category: string) => Promise<readonly DanceClass[]>;
  readonly findWithOpenSpots: () => Promise<readonly DanceClass[]>;
  readonly findFilterOptions: () => Promise<{
    readonly categories: readonly string[];
    readonly statuses: readonly string[];
  }>;
  readonly upsertByJackrabbitId: (data: CreateClassDto) => Promise<DanceClass>;
  readonly updateByJackrabbitId: (id: number, data: UpdateClassDto) => Promise<DanceClass | null>;
  readonly syncFromJackrabbitOpenings: (options?: { force?: boolean }) => Promise<JackrabbitSyncResult>;
}

const base = createCrudService<DanceClass>(ClassModel);

export const findByCategory = async (category: string): Promise<readonly DanceClass[]> =>
  ClassModel.find({
    $or: [{ category1: category }, { category2: category }, { category3: category }],
  })
    .lean<DanceClass[]>()
    .exec();

export const findWithOpenSpots = async (): Promise<readonly DanceClass[]> =>
  ClassModel.find({ open_spots: { $gt: 0 } })
    .lean<DanceClass[]>()
    .exec();

export const findFilterOptions = async (): Promise<{
  categories: readonly string[];
  statuses: readonly string[];
}> => {
  const [category1s, category2s, category3s, statuses] = await Promise.all([
    ClassModel.distinct('category1'),
    ClassModel.distinct('category2'),
    ClassModel.distinct('category3'),
    ClassModel.distinct('status'),
  ]);

  const categories = Array.from(
    new Set([...category1s, ...category2s, ...category3s].filter(Boolean))
  ).sort() as string[];

  return {
    categories,
    statuses: (statuses as string[]).filter(Boolean).sort(),
  };
};

export const upsertByJackrabbitId = async (data: CreateClassDto): Promise<DanceClass> =>
  ClassModel.findOneAndUpdate(
    { jackrabbit_id: data.jackrabbit_id },
    { $set: { ...data, last_synced_at: new Date().toISOString() } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  )
    .lean<DanceClass>()
    .exec() as Promise<DanceClass>;

export const updateByJackrabbitId = async (id: number, data: UpdateClassDto): Promise<DanceClass | null> =>
  ClassModel.findOneAndUpdate(
    { jackrabbit_id: id },
    { $set: { ...data, last_synced_at: new Date().toISOString() } },
    { new: true }
  )
    .lean<DanceClass>()
    .exec();

export const classesService: ClassesService = {
  ...base,
  findByCategory,
  findWithOpenSpots,
  findFilterOptions,
  upsertByJackrabbitId,
  updateByJackrabbitId,
  syncFromJackrabbitOpenings //Object literal may only specify known properties, and 'syncFromJackrabbitOpenings' does not exist in type 'ClassesService'.ts(2353)
};