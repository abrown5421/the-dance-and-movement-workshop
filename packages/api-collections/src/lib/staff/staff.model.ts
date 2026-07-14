import { Schema, model } from 'mongoose';

const staffMemberSchema = new Schema(
  {
    profile: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    order: { type: Number, required: true, default: 0 },
    staffImageUrl: { type: String, required: true },
  },
  { timestamps: true }
);

export const StaffModel = model<any>('StaffMember', staffMemberSchema);