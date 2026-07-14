import { createCrudService, CrudService } from '@inithium/api-core';
import type { StaffMember } from '@inithium/types';
import { StaffModel } from './staff.model.js';

export interface StaffService extends CrudService<StaffMember> {}

const base = createCrudService<StaffMember>(StaffModel);

export const staffService: StaffService = {
  ...base,

  createOne: async (data) => {
    const rawInput = data as Partial<StaffMember>;
    const normalizedPayload: Partial<StaffMember> = {
      ...rawInput,
      order: rawInput.order ?? 0,
    };
    const created = await base.createOne(normalizedPayload);
    return StaffModel.findById(created._id).populate('profile').lean<StaffMember>().exec() as Promise<StaffMember>;
  },

  readOne: async (id) => 
    StaffModel.findById(id).populate('profile').lean<StaffMember>().exec(),

  readAll: async () => 
    StaffModel.find().populate('profile').lean<StaffMember[]>().exec(),

  readPage: async (query) => {
    const result = await base.readPage(query);
    const populatedData = await StaffModel.find({ _id: { $in: result.data.map(d => d._id) } })
      .sort({ [query.sort ?? '_id']: query.order === 'desc' ? -1 : 1 })
      .populate('profile')
      .lean<StaffMember[]>()
      .exec();

    return {
      data: populatedData,
      meta: result.meta,
    };
  },

  readMany: async (ids) => 
    StaffModel.find({ _id: { $in: ids } }).populate('profile').lean<StaffMember[]>().exec(),

  updateOne: async (id, data) => {
    await base.updateOne(id, data);
    return StaffModel.findById(id).populate('profile').lean<StaffMember>().exec();
  }
};