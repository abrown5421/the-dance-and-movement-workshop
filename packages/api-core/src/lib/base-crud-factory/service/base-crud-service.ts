import { Model, Types, AnyObject } from 'mongoose';
import { PaginatedResult, PaginationQuery } from '../../types/pagination.js';

export interface CrudService<T> {
  readonly createOne: (data: AnyObject | Partial<T>) => Promise<T>;
  readonly readOne: (id: string) => Promise<T | null>;
  readonly readAll: () => Promise<readonly T[]>;
  readonly readPage: (query: PaginationQuery) => Promise<PaginatedResult<T>>;
  readonly readMany: (ids: readonly string[]) => Promise<readonly T[]>;
  readonly updateOne: (id: string, data: Partial<T>) => Promise<T | null>;
  readonly deleteOne: (id: string) => Promise<T | null>;
  readonly deleteMany: (ids: readonly string[]) => Promise<{ readonly deletedCount: number }>;
}

const escapeRegex = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildFilter = (query: PaginationQuery): Record<string, unknown> => {
  const conditions: Record<string, unknown>[] = [];

  if (query.search && query.searchFields?.length) {
    const regex = new RegExp(escapeRegex(query.search), 'i');
    conditions.push({ $or: query.searchFields.map((field) => ({ [field]: regex })) });
  }

  if (query.filters) {
    for (const [key, value] of Object.entries(query.filters)) {
      if (value) conditions.push({ [key]: value });
    }
  }

  if (query.filterAnyOf?.value && query.filterAnyOf.fields.length) {
    conditions.push({
      $or: query.filterAnyOf.fields.map((field) => ({ [field]: query.filterAnyOf!.value })),
    });
  }

  if (query.dateRange) {
    const { startField, endField, start, end } = query.dateRange;
    if (end) conditions.push({ [startField]: { $lte: end } });
    if (start) conditions.push({ [endField]: { $gte: start } });
  }

  return conditions.length > 0 ? { $and: conditions } : {};
};

export const createCrudService = <T>(model: Model<any>): CrudService<T> => {
  const toObjectId = (id: string): Types.ObjectId => new Types.ObjectId(id);

  const clampLimit = (limit?: number): number => Math.min(Math.max(limit ?? 25, 1), 100);
  const clampPage = (page?: number): number => Math.max(page ?? 1, 1);

  return {
    createOne: async (data) => {
      const ArrayResult = await model.create([data]);
      return ArrayResult[0].toObject() as T;
    },

    readOne: async (id) =>
      model.findById(toObjectId(id)).lean<T>().exec(),

    readAll: async () =>
      model.find().lean<T[]>().exec(),

    readPage: async (query) => {
      const page = clampPage(query.page);
      const limit = clampLimit(query.limit);
      const skip = (page - 1) * limit;
      const sortField = query.sort ?? '_id';
      const sortDirection = query.order === 'desc' ? -1 : 1;
      const filter = buildFilter(query);

      const [data, total] = await Promise.all([
        model.find(filter).sort({ [sortField]: sortDirection }).skip(skip).limit(limit).lean<T[]>().exec(),
        model.countDocuments(filter).exec(),
      ]);

      return {
        data,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    },

    readMany: async (ids) =>
      model.find({ _id: { $in: ids.map(toObjectId) } }).lean<T[]>().exec(),

    updateOne: async (id, data) =>
      model.findByIdAndUpdate(
        toObjectId(id),
        { $set: data as any },
        { new: true }
      ).lean<T>().exec(),

    deleteOne: async (id) =>
      model.findByIdAndDelete(toObjectId(id)).lean<T>().exec(),

    deleteMany: async (ids) => {
      const result = await model.deleteMany({ _id: { $in: ids.map(toObjectId) } }).exec();
      return { deletedCount: result.deletedCount ?? 0 };
    }
  };
};