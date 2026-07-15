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

/**
 * Kept for callers still working with the raw `MeetingDays` object shape
 * (e.g. `JackrabbitClassRow.meeting_days`). `DanceClass.days` is already a
 * pre-formatted string coming from the API, so `ClassCard` no longer needs
 * this — it just renders `danceClass.days` directly.
 */
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

/**
 * `DanceClass.instructors` is now a single comma-separated string rather
 * than a `string[]`, so this just normalizes spacing/empty entries instead
 * of joining an array.
 */
export const formatInstructors = (instructors: string): string =>
  instructors
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean)
    .join(', ');

// Jackrabbit's org/studio id — fixed for this account, only the
// `preLoadClassID` param varies per class.
const JACKRABBIT_ORG_ID = '558395';

/**
 * `DanceClass` no longer carries a pre-built `online_reg_link`, but the URL
 * is always the same shape with `preLoadClassID` set to the class's
 * `jackrabbit_id`, so we can construct it ourselves.
 */
export const buildRegistrationLink = (jackrabbitId: number): string =>
  `https://app.jackrabbitclass.com/regv2.asp?id=${JACKRABBIT_ORG_ID}&preLoadClassID=${jackrabbitId}`;

/**
 * New availability helper: `DanceClass` no longer has a boolean `waitlist`
 * flag or a nested `openings.calculated_openings`. Availability now derives
 * from `open_spots` / `waitlist_count` / `class_size` directly.
 */
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