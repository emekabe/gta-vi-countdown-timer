import { useMemo } from 'react';

/**
 * Build "Thursday, November 19 2026 at 12:00 AM" from Intl parts so the structure is stable
 * while month/day names and the clock style follow the user's locale.
 */
function formatParts(timestamp, timeZone) {
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
function formatInRegion(timestamp, utcOffsetHours) {
  return formatParts(timestamp + utcOffsetHours * 3600 * 1000, 'UTC');
}

function HintRow({ label, timestamp, region }) {
  const regionText = region && timestamp ? formatInRegion(timestamp, region.utc_offset_hours) : '';
  const deviceText = timestamp ? formatParts(timestamp) : '';

  return (
    <div className="hint__row">
      <dt className="hint__label">
        {label}
        <span className="hint__arrow" aria-hidden="true">
          →
        </span>
      </dt>
      <dd className="hint__value">
        {region ? (
          <>
            <span className="hint__primary">
              {regionText} <span className="hint__tz">{region.timezone_label}</span>
            </span>
            <span className="hint__secondary">
              That&rsquo;s <strong>{deviceText}</strong> in your current location time
            </span>
          </>
        ) : null}
      </dd>
    </div>
  );
}

export default function LocalTimeHint({ region, preloadTimestamp, releaseTimestamp }) {
  const rows = useMemo(
    () => [
      { id: 'preload', label: 'Preloads', ts: preloadTimestamp },
      { id: 'release', label: 'Releases', ts: releaseTimestamp },
    ],
    [preloadTimestamp, releaseTimestamp]
  );

  return (
    <dl className={`hint${!region ? ' hint--empty' : ''}`} aria-label="Unlock times">
      {rows.map((r) => (
        <HintRow key={r.id} label={r.label} timestamp={r.ts} region={region} />
      ))}
    </dl>
  );
}
