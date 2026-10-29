/**
 * Shared date/time formatting so the on-screen hint and the calendar event text
 * always produce identical strings.
 */
import { formatUtcOffset, getDeviceOffsetHours } from './countdown.js';

/**
 * Build "Thursday, November 19 2026 at 12:00 AM" from Intl parts so the structure is stable
 * while month/day names and the clock style follow the user's locale.
 */
export function formatParts(timestamp, timeZone) {
  const fmt = new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    ...(timeZone ? { timeZone } : {}),
  });
  const p = Object.fromEntries(fmt.formatToParts(new Date(timestamp)).map(({ type, value }) => [type, value]));
  const period = p.dayPeriod ? ` ${p.dayPeriod.toUpperCase()}` : '';
  const time = `${p.hour}:${p.minute}${period}`;
  return `${p.weekday}, ${p.month} ${p.day} ${p.year} at ${time}`;
}

/**
 * Region time is derived purely from `utc_offset_hours`: shift the instant by the
 * offset and format it as UTC. This avoids IANA zones entirely (several store
 * regions share an offset but not a zone name).
 */
export function formatInRegion(timestamp, utcOffsetHours) {
  return formatParts(timestamp + utcOffsetHours * 3600 * 1000, 'UTC');
}

/** IANA zone of this device, e.g. "Africa/Lagos" (empty string if unavailable). */
export function getDeviceTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  } catch {
    return '';
  }
}

/** Device UTC offset label at a given instant, e.g. "UTC+1" (DST-aware). */
export function getDeviceOffsetLabel(timestamp = Date.now()) {
  return formatUtcOffset(getDeviceOffsetHours(timestamp));
}
