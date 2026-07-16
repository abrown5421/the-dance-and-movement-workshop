export interface MeetingDays {
  mon: boolean;
  tue: boolean;
  wed: boolean;
  thu: boolean;
  fri: boolean;
  sat: boolean;
  sun: boolean;
}

export interface OpeningsDays {
  mon: number;
  tue: number;
  wed: number;
  thu: number;
  fri: number;
  sat: number;
  sun: number;
}

export interface Openings {
  calculated_openings: number;
  days: OpeningsDays;
}

export interface TuitionDays {
  day_2: number;
  day_3: number;
  day_4: number;
  day_5: number;
  day_6: number;
  day_7: number;
}

export interface Tuition {
  fee: number;
  days: TuitionDays;
}

export interface JackrabbitClassRow {
  id: number;
  category1: string;
  category2: string;
  category3: string;
  description: string;
  end_date: string;
  end_time: string;
  gender: string;
  instructors: string[];
  location: string;
  location_code: string;
  location_name: string;
  master_class: boolean;
  max_age: string;
  meeting_days: MeetingDays;
  min_age: string;
  name: string;
  online_reg_link: string;
  openings: Openings;
  reg_start_date: string;
  room: string;
  session: string;
  start_date: string;
  start_time: string;
  waitlist: boolean;
  location_addr1: string;
  location_addr2: string;
  location_city: string;
  location_state: string;
  location_postalcode: string;
  location_phone: string;
  BillingCycle: string;
  tuition: Tuition;
}

export interface JackrabbitOpeningsResponse {
  rows: JackrabbitClassRow[];
  success: boolean;
  message: string;
}

export interface DanceClass {
  _id: string;
  jackrabbit_id: number;
  name: string;
  description: string;
  status: string;
  location: string;
  category1: string;
  category2?: string;
  category3?: string;
  session?: string;
  reg_start_date: string;
  start_date: string;
  end_date: string;
  days: string;
  start_time: string;
  end_time: string;
  instructors: string;
  instructor_ids: number[];
  open_spots: number;
  waitlist_count: number;
  future_drops: number;
  future_enrolls: number;
  resources: number;
  class_size: number;
  policy_groups?: string;
  notes?: string;
  lesson_plans: number;
  last_synced_at?: string;
  min_age?: string;
  max_age?: string;
  room?: string;
  gender?: string;
  master_class?: boolean;
  tuition_fee?: number;
}