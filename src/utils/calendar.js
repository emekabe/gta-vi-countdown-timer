/**
 * "Add to calendar" helpers — pure functions, no React.
 *
 * Every event uses absolute UTC instants (…Z), so each calendar app renders the
 * entry in the viewer's own timezone — matching the local time shown on the page.
 */
import { formatInRegion, formatParts, getDeviceOffsetLabel, getDeviceTimeZone } from './timeFormat.js';

export const SITE_URL = 'https://gtavicountdowntimer.vercel.app/';
const EVENT_DURATION_MS = 60 * 60 * 1000; // 1 hour
const UID_DOMAIN = 'gtavicountdowntimer.vercel.app';

const COPY = {
  preload: {
    title: (store) => `GTA VI Preload Opens on PS5 (${store} Store)`,
    intro: 'Grand Theft Auto VI preloading opens on the PlayStation Store. Start your download so you are ready to play the moment it unlocks.',
    alarm: 'GTA VI preload opens soon',
  },
  release: {
    title: (store) => `GTA VI Unlocks on PS5 (${store} Store)`,
    intro: 'Grand Theft Auto VI unlocks on PS5 via the PlayStation Store.',
    alarm: 'GTA VI unlocks soon',
  },
};

/**
 * @param {object} p
 * @param {'preload'|'release'} p.kind
 * @param {object} p.region           storefront entry from regions.js
 * @param {number} p.startTs          unlock instant (UTC ms)
 * @param {object|null} [p.unsupportedDevice]  entry from UNSUPPORTED_REGIONS_GUIDE, if any
 */
export function buildCalendarEvent({ kind, region, startTs, unsupportedDevice = null }) {
  const copy = COPY[kind];
  const deviceZone = getDeviceTimeZone();
  const deviceZoneText = [deviceZone, getDeviceOffsetLabel(startTs)].filter(Boolean).join(', ');

  const lines = [
    copy.intro,
    '',
    `PlayStation Store region: ${region.country} (${region.country_code})`,
    `Store unlock time: ${formatInRegion(startTs, region.utc_offset_hours)} ${region.timezone_label}`,
    `Your local time: ${formatParts(startTs)} (${deviceZoneText})`,
  ];

  if (unsupportedDevice) {
    lines.push(
      '',
      `PlayStation Store isn't natively available in ${unsupportedDevice.country}, so these times follow your ${region.country} PSN account.`
    );
  }

  if (region.country_code === 'US' || region.country_code === 'CA') {
    lines.push('', 'North America unlocks at the same moment nationwide: 12:00 AM ET / 9:00 PM PT the night before.');
  }

  lines.push(
    '',
    `Open PlayStation Store: ${region.store_url}`,
    `Countdown: ${SITE_URL}`,
    '',
    "Times follow PlayStation Store's midnight-local unlock. Check the game tile on your PS5 for the exact countdown."
  );

  return {
    kind,
    title: copy.title(region.country),
    description: lines.join('\n'),
    location: `PlayStation Store (${region.country})`,
    url: region.store_url,
    alarmText: copy.alarm,
    startTs,
    endTs: startTs + EVENT_DURATION_MS,
    uid: `gta6-${kind}-${region.country_code}@${UID_DOMAIN}`,
    fileName: `gta-vi-${kind}-${region.country_code.toLowerCase()}.ics`,
  };
}

/** 2026-11-12T05:00:00.000Z → 20261112T050000Z */
function toIcsUtc(ts) {
  return new Date(ts).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

/** ISO without milliseconds, e.g. 2026-11-12T05:00:00Z (Outlook deeplinks). */
function toIsoUtc(ts) {
  return new Date(ts).toISOString().replace(/\.\d{3}/, '');
}

export function googleCalendarUrl(event) {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${toIcsUtc(event.startTs)}/${toIcsUtc(event.endTs)}`,
    details: event.description,
    location: event.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function outlookUrl(event, { office365 = false } = {}) {
  const host = office365 ? 'https://outlook.office.com' : 'https://outlook.live.com';
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title,
    body: event.description,
    startdt: toIsoUtc(event.startTs),
    enddt: toIsoUtc(event.endTs),
    location: event.location,
  });
  return `${host}/calendar/0/action/compose?${params.toString()}`;
}

/** RFC 5545 TEXT escaping. */
function escapeText(value) {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

const encoder = typeof TextEncoder !== 'undefined' ? new TextEncoder() : null;
const byteLength = (s) => (encoder ? encoder.encode(s).length : unescape(encodeURIComponent(s)).length);

/** Fold a content line at 75 octets without splitting multi-byte characters. */
function foldLine(line) {
  const out = [];
  let current = '';
  let currentBytes = 0;
  let limit = 75;
  for (const ch of line) {
    const b = byteLength(ch);
    if (currentBytes + b > limit) {
      out.push(current);
      current = ' ';
      currentBytes = 1;
      limit = 75;
    }
    current += ch;
    currentBytes += b;
  }
  out.push(current);
  return out.join('\r\n');
}

export function buildIcs(event, now = Date.now()) {
  const alarm = (trigger) => [
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escapeText(event.alarmText)}`,
    `TRIGGER:${trigger}`,
    'END:VALARM',
  ];

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GTA VI Countdown//gtavicountdowntimer.vercel.app//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.uid}`,
    `DTSTAMP:${toIcsUtc(now)}`,
    `DTSTART:${toIcsUtc(event.startTs)}`,
    `DTEND:${toIcsUtc(event.endTs)}`,
    `SUMMARY:${escapeText(event.title)}`,
    `DESCRIPTION:${escapeText(event.description)}`,
    `LOCATION:${escapeText(event.location)}`,
    `URL:${event.url}`,
    'TRANSP:TRANSPARENT',
    ...alarm('-P1D'),
    ...alarm('-PT15M'),
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return lines.map(foldLine).join('\r\n') + '\r\n';
}

/** Trigger a download of the .ics file. Works over http(s) and file://. */
export function downloadIcs(event) {
  const ics = buildIcs(event);
  const a = document.createElement('a');
  let objectUrl = null;

  try {
    objectUrl = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
    a.href = objectUrl;
  } catch {
    a.href = `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
  }

  a.download = event.fileName;
  a.rel = 'noopener';
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  if (objectUrl) setTimeout(() => URL.revokeObjectURL(objectUrl), 10_000);
}
