import "server-only";

/**
 * Best-effort, per-instance sliding window limiter. On serverless hosts each
 * instance keeps its own window, which is enough to blunt rapid repeat
 * submissions; duplicate emails are additionally rejected by the Apps Script.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 8;
const hits = new Map<string, number[]>();

export function isRateLimited(key: string, now = Date.now()) {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);

  if (hits.size > 5000) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }
  return recent.length > MAX_REQUESTS;
}
