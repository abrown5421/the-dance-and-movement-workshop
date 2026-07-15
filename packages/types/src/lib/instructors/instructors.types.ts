export interface InstructorAddress {
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
}

export interface Instructor {
  _id: string;
  jackrabbit_id: number;
  orgID: string;
  firstName: string;
  lastName: string;
  nickname?: string;
  email?: string;
  status: string;
  position1?: string;
  position2?: string;
  position3?: string;
  isInstructor: boolean;
  birthDate?: string;
  startDate?: string;
  cellPhone?: string;
  homePhone?: string;
  workPhone?: string;
  classes?: string;
  address: InstructorAddress;
  last_synced_at?: string;
}