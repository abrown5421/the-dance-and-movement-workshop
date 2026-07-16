import { DanceClass } from '@inithium/types';
import { Schema, model } from 'mongoose';

const classSchema = new Schema<DanceClass>(
  {
    jackrabbit_id:   { type: Number, required: true, unique: true },
    name:            { type: String, required: true, trim: true },
    description:     { type: String, required: true },
    status:          { type: String, required: true, default: 'Active', trim: true, index: true },
    location:        { type: String, required: true, trim: true },
    category1:       { type: String, required: true, trim: true, index: true },
    category2:       { type: String, trim: true },
    category3:       { type: String, trim: true },
    session:         { type: String, trim: true },
    reg_start_date:  { type: String, required: true },
    start_date:      { type: String, required: true },
    end_date:        { type: String, required: true },
    days:            { type: String, required: true },
    start_time:      { type: String, required: true },
    end_time:        { type: String, required: true },
    instructors:     { type: String, required: true, default: '' },
    instructor_ids:  { type: [Number], default: [], index: true },
    open_spots:      { type: Number, required: true, default: 0 },
    waitlist_count:  { type: Number, required: true, default: 0 },
    future_drops:    { type: Number, required: true, default: 0 },
    future_enrolls:  { type: Number, required: true, default: 0 },
    resources:       { type: Number, required: true, default: 0 },
    class_size:      { type: Number, required: true, default: 0 },
    policy_groups:   { type: String, trim: true },
    notes:           { type: String, trim: true },
    lesson_plans:    { type: Number, required: true, default: 0 },
    last_synced_at:  { type: String },
    archived_at:     { type: String },
    min_age:      { type: String, trim: true },
    max_age:      { type: String, trim: true },
    room:         { type: String, trim: true },
    gender:       { type: String, trim: true },
    master_class: { type: Boolean },
    tuition_fee:  { type: Number },
  },
  { timestamps: true }
);

export const ClassModel = model<DanceClass>('Class', classSchema);