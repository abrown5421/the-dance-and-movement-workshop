import type { JackrabbitOpeningsResponse } from '@inithium/types';
import { mapJackrabbitRowToEnrichment } from './classes.jackrabbit-mapper.js';
import { ClassModel } from './classes.model.js';

const OPENINGS_URL = 'https://app.jackrabbitclass.com/jr3.0/Openings/OpeningsJson?orgid=558395';
const SYNC_COOLDOWN_MS = 2 * 60 * 1000; // don't re-fetch more than once per 2 min

let lastSyncedAt = 0;
let inFlight: Promise<{ synced: number; skipped: boolean }> | null = null;

const fetchOpenings = async (): Promise<JackrabbitOpeningsResponse> => {
  const res = await fetch(OPENINGS_URL);
  if (!res.ok) throw new Error(`Jackrabbit openings fetch failed: ${res.status}`);
  const data = (await res.json()) as JackrabbitOpeningsResponse;
  if (!data.success) throw new Error(`Jackrabbit openings error: ${data.message}`);
  return data;
};

export interface JackrabbitSyncResult {
  synced: number;
  skipped: boolean;
}

export const syncFromJackrabbitOpenings = async (
  options: { force?: boolean } = {}
): Promise<JackrabbitSyncResult> => {

  const now = Date.now();

  if (!options.force && now - lastSyncedAt < SYNC_COOLDOWN_MS) {
    return { synced: 0, skipped: true };
  }

  if (inFlight) return inFlight;

  inFlight = (async () => {
    const { rows } = await fetchOpenings();

    const ops = rows.map((row) => {
      const enrichment = mapJackrabbitRowToEnrichment(row);
      return {
        updateOne: {
          filter: { jackrabbit_id: enrichment.jackrabbit_id },
          update: {
            $set: { ...enrichment, last_synced_at: new Date().toISOString() },
            $setOnInsert: {
              status: 'Active',
              instructors_ids: [],
              instructor_ids: [],
              open_spots: 0,
              waitlist_count: 0,
              future_drops: 0,
              future_enrolls: 0,
              resources: 0,
              class_size: 0,
              lesson_plans: 0,
            },
          },
          upsert: true,
        },
      };
    });

    const result = await ClassModel.bulkWrite(ops, { ordered: false });
    lastSyncedAt = Date.now();
    return { synced: result.upsertedCount + result.modifiedCount, skipped: false };
  })();

  try {
    return await inFlight;
  } finally {
    inFlight = null;
  }
};