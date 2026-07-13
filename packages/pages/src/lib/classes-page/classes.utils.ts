import type { MeetingDays } from '@inithium/types';

const DAY_ORDER: ReadonlyArray<{ key: keyof MeetingDays; label: string }> = [
  { key: 'mon', label: 'Mon' },
  { key: 'tue', label: 'Tue' },
  { key: 'wed', label: 'Wed' },
  { key: 'thu', label: 'Thu' },
  { key: 'fri', label: 'Fri' },
  { key: 'sat', label: 'Sat' },
  { key: 'sun', label: 'Sun' },
];

export const formatMeetingDays = (days: MeetingDays): string =>
  DAY_ORDER.filter(({ key }) => days[key])
    .map(({ label }) => label)
    .join(', ');

export const formatTimeRange = (startTime: string, endTime: string): string =>
  `${startTime} - ${endTime}`;

export const formatAgeRange = (minAge: string, maxAge: string): string =>
  `Ages ${minAge}-${maxAge}`;

export const formatSessionRange = (startDate: string, endDate: string): string =>
  `${startDate} - ${endDate}`;

export const formatInstructors = (instructors: readonly string[]): string =>
  instructors.join(', ');