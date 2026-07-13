import { DanceClass } from '@inithium/types';
import { Schema, model } from 'mongoose';

const meetingDaysSchema = new Schema(
  {
    mon: { type: Boolean, required: true, default: false },
    tue: { type: Boolean, required: true, default: false },
    wed: { type: Boolean, required: true, default: false },
    thu: { type: Boolean, required: true, default: false },
    fri: { type: Boolean, required: true, default: false },
    sat: { type: Boolean, required: true, default: false },
    sun: { type: Boolean, required: true, default: false },
  },
  { _id: false }
);

const openingsDaysSchema = new Schema(
  {
    mon: { type: Number, required: true, default: 0 },
    tue: { type: Number, required: true, default: 0 },
    wed: { type: Number, required: true, default: 0 },
    thu: { type: Number, required: true, default: 0 },
    fri: { type: Number, required: true, default: 0 },
    sat: { type: Number, required: true, default: 0 },
    sun: { type: Number, required: true, default: 0 },
  },
  { _id: false }
);

const openingsSchema = new Schema(
  {
    calculated_openings: { type: Number, required: true, default: 0 },
    days: { type: openingsDaysSchema, required: true, default: () => ({}) },
  },
  { _id: false }
);

const tuitionDaysSchema = new Schema(
  {
    day_2: { type: Number, required: true, default: 0 },
    day_3: { type: Number, required: true, default: 0 },
    day_4: { type: Number, required: true, default: 0 },
    day_5: { type: Number, required: true, default: 0 },
    day_6: { type: Number, required: true, default: 0 },
    day_7: { type: Number, required: true, default: 0 },
  },
  { _id: false }
);

const tuitionSchema = new Schema(
  {
    fee: { type: Number, required: true, default: 0 },
    days: { type: tuitionDaysSchema, required: true, default: () => ({}) },
  },
  { _id: false }
);

const classSchema = new Schema<DanceClass>(
  {
    jackrabbit_id:       { type: Number, required: true, unique: true },
    category1:           { type: String, required: true, trim: true },
    category2:           { type: String, trim: true },
    category3:           { type: String, trim: true },
    description:         { type: String, required: true },
    end_date:            { type: String, required: true },
    end_time:            { type: String, required: true },
    gender:              { type: String, required: true, default: 'All' },
    instructors:         { type: [String], required: true, default: [] },
    location:            { type: String, required: true, trim: true },
    location_code:       { type: String, required: true, trim: true },
    location_name:       { type: String, required: true, trim: true },
    master_class:        { type: Boolean, required: true, default: false },
    max_age:             { type: String, default: '' },
    meeting_days:        { type: meetingDaysSchema, required: true, default: () => ({}) },
    min_age:             { type: String, default: '' },
    name:                { type: String, required: true, trim: true },
    online_reg_link:     { type: String, required: true },
    openings:            { type: openingsSchema, required: true, default: () => ({}) },
    reg_start_date:      { type: String, required: true },
    room:                { type: String, trim: true },
    session:             { type: String, trim: true },
    start_date:          { type: String, required: true },
    start_time:          { type: String, required: true },
    waitlist:            { type: Boolean, required: true, default: false },
    location_addr1:      { type: String, trim: true },
    location_addr2:      { type: String, trim: true },
    location_city:       { type: String, trim: true },
    location_state:      { type: String, trim: true },
    location_postalcode: { type: String, trim: true },
    location_phone:      { type: String, trim: true },
    billing_cycle:       { type: String, required: true, default: 'Monthly' },
    tuition:             { type: tuitionSchema, required: true, default: () => ({}) },
    last_synced_at:      { type: String },
  },
  { timestamps: true }
);

export const ClassModel = model<DanceClass>('Class', classSchema);