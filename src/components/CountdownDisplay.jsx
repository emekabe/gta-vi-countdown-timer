import { useEffect, useRef, useState } from 'react';

const UNITS = [
  { key: 'days', label: 'Days' },
  { key: 'hours', label: 'Hrs' },
  { key: 'minutes', label: 'Min' },
  { key: 'seconds', label: 'Sec' },
];

const PULSE_MS = 150;
const pad = (n) => String(n).padStart(2, '0');

export default function CountdownDisplay({ label, remaining, storeUrl, countryName }) {
  // Track previous values so only the unit that actually changed pulses.
  const prevRef = useRef(null);
  const [pulsing, setPulsing] = useState({});

  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = remaining;
    if (!prev || !remaining) return undefined;

    const changed = {};
    UNITS.forEach(({ key }) => {
      if (prev[key] !== remaining[key]) changed[key] = true;
    });
    if (!Object.keys(changed).length) return undefined;

    setPulsing(changed);
    const t = setTimeout(() => setPulsing({}), PULSE_MS);
    return () => clearTimeout(t);
  }, [remaining]);

  return (
    <section className="countdown" aria-labelledby="countdown-title">
      <p className="countdown__eyebrow">Grand Theft Auto</p>
      <h1 id="countdown-title" className="countdown__title">
        <span className="visually-hidden">Grand Theft Auto VI</span>
        <svg
          fill="none"
          height="100%"
          width="100%"
          viewBox="0 0 48 35"
          xmlns="http://www.w3.org/2000/svg"
          className="countdown__vi-svg _1o5pgyxe _1o5pgyxf _1n4m2yu0"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <linearGradient id="vi-brand-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF6B35" />
              <stop offset="50%" stopColor="#FF1A8C" />
              <stop offset="100%" stopColor="#C44FFF" />
            </linearGradient>
          </defs>
          <path d="M46.2661 0.800781H34.7236V34.4008H46.2661V0.800781Z" fill="url(#vi-brand-gradient)" />
          <path d="M33.9162 0.800781L17.3358 34.4008L0.776855 0.800781H12.3139L17.3332 11.5445L22.3766 0.800781H33.9162Z" fill="url(#vi-brand-gradient)" />
          <path d="M46.9194 1.43945C47.0056 1.43945 47.0488 1.47492 47.0488 1.54585C47.0488 1.60496 47.0155 1.63872 46.9489 1.64712L47.0573 1.81154H46.9939L46.8905 1.65148H46.828V1.81154H46.769V1.43945H46.9192H46.9194ZM46.8959 1.60465C46.9317 1.60465 46.9565 1.59999 46.9698 1.59065C46.9831 1.58132 46.9898 1.56561 46.9898 1.54336C46.9898 1.50541 46.9631 1.48628 46.9099 1.48628H46.8282V1.60465H46.8959Z" fill="url(#vi-brand-gradient)" />
          <path d="M46.8961 1.94775C46.7154 1.94775 46.5684 1.80355 46.5684 1.62622C46.5684 1.44889 46.7154 1.30469 46.8961 1.30469C47.0769 1.30469 47.2239 1.44889 47.2239 1.62622C47.2239 1.80355 47.0769 1.94775 46.8961 1.94775ZM46.8961 1.35509C46.7437 1.35509 46.6196 1.47673 46.6196 1.62638C46.6196 1.77602 46.7436 1.89767 46.8961 1.89767C47.0487 1.89767 47.1727 1.77602 47.1727 1.62638C47.1727 1.47673 47.0487 1.35509 46.8961 1.35509Z" fill="url(#vi-brand-gradient)" />
        </svg>
      </h1>
      <p className="countdown__context">{label}</p>

      {remaining?.isComplete ? (
        <div className="countdown__done" role="status">
          <p className="countdown__done-title">Now available</p>
          <p className="countdown__done-sub">
            {label === 'Preload' ? 'Preloading is live' : 'GTA VI is unlocked'} in {countryName}.
          </p>
          <a className="countdown__store" href={storeUrl} target="_blank" rel="noopener noreferrer">
            Open PlayStation Store
            <span aria-hidden="true"> ↗</span>
          </a>
        </div>
      ) : (
        <div
          className="countdown__units"
          role="timer"
          aria-live="off"
          aria-label={
            remaining
              ? `${remaining.days} days, ${remaining.hours} hours, ${remaining.minutes} minutes, ${remaining.seconds} seconds remaining`
              : 'Select store region to begin countdown'
          }
        >
          {UNITS.map(({ key, label: unitLabel }, i) => (
            <div key={key} className="countdown__group">
              {i > 0 && (
                <span className="countdown__sep" aria-hidden="true">
                  :
                </span>
              )}
              <div className="countdown__unit">
                <span
                  className={`countdown__num${pulsing[key] ? ' countdown__num--pulse' : ''}`}
                  aria-hidden="true"
                >
                  {remaining ? pad(remaining[key]) : '--'}
                </span>
                <span className="countdown__label" aria-hidden="true">
                  {unitLabel}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
