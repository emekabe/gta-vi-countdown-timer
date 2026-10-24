import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { countryCodeToFlag } from '../data/regions.js';

const ANIM_MS = 200;
const DEBOUNCE_MS = 200;

function useDebounced(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function RegionSelector({ regions, selected, onSelect }) {
  // `mounted` keeps the panel in the DOM while the close animation runs.
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlight, setHighlight] = useState(0);
  const debouncedQuery = useDebounced(query, DEBOUNCE_MS);

  const triggerRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return regions;
    return regions.filter(
      (r) => r.country.toLowerCase().includes(q) || r.country_code.toLowerCase() === q || r.country_code.toLowerCase().startsWith(q)
    );
  }, [regions, debouncedQuery]);

  useEffect(() => setHighlight(0), [debouncedQuery]);

  const openPanel = () => {
    setMounted(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)));
  };

  const closePanel = useCallback(() => {
    setOpen(false);
    setTimeout(() => {
      setMounted(false);
      setQuery('');
      triggerRef.current?.focus();
    }, ANIM_MS);
  }, []);

  // Focus search on open, scroll the current selection into view.
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus({ preventScroll: true });
    const idx = regions.findIndex((r) => r.country_code === selected?.country_code);
    if (idx >= 0) {
      setHighlight(idx);
      listRef.current?.children[idx]?.scrollIntoView({ block: 'center' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Lock page scroll while the panel is open.
  useEffect(() => {
    if (!mounted) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mounted]);

  const choose = (region) => {
    onSelect(region);
    closePanel();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closePanel();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter' && filtered[highlight]) {
      e.preventDefault();
      choose(filtered[highlight]);
    }
  };

  useEffect(() => {
    listRef.current?.children[highlight]?.scrollIntoView({ block: 'nearest' });
  }, [highlight]);

  return (
    <div className="region">
      <span className="region__caption" id="region-caption">
        PS5 store region
      </span>
      <button
        ref={triggerRef}
        id="region-trigger"
        type="button"
        className="region__trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-describedby="region-caption"
        onClick={openPanel}
      >
        {selected ? (
          <>
            <span className="region__flag" aria-hidden="true">
              {countryCodeToFlag(selected.country_code)}
            </span>
            <span className="region__name">{selected.country}</span>
            <span className="region__code">({selected.country_code})</span>
          </>
        ) : (
          <>
            <span className="region__flag" aria-hidden="true">
              {/*🌐was there before*/}
            </span>
            <span className="region__name region__name--placeholder">Select PlayStation Store region</span>
          </>
        )}
        <svg className="region__chevron" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
          <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {mounted && createPortal(
        <div
          className={`region-modal${open ? ' region-modal--open' : ''}`}
          onMouseDown={(e) => e.target === e.currentTarget && closePanel()}
        >
          <div
            className="region-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Choose your PlayStation Store region"
            onKeyDown={handleKeyDown}
          >
            <div className="region-panel__head">
              <svg className="region-panel__search-icon" viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
                <circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <input
                ref={inputRef}
                id="region-search"
                className="region-panel__input"
                type="search"
                placeholder="Search country or code"
                autoComplete="off"
                spellCheck="false"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                role="combobox"
                aria-expanded="true"
                aria-controls="region-list"
                aria-activedescendant={filtered[highlight] ? `region-opt-${filtered[highlight].country_code}` : undefined}
              />
              <button type="button" className="region-panel__close" onClick={closePanel} aria-label="Close" id="region-close">
                <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                  <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <ul ref={listRef} id="region-list" className="region-panel__list" role="listbox" aria-label="Regions">
              {filtered.map((r, i) => {
                const isSelected = r.country_code === selected?.country_code;
                return (
                  <li
                    key={r.country_code}
                    id={`region-opt-${r.country_code}`}
                    role="option"
                    aria-selected={isSelected}
                    className={`region-option${i === highlight ? ' region-option--hl' : ''}${isSelected ? ' region-option--selected' : ''}`}
                    onMouseEnter={() => setHighlight(i)}
                    onClick={() => choose(r)}
                  >
                    <span className="region-option__flag" aria-hidden="true">
                      {countryCodeToFlag(r.country_code)}
                    </span>
                    <span className="region-option__name">{r.country}</span>
                    <span className="region-option__code">{r.country_code}</span>
                    <span className="region-option__tz">{r.timezone_label}</span>
                  </li>
                );
              })}
              {filtered.length === 0 && <li className="region-panel__empty">No storefront matches “{debouncedQuery}”</li>}
            </ul>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
