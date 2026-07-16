import type { JackrabbitClassRow, MeetingDays } from '@inithium/types';

const DAY_ORDER: ReadonlyArray<{ key: keyof MeetingDays; label: string }> = [
  { key: 'mon', label: 'Mon' }, { key: 'tue', label: 'Tue' }, { key: 'wed', label: 'Wed' },
  { key: 'thu', label: 'Thu' }, { key: 'fri', label: 'Fri' }, { key: 'sat', label: 'Sat' },
  { key: 'sun', label: 'Sun' },
];

const formatDays = (days: MeetingDays): string =>
  DAY_ORDER.filter(({ key }) => days[key]).map(({ label }) => label).join(', ');

const formatInstructors = (names: string[]): string => names.join(', ');

export const mapJackrabbitRowToEnrichment = (row: JackrabbitClassRow) => ({
  jackrabbit_id:  row.id,
  name:           row.name,
  description:    row.description,
  status:         'Active',
  location:       row.location_name || row.location,
  category1:      row.category1,
  category2:      row.category2 || undefined,
  category3:      row.category3 || undefined,
  session:        row.session || undefined,
  reg_start_date: row.reg_start_date,
  start_date:     row.start_date,
  end_date:       row.end_date,
  days:           formatDays(row.meeting_days),
  start_time:     row.start_time,
  end_time:       row.end_time,
  instructors:    formatInstructors(row.instructors),
  open_spots:     row.openings?.calculated_openings ?? 0,
  min_age:        row.min_age || undefined,
  max_age:        row.max_age || undefined,
  room:           row.room || undefined,
  gender:         row.gender || undefined,
  master_class:   row.master_class,
  tuition_fee:    row.tuition?.fee,
});

export type JackrabbitEnrichment = ReturnType<typeof mapJackrabbitRowToEnrichment>;