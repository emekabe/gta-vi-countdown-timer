# GTA VI Countdown

An unofficial, fan-made countdown to **Grand Theft Auto VI** on PS5 — for both the
**preload** (12 Nov 2026) and the **release** (19 Nov 2026) — calculated for the
exact midnight unlock in every PlayStation Store region.

Built with Vite + React (plain JavaScript), vanilla CSS, and native `Date` / `Intl` APIs.
No UI libraries, no date libraries.

---

## Run locally

```bash
npm install && npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Build for production

```bash
npm run build
```

This produces a fully self-contained `dist/` folder. You can:

- open `dist/index.html` **directly in a browser** (double-click — no server needed), or
- upload `dist/` to any static host (Netlify, GitHub Pages, S3, …).

> **How the file:// support works:** browsers block `<script type="module">` on
> `file://`. `vite.config.js` therefore bundles the app into a single classic IIFE
> script, uses a relative `base: './'`, and rewrites the injected tags to plain
> `<script defer>`. The only external request is Google Fonts (Bebas Neue + Inter);
> without a connection the page falls back to system fonts.

`npm run preview` serves the built folder if you prefer to test over HTTP.

---

## Artwork

Each tab has its own full-bleed background, loaded with a responsive `<picture>`
element. Place images in `public/artwork/` using **exactly these file names**:

```
public/artwork/
├── cover-art/          ← Release tab
│   ├── small.jpg
│   ├── medium.jpg
│   └── large.jpg
└── launch-artwork/     ← Preload tab
    ├── small.jpg
    ├── medium.jpg
    └── large.jpg
```

| File         | Served when                                | Recommended size | Aspect      |
| ------------ | ------------------------------------------ | ---------------- | ----------- |
| `small.jpg`  | viewport ≤ 767px **and** portrait (phones) | 1080 × 1920      | 9:16        |
| `medium.jpg` | viewport ≤ 1279px (tablets, landscape phones) | 1600 × 1600   | 1:1         |
| `large.jpg`  | everything wider (desktop)                 | 2560 × 1440      | 16:9        |

Images are rendered with `object-fit: cover`, so any aspect works — the table above
just minimises cropping. Keep each file under ~1 MB (JPEG quality 75–80 is plenty
behind the dark overlay).

The included files were generated from the official artwork in `/artwork`
(`*_portrait.jpg` → small, `*_square.jpg` → medium, `*_landscape.jpg` → large):

```bash
# macOS example (sips is built in)
sips -s format jpeg -s formatOptions 78 -Z 1920 artwork/cover-art/Official_Cover_Art_portrait.jpg  --out public/artwork/cover-art/small.jpg
sips -s format jpeg -s formatOptions 78 -Z 1600 artwork/cover-art/Official_Cover_Art_square.jpg    --out public/artwork/cover-art/medium.jpg
sips -s format jpeg -s formatOptions 80 -Z 2560 artwork/cover-art/Official_Cover_Art_landscape.jpg --out public/artwork/cover-art/large.jpg
```

To change breakpoints or add formats (e.g. WebP/AVIF `<source type>`), edit
`src/components/ArtworkBackground.jsx`.

---

## Region data — `src/data/regions.js`

A list of all 69 official PlayStation Store storefront entries worldwide, sorted A–Z. Each entry:

| Field              | Example                                  | Notes |
| ------------------ | ---------------------------------------- | ----- |
| `country`          | `"United Kingdom"`                       | Display name, used for search |
| `country_code`     | `"GB"`                                   | ISO 3166-1 alpha-2; also drives the flag emoji |
| `region_code`      | `"SIEE"`                                 | `SIEA` Americas · `SIEE` Europe/ME/Africa/Oceania/India · `SIEJ` Japan · `SIEK` Korea · `SIES` SE/East Asia |
| `timezone_label`   | `"GMT (UTC+0)"`                          | Human-readable label shown in the UI |
| `utc_offset_hours` | `0`                                      | Offset **in force on 19 Nov 2026** (DST-aware). Fractions allowed, e.g. India `5.5` |
| `store_url`        | `"https://store.playstation.com/en-gb/"` | Linked once the countdown hits zero |
| `timezones`        | `["Europe/London", …]`                   | IANA zones used for device auto-detection (`"Australia/"` = prefix match) |

**The countdown uses `utc_offset_hours`.** The unlock moment for a region is
`Date.UTC(date at 00:00) − offset` (see `src/utils/countdown.js`).

### Unsupported regions & smart guidance

Sony does not operate native PlayStation Stores in many countries (such as Nigeria, the Philippines, Vietnam, Kenya, or Ghana). For instance, in Africa, only **South Africa** (`en-za`) has a native PlayStation Store.

The app supports players from these countries via:
- **Smart auto-detection**: Players in Nigeria (`Africa/Lagos`) automatically detect their primary account storefront (**United Kingdom / GB** or **United States / US**) instead of arbitrary UTC-offset matches.
- **Region search advisory**: Searching for "Nigeria", "Philippines", "Vietnam", etc. displays a guidance card with 1-click selection for their recommended PlayStation Network storefronts.

### Updating

- **Add a storefront:** append an object to `RAW_REGIONS` — sorting is automatic.
- **Change an offset:** set `utc_offset_hours` to the offset on release day, not
  today's. Countries spanning several zones (US, Canada, Brazil, Mexico, Australia,
  Indonesia…) use the capital / main population centre — e.g. US = Eastern (UTC-5).
- **Release date moves:** change `RELEASE_DATE` / `PRELOAD_DATE` in
  `src/utils/countdown.js`, then re-check DST for the new date across all entries.

If the device's time zone does not have an exact match in the storefronts list or unsupported guide, the app
falls back to the largest store sharing the same UTC offset. The user's choice is
saved in `localStorage`.

---

## Calendar Reminders

Under both **Preloads** and **Releases**, users can click **+ Add to calendar** to schedule a 1-hour event reminder:
- **Google Calendar**: 1-click web deeplink pre-filled with dynamic local times, store details, and direct links.
- **Apple Calendar / Other (.ics)**: Standard RFC 5545 iCalendar download with built-in alarms (1 day and 15 minutes before unlock).
- **Outlook.com & Office 365**: Direct compose deeplinks for personal or work accounts.
- **Accurate time conversion**: All calendar entries use exact UTC instants (`Z`), guaranteeing the event lands at the exact local time displayed on the user's screen.

---

## Project structure

```
public/            favicon.svg, artwork/
src/components/    TabNav, CountdownDisplay, RegionSelector, LocalTimeHint, AddToCalendar, ArtworkBackground, Footer
src/data/          regions.js
src/utils/         countdown.js, calendar.js, timeFormat.js
src/App.jsx        state: active tab, selected region, 1-second ticker
src/App.css        design tokens + all styles
```

---

Fan project by Emeka Chukwulobe. Not affiliated with Rockstar Games or Take-Two Interactive.
Grand Theft Auto and all artwork are trademarks/property of their respective owners.
