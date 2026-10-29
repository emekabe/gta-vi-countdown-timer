import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { buildCalendarEvent, downloadIcs, googleCalendarUrl, outlookUrl } from '../utils/calendar.js';

const MENU_HEIGHT_ESTIMATE = 200; // px — used to decide whether to open upward
const DOWNLOADED_MS = 2200;

/**
 * "+ Add to calendar" text button with a small provider menu.
 * Creates a 1-hour event starting at the unlock instant (absolute UTC).
 */
export default function AddToCalendar({ kind, region, startTs, unsupportedDevice }) {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState('down');
  const [downloaded, setDownloaded] = useState(false);
  const wrapRef = useRef(null);
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  const event = useMemo(
    () => buildCalendarEvent({ kind, region, startTs, unsupportedDevice }),
    [kind, region, startTs, unsupportedDevice]
  );

  const items = useMemo(
    () => [
      { id: 'google', label: 'Google Calendar', href: googleCalendarUrl(event) },
      { id: 'ics', label: 'Apple Calendar / Other (.ics)', action: 'ics' },
      { id: 'outlook', label: 'Outlook.com', href: outlookUrl(event) },
      { id: 'office', label: 'Office 365 (work / school)', href: outlookUrl(event, { office365: true }) },
    ],
    [event]
  );

  const close = useCallback((returnFocus = true) => {
    setOpen(false);
    if (returnFocus) btnRef.current?.focus();
  }, []);

  const toggle = () => {
    if (open) {
      close();
      return;
    }
    const rect = btnRef.current?.getBoundingClientRect();
    const spaceBelow = rect ? window.innerHeight - rect.bottom : Infinity;
    setPlacement(spaceBelow < MENU_HEIGHT_ESTIMATE && rect?.top > spaceBelow ? 'up' : 'down');
    setOpen(true);
  };

  // Focus first item on open.
  useEffect(() => {
    if (open) menuRef.current?.querySelector('[role="menuitem"]')?.focus();
  }, [open]);

  // Close on outside click.
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (!wrapRef.current?.contains(e.target)) close(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('touchstart', onDown, { passive: true });
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('touchstart', onDown);
    };
  }, [open, close]);

  useEffect(() => {
    if (!downloaded) return undefined;
    const t = setTimeout(() => setDownloaded(false), DOWNLOADED_MS);
    return () => clearTimeout(t);
  }, [downloaded]);

  const onMenuKeyDown = (e) => {
    const nodes = Array.from(menuRef.current?.querySelectorAll('[role="menuitem"]') || []);
    const idx = nodes.indexOf(document.activeElement);
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      nodes[(idx + 1) % nodes.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      nodes[(idx - 1 + nodes.length) % nodes.length]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      nodes[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      nodes[nodes.length - 1]?.focus();
    } else if (e.key === 'Tab') {
      close(false);
    }
  };

  const onIcs = () => {
    downloadIcs(event);
    setDownloaded(true);
    close();
  };

  const menuId = `calendar-menu-${kind}`;

  return (
    <div className="calendar" ref={wrapRef}>
      <button
        ref={btnRef}
        id={`calendar-btn-${kind}`}
        type="button"
        className="calendar-btn"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={toggle}
      >
        {downloaded ? (
          <>
            <span aria-hidden="true">✓</span> Downloaded
          </>
        ) : (
          <>
            <span className="calendar-btn__plus" aria-hidden="true">
              +
            </span>{' '}
            Add to calendar
          </>
        )}
      </button>

      {open && (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-labelledby={`calendar-btn-${kind}`}
          className={`calendar-menu calendar-menu--${placement}`}
          onKeyDown={onMenuKeyDown}
        >
          {items.map((item) =>
            item.action === 'ics' ? (
              <button
                key={item.id}
                id={`calendar-${item.id}-${kind}`}
                type="button"
                role="menuitem"
                className="calendar-menu__item"
                onClick={onIcs}
              >
                {item.label}
              </button>
            ) : (
              <a
                key={item.id}
                id={`calendar-${item.id}-${kind}`}
                role="menuitem"
                className="calendar-menu__item"
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => close(false)}
              >
                {item.label}
                <span className="calendar-menu__ext" aria-hidden="true">
                  ↗
                </span>
              </a>
            )
          )}
        </div>
      )}
    </div>
  );
}
