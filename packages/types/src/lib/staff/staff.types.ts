import { User } from "../user/user.types.js";

export interface StaffMember {
    _id: string;
    profile: User;
    title: string;
    order: number;
    staffImageUrl: string;
}