import { useMemo } from 'react';
import { countryCodeToFlag, findUnsupportedRegionByZone } from '../data/regions.js';
import { formatInRegion, formatParts, getDeviceTimeZone } from '../utils/timeFormat.js';
import AddToCalendar from './AddToCalendar.jsx';

function HintRow({ kind, label, timestamp, region, unsupportedDevice }) {
  const regionText = region && timestamp ? formatInRegion(timestamp, region.utc_offset_hours) : '';
  const deviceText = timestamp ? formatParts(timestamp) : '';
  // App re-renders every second, so this flips as soon as the unlock passes.
  const isUpcoming = Boolean(timestamp) && timestamp > Date.now();

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
            {isUpcoming && (
              <AddToCalendar kind={kind} region={region} startTs={timestamp} unsupportedDevice={unsupportedDevice} />
            )}
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

  const unsupportedDevice = useMemo(() => findUnsupportedRegionByZone(getDeviceTimeZone()), []);

  const isNorthAmerica = region?.country_code === 'US' || region?.country_code === 'CA';

  return (
    <div className="hint-wrapper">
      <dl className={`hint${!region ? ' hint--empty' : ''}`} aria-label="Unlock times">
        {rows.map((r) => (
          <HintRow
            key={r.id}
            kind={r.id}
            label={r.label}
            timestamp={r.ts}
            region={region}
            unsupportedDevice={unsupportedDevice}
          />
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
