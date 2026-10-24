const SOCIALS = [
  {
    id: 'footer-instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/emekabe',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.3" cy="6.7" r="1.2" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'footer-x',
    label: 'X (Twitter)',
    href: 'https://x.com/emekabe',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path
          fill="currentColor"
          d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.78L17.75 3Zm-1.08 16.2h1.7L7.4 4.72H5.58L16.67 19.2Z"
        />
      </svg>
    ),
  },
  {
    id: 'footer-linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/chukwuemeka-chukwulobe/',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path
          fill="currentColor"
          d="M4.98 3.5a2.48 2.48 0 1 1 0 4.96 2.48 2.48 0 0 1 0-4.96ZM3 9.75h3.96V21H3V9.75Zm6.46 0h3.8v1.54h.05c.53-1 1.82-2.05 3.75-2.05 4.01 0 4.75 2.64 4.75 6.07V21h-3.96v-5.03c0-1.2-.02-2.74-1.67-2.74-1.67 0-1.93 1.3-1.93 2.65V21H9.46V9.75Z"
        />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="footer">
      <p className="footer__credit">
        Fan project by <span className="footer__name">Emeka Chukwulobe</span>
      </p>
      <ul className="footer__socials">
        {SOCIALS.map((s) => (
          <li key={s.id}>
            <a id={s.id} className="footer__social" href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
              {s.icon}
            </a>
          </li>
        ))}
      </ul>
      <p className="footer__legal">Not affiliated with Rockstar Games or Take-Two Interactive.</p>
    </footer>
  );
}
