import { useMemo } from 'react';
import { countryCodeToFlag, findUnsupportedRegionByZone } from '../data/regions.js';

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

  const unsupportedDevice = useMemo(() => {
    try {
      const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      return findUnsupportedRegionByZone(zone);
    } catch {
      return null;
    }
  }, []);

  const isNorthAmerica = region?.country_code === 'US' || region?.country_code === 'CA';

  return (
    <div className="hint-wrapper">
      <dl className={`hint${!region ? ' hint--empty' : ''}`} aria-label="Unlock times">
        {rows.map((r) => (
          <HintRow key={r.id} label={r.label} timestamp={r.ts} region={region} />
        ))}
      </dl>

      {region && (
        <div className="hint__meta-notes">
          {isNorthAmerica && (
            <p className="hint__note">
              <span className="hint__note-bullet" aria-hidden="true">•</span>
              PlayStation Store North America unlocks simultaneously nationwide at 12:00 AM EST (e.g. 9:00 PM PST / 11:00 PM CST the previous night).
            </p>
          )}
          {unsupportedDevice && (
            <p className="hint__note hint__note--unsupported">
              <span className="hint__note-flag" aria-hidden="true">
                {countryCodeToFlag(unsupportedDevice.country_code)}
              </span>
              PlayStation Store is not natively available in {unsupportedDevice.country}. Displaying {region.country} Store unlock time converted to your local device time.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
