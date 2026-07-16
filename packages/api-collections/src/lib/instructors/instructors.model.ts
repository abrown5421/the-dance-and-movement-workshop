import { Instructor } from '@inithium/types';
import { Schema, model } from 'mongoose';

const addressSchema = new Schema(
  {
    address1: { type: String, required: true, trim: true },
    address2: { type: String, trim: true },
    city:     { type: String, required: true, trim: true },
    state:    { type: String, required: true, trim: true },
    zip:      { type: String, required: true, trim: true },
  },
  { _id: false }
);

const instructorSchema = new Schema<Instructor>(
  {
    jackrabbit_id:   { type: Number, required: true, unique: true },
    orgID:           { type: String, required: true, trim: true, index: true },
    firstName:       { type: String, required: true, trim: true },
    lastName:        { type: String, required: true, trim: true },
    nickname:        { type: String, trim: true },
    email:           { type: String, trim: true },
    status:          { type: String, required: true, default: 'Active', trim: true, index: true },
    position1:       { type: String, trim: true, index: true },
    position2:       { type: String, trim: true },
    position3:       { type: String, trim: true },
    isInstructor:    { type: Boolean, required: true, default: false },
    birthDate:       { type: String },
    startDate:       { type: String },
    cellPhone:       { type: String, trim: true },
    homePhone:       { type: String, trim: true },
    workPhone:       { type: String, trim: true },
    classes:         { type: String, default: '' },
    address:         { type: addressSchema, required: true },
    user_id:         { type: Schema.Types.ObjectId, ref: 'User', index: true },
    last_synced_at:  { type: String },
  },
  { timestamps: true }
);

export const InstructorModel = model<Instructor>('Instructor', instructorSchema);