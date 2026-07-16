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

export const formatInstructors = (instructors: string): string =>
  instructors
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean)
    .join(', ');

const JACKRABBIT_ORG_ID = '558395';

export const buildRegistrationLink = (jackrabbitId: number): string =>
  `https://app.jackrabbitclass.com/regv2.asp?id=${JACKRABBIT_ORG_ID}&preLoadClassID=${jackrabbitId}`;

export const formatAvailability = (
  openSpots: number,
  waitlistCount: number,
  classSize?: number
): string => {
  if (openSpots > 0) {
    return classSize
      ? `${openSpots} of ${classSize} spots open`
      : `${openSpots} openings`;
  }
  if (waitlistCount > 0) {
    return `${waitlistCount} on waitlist`;
  }
  return 'Class full';
};

export const formatTuition = (fee?: number): string | null => {
  if (fee === undefined || fee === null) return null;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: fee % 1 === 0 ? 0 : 2,
  }).format(fee);
};