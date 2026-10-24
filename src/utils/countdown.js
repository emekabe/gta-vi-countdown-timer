/**
 * Countdown helpers.
 *
 * GTA VI unlocks on PS5 at midnight *local store time* in each region, so every
 * region has its own absolute (UTC) unlock moment. All maths here is pure and
 * recomputed from `Date.now()` on every tick — we never decrement stored values,
 * which keeps the timer accurate across tab sleeps, throttling and clock drift.
 */

export const RELEASE_DATE = '2026-11-19';
export const PRELOAD_DATE = '2026-11-12'; // exactly 7 days before release

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/**
 * UTC timestamp (ms) of midnight on `dateString` in a region with the given offset.
 * @param {string} dateString e.g. "2026-11-19"
 * @param {number} utcOffsetHours e.g. -5, 1, 5.5
 */
export function getUnlockTimestamp(dateString, utcOffsetHours) {
  const offsetMs = utcOffsetHours * 60 * 60 * 1000;
  const utcMidnight = new Date(`${dateString}T00:00:00Z`).getTime();
  return utcMidnight - offsetMs;
}

/**
 * Break the remaining time into days / hours / minutes / seconds.
 * @param {number} targetTimestamp UTC ms
 * @param {number} [now] UTC ms (defaults to Date.now())
 */
export function getTimeRemaining(targetTimestamp, now = Date.now()) {
  const diff = Math.max(0, targetTimestamp - now);

  const days = Math.floor(diff / DAY);
  const hours = Math.floor((diff % DAY) / HOUR);
  const minutes = Math.floor((diff % HOUR) / MINUTE);
  const seconds = Math.floor((diff % MINUTE) / SECOND);

  return { total: diff, days, hours, minutes, seconds, isComplete: diff === 0 };
}

/** "UTC+5:30", "UTC-3", "UTC+0" */
export function formatUtcOffset(utcOffsetHours) {
  const sign = utcOffsetHours < 0 ? '-' : '+';
  const abs = Math.abs(utcOffsetHours);
  const h = Math.floor(abs);
  const m = Math.round((abs - h) * 60);
  return `UTC${sign}${h}${m ? `:${String(m).padStart(2, '0')}` : ''}`;
}

/** The device's UTC offset (hours) at a given instant — DST-aware via the host OS. */
export function getDeviceOffsetHours(atTimestamp = Date.now()) {
  return -new Date(atTimestamp).getTimezoneOffset() / 60;
}
