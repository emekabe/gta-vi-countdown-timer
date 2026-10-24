import { useRef } from 'react';

/**
 * Accessible two-tab navigation (WAI-ARIA tabs pattern with arrow-key support).
 */
export default function TabNav({ tabs, activeId, onChange }) {
  const refs = useRef({});

  const handleKeyDown = (event, index) => {
    let next = null;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next === null) return;
    event.preventDefault();
    const tab = tabs[next];
    onChange(tab.id);
    refs.current[tab.id]?.focus();
  };

  return (
    <nav className="tabnav" aria-label="Countdown type">
      <div className="tabnav__list" role="tablist">
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeId;
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              ref={(el) => (refs.current[tab.id] = el)}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls="countdown-panel"
              tabIndex={isActive ? 0 : -1}
              className={`tabnav__tab${isActive ? ' tabnav__tab--active' : ''}`}
              onClick={() => onChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
