import type { DanceClass, JackrabbitClassRow, JackrabbitOpeningsResponse } from '@inithium/types';
import { createCrudService, CrudService } from '@inithium/api-core';
import { ClassModel } from './classes.model.js';

const JACKRABBIT_ORG_ID = process.env['JACKRABBIT_ORG_ID'] ?? '558395';
const JACKRABBIT_OPENINGS_URL = `https://app.jackrabbitclass.com/jr3.0/Openings/OpeningsJson?orgid=${JACKRABBIT_ORG_ID}`;

export interface ClassSyncResult {
  readonly fetched: number;
  readonly upserted: number;
}

export interface ClassesService extends CrudService<DanceClass> {
  readonly syncFromJackrabbit: () => Promise<ClassSyncResult>;
  readonly findByCategory: (category: string) => Promise<readonly DanceClass[]>;
  readonly findWithOpenings: () => Promise<readonly DanceClass[]>;
}

const base = createCrudService<DanceClass>(ClassModel);

const mapRowToClass = (row: JackrabbitClassRow): Partial<DanceClass> => ({
  jackrabbit_id: row.id,
  category1: row.category1,
  category2: row.category2 || undefined,
  category3: row.category3 || undefined,
  description: row.description,
  end_date: row.end_date,
  end_time: row.end_time,
  gender: row.gender,
  instructors: row.instructors,
  location: row.location,
  location_code: row.location_code,
  location_name: row.location_name,
  master_class: row.master_class,
  max_age: row.max_age,
  meeting_days: row.meeting_days,
  min_age: row.min_age,
  name: row.name,
  online_reg_link: row.online_reg_link,
  openings: row.openings,
  reg_start_date: row.reg_start_date,
  room: row.room || undefined,
  session: row.session || undefined,
  start_date: row.start_date,
  start_time: row.start_time,
  waitlist: row.waitlist,
  location_addr1: row.location_addr1 || undefined,
  location_addr2: row.location_addr2 || undefined,
  location_city: row.location_city || undefined,
  location_state: row.location_state || undefined,
  location_postalcode: row.location_postalcode || undefined,
  location_phone: row.location_phone || undefined,
  billing_cycle: row.BillingCycle,
  tuition: row.tuition,
  last_synced_at: new Date().toISOString(),
});

export const syncFromJackrabbit = async (): Promise<ClassSyncResult> => {
  const response = await fetch(JACKRABBIT_OPENINGS_URL);

  if (!response.ok) {
    throw new Error(`Jackrabbit openings request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as JackrabbitOpeningsResponse;

  if (!payload.success) {
    throw new Error(`Jackrabbit openings request unsuccessful: ${payload.message}`);
  }

  const operations = payload.rows.map((row) => ({
    updateOne: {
      filter: { jackrabbit_id: row.id },
      update: { $set: mapRowToClass(row) },
      upsert: true,
    },
  }));

  if (operations.length === 0) {
    return { fetched: 0, upserted: 0 };
  }

  const result = await ClassModel.bulkWrite(operations);

  return {
    fetched: payload.rows.length,
    upserted: (result.upsertedCount ?? 0) + (result.modifiedCount ?? 0),
  };
};

export const findByCategory = async (category: string): Promise<readonly DanceClass[]> =>
  ClassModel.find({
    $or: [{ category1: category }, { category2: category }, { category3: category }],
  })
    .lean<DanceClass[]>()
    .exec();

export const findWithOpenings = async (): Promise<readonly DanceClass[]> =>
  ClassModel.find({ 'openings.calculated_openings': { $gt: 0 } })
    .lean<DanceClass[]>()
    .exec();

export interface ClassesService extends CrudService<DanceClass> {
  readonly syncFromJackrabbit: () => Promise<ClassSyncResult>;
  readonly findByCategory: (category: string) => Promise<readonly DanceClass[]>;
  readonly findWithOpenings: () => Promise<readonly DanceClass[]>;
  readonly findFilterOptions: () => Promise<{ readonly categories: readonly string[]; readonly genders: readonly string[] }>;
}

export const findFilterOptions = async (): Promise<{
  categories: readonly string[];
  genders: readonly string[];
}> => {
  const [category1s, category2s, category3s, genders] = await Promise.all([
    ClassModel.distinct('category1'),
    ClassModel.distinct('category2'),
    ClassModel.distinct('category3'),
    ClassModel.distinct('gender'),
  ]);

  const categories = Array.from(
    new Set([...category1s, ...category2s, ...category3s].filter(Boolean))
  ).sort() as string[];

  return {
    categories,
    genders: (genders as string[]).filter(Boolean).sort(),
  };
};

export const classesService: ClassesService = {
  ...base,
  syncFromJackrabbit,
  findByCategory,
  findWithOpenings,
  findFilterOptions,
};