import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import TabNav from './components/TabNav.jsx';
import ArtworkBackground from './components/ArtworkBackground.jsx';
import CountdownDisplay from './components/CountdownDisplay.jsx';
import RegionSelector from './components/RegionSelector.jsx';
import LocalTimeHint from './components/LocalTimeHint.jsx';
import Footer from './components/Footer.jsx';
import regions, { detectRegion, findRegionByCode } from './data/regions.js';
import { getTimeRemaining, getUnlockTimestamp, PRELOAD_DATE, RELEASE_DATE } from './utils/countdown.js';

const TABS = [
  { id: 'release', label: 'Release', date: RELEASE_DATE, folder: 'cover-art' },
  { id: 'preload', label: 'Preload', date: PRELOAD_DATE, folder: 'launch-artwork' },
];

const STORAGE_KEY = 'gta6-countdown:user-selected-region';
const CONTENT_FADE_MS = 200; // out + in = 400ms total tab transition

function loadInitialRegion() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const found = saved && findRegionByCode(saved);
    if (found) return found;
  } catch {
    /* storage unavailable (privacy mode, file:// quirks) */
  }
  return null; // Default is blank as requested
}

/** Ticks once per second, aligned to the wall-clock second boundary. */
function useNow() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    let timer;
    const tick = () => {
      setNow(Date.now());
      timer = setTimeout(tick, 1000 - (Date.now() % 1000) + 5);
    };
    timer = setTimeout(tick, 1000 - (Date.now() % 1000) + 5);
    const onVisible = () => document.visibilityState === 'visible' && setNow(Date.now());
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);
  return now;
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('release');
  const [displayTab, setDisplayTab] = useState('release'); // lags activeTab during the fade
  const [fading, setFading] = useState(false);
  const [region, setRegion] = useState(loadInitialRegion);
  const [scrolled, setScrolled] = useState(false);
  const fadeTimer = useRef(null);
  const now = useNow();

  // Glass-like blur on scroll, clears when back at the very top.
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const switchTab = useCallback(
    (id) => {
      if (id === activeTab) return;
      setActiveTab(id); // artwork crossfade starts immediately (600ms)
      clearTimeout(fadeTimer.current);
      if (prefersReducedMotion()) {
        setDisplayTab(id);
        return;
      }
      setFading(true);
      fadeTimer.current = setTimeout(() => {
        setDisplayTab(id);
        setFading(false);
      }, CONTENT_FADE_MS);
    },
    [activeTab]
  );

  useEffect(() => () => clearTimeout(fadeTimer.current), []);

  const selectRegion = useCallback((r) => {
    setRegion(r);
    try {
      localStorage.setItem(STORAGE_KEY, r.country_code);
    } catch {
      /* ignore */
    }
  }, []);

  const defaultRegion = useMemo(() => detectRegion(), []);
  const activeOffset = (region || defaultRegion)?.utc_offset_hours ?? 0;

  const timestamps = useMemo(() => {
    return {
      release: getUnlockTimestamp(RELEASE_DATE, activeOffset),
      preload: getUnlockTimestamp(PRELOAD_DATE, activeOffset),
    };
  }, [activeOffset]);

  const tab = TABS.find((t) => t.id === displayTab);
  const remaining = useMemo(() => {
    return getTimeRemaining(timestamps[displayTab], now);
  }, [timestamps, displayTab, now]);

  return (
    <div className="app">
      {TABS.map((t) => (
        <ArtworkBackground key={t.id} folder={t.folder} active={t.id === activeTab} />
      ))}

      <header className={`topbar${scrolled ? ' topbar--scrolled' : ''}`}>
        <div className="topbar__spacer" aria-hidden="true" />
        <TabNav tabs={TABS} activeId={activeTab} onChange={switchTab} />
        <a
          id="rockstar-link"
          className="rockstar-link"
          href="https://www.rockstargames.com/VI"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Rockstar Games (opens in a new tab)"
        >
          <svg
            className="rockstar-link__svg"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
          >
            <path
              className="_19v0h083"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8.61511 10.9978H12.5848C14.3845 10.9978 15.9421 10.4507 15.9421 8.44939C15.9421 6.86148 14.5745 6.52423 13.2595 6.52423H9.56608L8.61511 10.9978ZM24.3357 21.6949H30.6663L24.9533 25.6406L25.8771 31.8581L20.9272 28.1057L14.2842 32.0001L17.3902 25.4102C17.3902 25.4102 13.7775 21.6513 13.7803 21.6513C13.5374 21.3314 13.4563 20.5073 13.4563 20.1527C13.4563 19.7045 13.4849 19.2505 13.5155 18.7669C13.5503 18.2159 13.5875 17.6266 13.5875 16.9637C13.5875 15.3278 12.8632 14.4723 11.0925 14.4723H7.77269L6.32717 21.2249H1.33301L5.30462 2.66675H14.7029C18.1954 2.66675 20.861 3.52407 20.861 7.47735C20.861 10.2601 19.4884 12.2367 16.4605 12.6517V12.7051C17.8843 13.0428 18.4177 14.0037 18.4177 15.7946C18.4177 16.5095 18.3959 17.1369 18.3754 17.7271C18.3572 18.2511 18.34 18.7456 18.34 19.246C18.34 19.8873 18.507 20.9355 18.9277 21.6513H19.6215L23.3316 15.4672L24.3357 21.6949ZM23.5498 22.6019H27.7512L23.9634 25.217L24.6402 29.7765L20.9957 27.0111L16.3688 29.7218L18.4869 25.2341L15.9114 22.5578H20.1458L22.8244 18.093L23.5498 22.6019Z"
              fill="currentColor"
            />
            <path
              className="_19v0h084"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8.61511 10.9978H12.5848C14.3845 10.9978 15.9421 10.4507 15.9421 8.44939C15.9421 6.86148 14.5745 6.52423 13.2595 6.52423H9.56608L8.61511 10.9978ZM24.3357 21.6949H30.6663L24.9533 25.6406L25.8771 31.8581L20.9272 28.1057L14.2842 32.0001L17.3902 25.4102C17.3902 25.4102 13.7775 21.6513 13.7803 21.6513C13.5374 21.3314 13.4563 20.5073 13.4563 20.1527C13.4563 19.7045 13.4849 19.2505 13.5155 18.7669C13.5503 18.2159 13.5875 17.6266 13.5875 16.9637C13.5875 15.3278 12.8632 14.4723 11.0925 14.4723H7.77269L6.32717 21.2249H1.33301L5.30462 2.66675H14.7029C18.1954 2.66675 20.861 3.52407 20.861 7.47735C20.861 10.2601 19.4884 12.2367 16.4605 12.6517V12.7051C17.8843 13.0428 18.4177 14.0037 18.4177 15.7946C18.4177 16.5095 18.3959 17.1369 18.3754 17.7271C18.3572 18.2511 18.34 18.7456 18.34 19.246C18.34 19.8873 18.507 20.9355 18.9277 21.6513H19.6215L23.3316 15.4672L24.3357 21.6949ZM23.5498 22.6019H27.7512L23.9634 25.217L24.6402 29.7765L20.9957 27.0111L16.3688 29.7218L18.4869 25.2341L15.9114 22.5578H20.1458L22.8244 18.093L23.5498 22.6019Z"
              fill="currentColor"
            />
            <path
              className=""
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8.61511 10.9978H12.5848C14.3845 10.9978 15.9421 10.4507 15.9421 8.44939C15.9421 6.86148 14.5745 6.52423 13.2595 6.52423H9.56608L8.61511 10.9978ZM24.3357 21.6949H30.6663L24.9533 25.6406L25.8771 31.8581L20.9272 28.1057L14.2842 32.0001L17.3902 25.4102C17.3902 25.4102 13.7775 21.6513 13.7803 21.6513C13.5374 21.3314 13.4563 20.5073 13.4563 20.1527C13.4563 19.7045 13.4849 19.2505 13.5155 18.7669C13.5503 18.2159 13.5875 17.6266 13.5875 16.9637C13.5875 15.3278 12.8632 14.4723 11.0925 14.4723H7.77269L6.32717 21.2249H1.33301L5.30462 2.66675H14.7029C18.1954 2.66675 20.861 3.52407 20.861 7.47735C20.861 10.2601 19.4884 12.2367 16.4605 12.6517V12.7051C17.8843 13.0428 18.4177 14.0037 18.4177 15.7946C18.4177 16.5095 18.3959 17.1369 18.3754 17.7271C18.3572 18.2511 18.34 18.7456 18.34 19.246C18.34 19.8873 18.507 20.9355 18.9277 21.6513H19.6215L23.3316 15.4672L24.3357 21.6949ZM23.5498 22.6019H27.7512L23.9634 25.217L24.6402 29.7765L20.9957 27.0111L16.3688 29.7218L18.4869 25.2341L15.9114 22.5578H20.1458L22.8244 18.093L23.5498 22.6019Z"
              fill="currentColor"
            />
          </svg>
          <span className="rockstar-link__text">Visit Rockstar Games</span>
        </a>
      </header>

      <main
        id="countdown-panel"
        className={`stage${fading ? ' stage--fading' : ''}`}
        role="tabpanel"
        aria-labelledby={`tab-${displayTab}`}
      >
        <CountdownDisplay
          label={tab.label}
          remaining={remaining}
          storeUrl={region?.store_url}
          countryName={region?.country}
        />
        <div className="stage__meta">
          <RegionSelector regions={regions} selected={region} onSelect={selectRegion} />
          <LocalTimeHint region={region} preloadTimestamp={timestamps?.preload} releaseTimestamp={timestamps?.release} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
