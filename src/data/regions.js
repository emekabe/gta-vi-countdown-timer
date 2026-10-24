/**
 * PlayStation Store storefronts and regional storefront entries.
 *
 * `utc_offset_hours` is the offset in force on **19 November 2026** (and 12 Nov):
 *   - Northern hemisphere DST has ended (EU: 25 Oct, US/CA: 1 Nov, IL: 25 Oct).
 *   - Southern hemisphere DST is active: Australia (Sydney) +11, New Zealand +13,
 *     Chile (Santiago) -3.
 *   - No DST: Brazil (abolished 2019), Mexico (abolished 2022), Nigeria (permanent UTC+1),
 *     Paraguay (permanent UTC-3 since Oct 2024), Türkiye (permanent UTC+3).
 * Countries spanning several zones use the zone of the capital / main population centre.
 *
 * `timezones` (extra field) lists IANA zones used for device auto-detection.
 * Entries ending in "/" are prefixes (e.g. "Australia/").
 */

const RAW_REGIONS = [
  // ───────────── SIEA — Americas ─────────────
  { country: 'Argentina', country_code: 'AR', region_code: 'SIEA', timezone_label: 'ART (UTC-3)', utc_offset_hours: -3, store_url: 'https://store.playstation.com/es-ar/', timezones: ['America/Argentina/', 'America/Buenos_Aires', 'America/Cordoba', 'America/Mendoza'] },
  { country: 'Bolivia', country_code: 'BO', region_code: 'SIEA', timezone_label: 'BOT (UTC-4)', utc_offset_hours: -4, store_url: 'https://store.playstation.com/es-bo/', timezones: ['America/La_Paz'] },
  { country: 'Brazil', country_code: 'BR', region_code: 'SIEA', timezone_label: 'BRT (UTC-3)', utc_offset_hours: -3, store_url: 'https://store.playstation.com/pt-br/', timezones: ['America/Sao_Paulo', 'America/Fortaleza', 'America/Recife', 'America/Bahia', 'America/Belem', 'America/Maceio', 'America/Araguaina', 'America/Santarem', 'America/Manaus', 'America/Cuiaba', 'America/Campo_Grande', 'America/Porto_Velho', 'America/Boa_Vista', 'America/Rio_Branco', 'America/Eirunepe', 'America/Noronha', 'Brazil/'] },
  { country: 'Canada', country_code: 'CA', region_code: 'SIEA', timezone_label: 'EST (UTC-5)', utc_offset_hours: -5, store_url: 'https://store.playstation.com/en-ca/', timezones: ['America/Toronto', 'America/Montreal', 'America/Vancouver', 'America/Edmonton', 'America/Calgary', 'America/Winnipeg', 'America/Regina', 'America/Halifax', 'America/St_Johns', 'America/Moncton', 'America/Glace_Bay', 'America/Goose_Bay', 'America/Whitehorse', 'America/Dawson', 'America/Yellowknife', 'America/Iqaluit', 'America/Nipigon', 'America/Thunder_Bay', 'America/Swift_Current', 'America/Rankin_Inlet', 'Canada/'] },
  { country: 'Chile', country_code: 'CL', region_code: 'SIEA', timezone_label: 'CLST (UTC-3)', utc_offset_hours: -3, store_url: 'https://store.playstation.com/es-cl/', timezones: ['America/Santiago', 'America/Punta_Arenas', 'Pacific/Easter', 'Chile/'] },
  { country: 'Colombia', country_code: 'CO', region_code: 'SIEA', timezone_label: 'COT (UTC-5)', utc_offset_hours: -5, store_url: 'https://store.playstation.com/es-co/', timezones: ['America/Bogota'] },
  { country: 'Costa Rica', country_code: 'CR', region_code: 'SIEA', timezone_label: 'CST (UTC-6)', utc_offset_hours: -6, store_url: 'https://store.playstation.com/es-cr/', timezones: ['America/Costa_Rica'] },
  { country: 'Ecuador', country_code: 'EC', region_code: 'SIEA', timezone_label: 'ECT (UTC-5)', utc_offset_hours: -5, store_url: 'https://store.playstation.com/es-ec/', timezones: ['America/Guayaquil', 'Pacific/Galapagos'] },
  { country: 'El Salvador', country_code: 'SV', region_code: 'SIEA', timezone_label: 'CST (UTC-6)', utc_offset_hours: -6, store_url: 'https://store.playstation.com/es-sv/', timezones: ['America/El_Salvador'] },
  { country: 'Guatemala', country_code: 'GT', region_code: 'SIEA', timezone_label: 'CST (UTC-6)', utc_offset_hours: -6, store_url: 'https://store.playstation.com/es-gt/', timezones: ['America/Guatemala'] },
  { country: 'Honduras', country_code: 'HN', region_code: 'SIEA', timezone_label: 'CST (UTC-6)', utc_offset_hours: -6, store_url: 'https://store.playstation.com/es-hn/', timezones: ['America/Tegucigalpa'] },
  { country: 'Mexico', country_code: 'MX', region_code: 'SIEA', timezone_label: 'CST (UTC-6)', utc_offset_hours: -6, store_url: 'https://store.playstation.com/es-mx/', timezones: ['America/Mexico_City', 'America/Monterrey', 'America/Merida', 'America/Cancun', 'America/Matamoros', 'America/Bahia_Banderas', 'America/Chihuahua', 'America/Ciudad_Juarez', 'America/Ojinaga', 'America/Mazatlan', 'America/Hermosillo', 'America/Tijuana', 'America/Ensenada', 'Mexico/'] },
  { country: 'Nicaragua', country_code: 'NI', region_code: 'SIEA', timezone_label: 'CST (UTC-6)', utc_offset_hours: -6, store_url: 'https://store.playstation.com/es-ni/', timezones: ['America/Managua'] },
  { country: 'Panama', country_code: 'PA', region_code: 'SIEA', timezone_label: 'EST (UTC-5)', utc_offset_hours: -5, store_url: 'https://store.playstation.com/es-pa/', timezones: ['America/Panama'] },
  { country: 'Paraguay', country_code: 'PY', region_code: 'SIEA', timezone_label: 'PYT (UTC-3)', utc_offset_hours: -3, store_url: 'https://store.playstation.com/es-py/', timezones: ['America/Asuncion'] },
  { country: 'Peru', country_code: 'PE', region_code: 'SIEA', timezone_label: 'PET (UTC-5)', utc_offset_hours: -5, store_url: 'https://store.playstation.com/es-pe/', timezones: ['America/Lima'] },
  { country: 'United States', country_code: 'US', region_code: 'SIEA', timezone_label: 'EST (UTC-5)', utc_offset_hours: -5, store_url: 'https://store.playstation.com/en-us/', timezones: ['America/New_York', 'America/Detroit', 'America/Indiana/', 'America/Kentucky/', 'America/Louisville', 'America/Indianapolis', 'America/Chicago', 'America/Menominee', 'America/North_Dakota/', 'America/Denver', 'America/Boise', 'America/Phoenix', 'America/Los_Angeles', 'America/Anchorage', 'America/Juneau', 'America/Sitka', 'America/Nome', 'America/Yakutat', 'America/Metlakatla', 'America/Adak', 'Pacific/Honolulu', 'America/Puerto_Rico', 'Pacific/Guam', 'Pacific/Saipan', 'America/St_Thomas', 'US/'] },
  { country: 'Uruguay', country_code: 'UY', region_code: 'SIEA', timezone_label: 'UYT (UTC-3)', utc_offset_hours: -3, store_url: 'https://store.playstation.com/es-uy/', timezones: ['America/Montevideo'] },

  // ───────────── SIEE — Europe, Middle East, Africa, Oceania, India ─────────────
  { country: 'Australia', country_code: 'AU', region_code: 'SIEE', timezone_label: 'AEDT (UTC+11)', utc_offset_hours: 11, store_url: 'https://store.playstation.com/en-au/', timezones: ['Australia/', 'Antarctica/Macquarie'] },
  { country: 'Austria', country_code: 'AT', region_code: 'SIEE', timezone_label: 'CET (UTC+1)', utc_offset_hours: 1, store_url: 'https://store.playstation.com/de-at/', timezones: ['Europe/Vienna'] },
  { country: 'Bahrain', country_code: 'BH', region_code: 'SIEE', timezone_label: 'AST (UTC+3)', utc_offset_hours: 3, store_url: 'https://store.playstation.com/en-bh/', timezones: ['Asia/Bahrain'] },
  { country: 'Belgium', country_code: 'BE', region_code: 'SIEE', timezone_label: 'CET (UTC+1)', utc_offset_hours: 1, store_url: 'https://store.playstation.com/fr-be/', timezones: ['Europe/Brussels'] },
  { country: 'Bulgaria', country_code: 'BG', region_code: 'SIEE', timezone_label: 'EET (UTC+2)', utc_offset_hours: 2, store_url: 'https://store.playstation.com/en-bg/', timezones: ['Europe/Sofia'] },
  { country: 'Croatia', country_code: 'HR', region_code: 'SIEE', timezone_label: 'CET (UTC+1)', utc_offset_hours: 1, store_url: 'https://store.playstation.com/en-hr/', timezones: ['Europe/Zagreb'] },
  { country: 'Cyprus', country_code: 'CY', region_code: 'SIEE', timezone_label: 'EET (UTC+2)', utc_offset_hours: 2, store_url: 'https://store.playstation.com/en-cy/', timezones: ['Asia/Nicosia', 'Europe/Nicosia', 'Asia/Famagusta'] },
  { country: 'Czech Republic', country_code: 'CZ', region_code: 'SIEE', timezone_label: 'CET (UTC+1)', utc_offset_hours: 1, store_url: 'https://store.playstation.com/en-cz/', timezones: ['Europe/Prague'] },
  { country: 'Denmark', country_code: 'DK', region_code: 'SIEE', timezone_label: 'CET (UTC+1)', utc_offset_hours: 1, store_url: 'https://store.playstation.com/da-dk/', timezones: ['Europe/Copenhagen'] },
  { country: 'Finland', country_code: 'FI', region_code: 'SIEE', timezone_label: 'EET (UTC+2)', utc_offset_hours: 2, store_url: 'https://store.playstation.com/fi-fi/', timezones: ['Europe/Helsinki', 'Europe/Mariehamn'] },
  { country: 'France', country_code: 'FR', region_code: 'SIEE', timezone_label: 'CET (UTC+1)', utc_offset_hours: 1, store_url: 'https://store.playstation.com/fr-fr/', timezones: ['Europe/Paris', 'Europe/Monaco'] },
  { country: 'Germany', country_code: 'DE', region_code: 'SIEE', timezone_label: 'CET (UTC+1)', utc_offset_hours: 1, store_url: 'https://store.playstation.com/de-de/', timezones: ['Europe/Berlin', 'Europe/Busingen'] },
  { country: 'Greece', country_code: 'GR', region_code: 'SIEE', timezone_label: 'EET (UTC+2)', utc_offset_hours: 2, store_url: 'https://store.playstation.com/en-gr/', timezones: ['Europe/Athens'] },
  { country: 'Hungary', country_code: 'HU', region_code: 'SIEE', timezone_label: 'CET (UTC+1)', utc_offset_hours: 1, store_url: 'https://store.playstation.com/en-hu/', timezones: ['Europe/Budapest'] },
  { country: 'Iceland', country_code: 'IS', region_code: 'SIEE', timezone_label: 'GMT (UTC+0)', utc_offset_hours: 0, store_url: 'https://store.playstation.com/en-is/', timezones: ['Atlantic/Reykjavik'] },
  { country: 'India', country_code: 'IN', region_code: 'SIEE', timezone_label: 'IST (UTC+5:30)', utc_offset_hours: 5.5, store_url: 'https://store.playstation.com/en-in/', timezones: ['Asia/Kolkata', 'Asia/Calcutta'] },
  { country: 'Ireland', country_code: 'IE', region_code: 'SIEE', timezone_label: 'GMT (UTC+0)', utc_offset_hours: 0, store_url: 'https://store.playstation.com/en-ie/', timezones: ['Europe/Dublin', 'Eire'] },
  { country: 'Israel', country_code: 'IL', region_code: 'SIEE', timezone_label: 'IST (UTC+2)', utc_offset_hours: 2, store_url: 'https://store.playstation.com/en-il/', timezones: ['Asia/Jerusalem', 'Asia/Tel_Aviv', 'Israel'] },
  { country: 'Italy', country_code: 'IT', region_code: 'SIEE', timezone_label: 'CET (UTC+1)', utc_offset_hours: 1, store_url: 'https://store.playstation.com/it-it/', timezones: ['Europe/Rome', 'Europe/San_Marino', 'Europe/Vatican'] },
  { country: 'Kuwait', country_code: 'KW', region_code: 'SIEE', timezone_label: 'AST (UTC+3)', utc_offset_hours: 3, store_url: 'https://store.playstation.com/en-kw/', timezones: ['Asia/Kuwait'] },
  { country: 'Lebanon', country_code: 'LB', region_code: 'SIEE', timezone_label: 'EET (UTC+2)', utc_offset_hours: 2, store_url: 'https://store.playstation.com/en-lb/', timezones: ['Asia/Beirut'] },
  { country: 'Luxembourg', country_code: 'LU', region_code: 'SIEE', timezone_label: 'CET (UTC+1)', utc_offset_hours: 1, store_url: 'https://store.playstation.com/fr-lu/', timezones: ['Europe/Luxembourg'] },
  { country: 'Malta', country_code: 'MT', region_code: 'SIEE', timezone_label: 'CET (UTC+1)', utc_offset_hours: 1, store_url: 'https://store.playstation.com/en-mt/', timezones: ['Europe/Malta'] },
  { country: 'Netherlands', country_code: 'NL', region_code: 'SIEE', timezone_label: 'CET (UTC+1)', utc_offset_hours: 1, store_url: 'https://store.playstation.com/nl-nl/', timezones: ['Europe/Amsterdam'] },
  { country: 'New Zealand', country_code: 'NZ', region_code: 'SIEE', timezone_label: 'NZDT (UTC+13)', utc_offset_hours: 13, store_url: 'https://store.playstation.com/en-nz/', timezones: ['Pacific/Auckland', 'Pacific/Chatham', 'NZ'] },
  { country: 'Nigeria', country_code: 'NG', region_code: 'SIEE', timezone_label: 'WAT (UTC+1)', utc_offset_hours: 1, store_url: 'https://store.playstation.com/en-ng/', timezones: ['Africa/Lagos', 'Africa/Abuja', 'Africa/Porto-Novo', 'Africa/Douala', 'Africa/Kinshasa', 'Africa/Luanda'] },
  { country: 'Norway', country_code: 'NO', region_code: 'SIEE', timezone_label: 'CET (UTC+1)', utc_offset_hours: 1, store_url: 'https://store.playstation.com/no-no/', timezones: ['Europe/Oslo', 'Arctic/Longyearbyen'] },
  { country: 'Oman', country_code: 'OM', region_code: 'SIEE', timezone_label: 'GST (UTC+4)', utc_offset_hours: 4, store_url: 'https://store.playstation.com/en-om/', timezones: ['Asia/Muscat'] },
  { country: 'Poland', country_code: 'PL', region_code: 'SIEE', timezone_label: 'CET (UTC+1)', utc_offset_hours: 1, store_url: 'https://store.playstation.com/pl-pl/', timezones: ['Europe/Warsaw', 'Poland'] },
  { country: 'Portugal', country_code: 'PT', region_code: 'SIEE', timezone_label: 'WET (UTC+0)', utc_offset_hours: 0, store_url: 'https://store.playstation.com/pt-pt/', timezones: ['Europe/Lisbon', 'Atlantic/Madeira', 'Atlantic/Azores', 'Portugal'] },
  { country: 'Qatar', country_code: 'QA', region_code: 'SIEE', timezone_label: 'AST (UTC+3)', utc_offset_hours: 3, store_url: 'https://store.playstation.com/en-qa/', timezones: ['Asia/Qatar'] },
  { country: 'Romania', country_code: 'RO', region_code: 'SIEE', timezone_label: 'EET (UTC+2)', utc_offset_hours: 2, store_url: 'https://store.playstation.com/en-ro/', timezones: ['Europe/Bucharest'] },
  { country: 'Saudi Arabia', country_code: 'SA', region_code: 'SIEE', timezone_label: 'AST (UTC+3)', utc_offset_hours: 3, store_url: 'https://store.playstation.com/en-sa/', timezones: ['Asia/Riyadh'] },
  { country: 'Slovakia', country_code: 'SK', region_code: 'SIEE', timezone_label: 'CET (UTC+1)', utc_offset_hours: 1, store_url: 'https://store.playstation.com/en-sk/', timezones: ['Europe/Bratislava'] },
  { country: 'Slovenia', country_code: 'SI', region_code: 'SIEE', timezone_label: 'CET (UTC+1)', utc_offset_hours: 1, store_url: 'https://store.playstation.com/en-si/', timezones: ['Europe/Ljubljana'] },
  { country: 'South Africa', country_code: 'ZA', region_code: 'SIEE', timezone_label: 'SAST (UTC+2)', utc_offset_hours: 2, store_url: 'https://store.playstation.com/en-za/', timezones: ['Africa/Johannesburg'] },
  { country: 'Spain', country_code: 'ES', region_code: 'SIEE', timezone_label: 'CET (UTC+1)', utc_offset_hours: 1, store_url: 'https://store.playstation.com/es-es/', timezones: ['Europe/Madrid', 'Africa/Ceuta', 'Atlantic/Canary'] },
  { country: 'Sweden', country_code: 'SE', region_code: 'SIEE', timezone_label: 'CET (UTC+1)', utc_offset_hours: 1, store_url: 'https://store.playstation.com/sv-se/', timezones: ['Europe/Stockholm'] },
  { country: 'Switzerland', country_code: 'CH', region_code: 'SIEE', timezone_label: 'CET (UTC+1)', utc_offset_hours: 1, store_url: 'https://store.playstation.com/de-ch/', timezones: ['Europe/Zurich', 'Europe/Vaduz'] },
  { country: 'Turkey', country_code: 'TR', region_code: 'SIEE', timezone_label: 'TRT (UTC+3)', utc_offset_hours: 3, store_url: 'https://store.playstation.com/tr-tr/', timezones: ['Europe/Istanbul', 'Asia/Istanbul', 'Turkey'] },
  { country: 'Ukraine', country_code: 'UA', region_code: 'SIEE', timezone_label: 'EET (UTC+2)', utc_offset_hours: 2, store_url: 'https://store.playstation.com/uk-ua/', timezones: ['Europe/Kyiv', 'Europe/Kiev', 'Europe/Uzhgorod', 'Europe/Zaporozhye'] },
  { country: 'United Arab Emirates', country_code: 'AE', region_code: 'SIEE', timezone_label: 'GST (UTC+4)', utc_offset_hours: 4, store_url: 'https://store.playstation.com/en-ae/', timezones: ['Asia/Dubai'] },
  { country: 'United Kingdom', country_code: 'GB', region_code: 'SIEE', timezone_label: 'GMT (UTC+0)', utc_offset_hours: 0, store_url: 'https://store.playstation.com/en-gb/', timezones: ['Europe/London', 'Europe/Belfast', 'Europe/Guernsey', 'Europe/Jersey', 'Europe/Isle_of_Man', 'GB'] },

  // ───────────── SIEJ — Japan ─────────────
  { country: 'Japan', country_code: 'JP', region_code: 'SIEJ', timezone_label: 'JST (UTC+9)', utc_offset_hours: 9, store_url: 'https://store.playstation.com/ja-jp/', timezones: ['Asia/Tokyo', 'Japan'] },

  // ───────────── SIEK — Korea ─────────────
  { country: 'South Korea', country_code: 'KR', region_code: 'SIEK', timezone_label: 'KST (UTC+9)', utc_offset_hours: 9, store_url: 'https://store.playstation.com/ko-kr/', timezones: ['Asia/Seoul', 'ROK'] },

  // ───────────── SIES — Southeast / East Asia ─────────────
  { country: 'Hong Kong', country_code: 'HK', region_code: 'SIES', timezone_label: 'HKT (UTC+8)', utc_offset_hours: 8, store_url: 'https://store.playstation.com/en-hk/', timezones: ['Asia/Hong_Kong', 'Hongkong', 'Asia/Macau', 'Asia/Macao'] },
  { country: 'Indonesia', country_code: 'ID', region_code: 'SIES', timezone_label: 'WIB (UTC+7)', utc_offset_hours: 7, store_url: 'https://store.playstation.com/en-id/', timezones: ['Asia/Jakarta', 'Asia/Pontianak', 'Asia/Makassar', 'Asia/Jayapura'] },
  { country: 'Malaysia', country_code: 'MY', region_code: 'SIES', timezone_label: 'MYT (UTC+8)', utc_offset_hours: 8, store_url: 'https://store.playstation.com/en-my/', timezones: ['Asia/Kuala_Lumpur', 'Asia/Kuching'] },
  { country: 'Philippines', country_code: 'PH', region_code: 'SIES', timezone_label: 'PST (UTC+8)', utc_offset_hours: 8, store_url: 'https://store.playstation.com/en-ph/', timezones: ['Asia/Manila'] },
  { country: 'Singapore', country_code: 'SG', region_code: 'SIES', timezone_label: 'SGT (UTC+8)', utc_offset_hours: 8, store_url: 'https://store.playstation.com/en-sg/', timezones: ['Asia/Singapore', 'Singapore'] },
  { country: 'Taiwan', country_code: 'TW', region_code: 'SIES', timezone_label: 'TST (UTC+8)', utc_offset_hours: 8, store_url: 'https://store.playstation.com/zh-hant-tw/', timezones: ['Asia/Taipei', 'ROC'] },
  { country: 'Thailand', country_code: 'TH', region_code: 'SIES', timezone_label: 'ICT (UTC+7)', utc_offset_hours: 7, store_url: 'https://store.playstation.com/en-th/', timezones: ['Asia/Bangkok'] },
  { country: 'Vietnam', country_code: 'VN', region_code: 'SIES', timezone_label: 'ICT (UTC+7)', utc_offset_hours: 7, store_url: 'https://store.playstation.com/en-vn/', timezones: ['Asia/Ho_Chi_Minh', 'Asia/Saigon'] },
];

export const regions = [...RAW_REGIONS].sort((a, b) => a.country.localeCompare(b.country, 'en'));

export default regions;

/** "NG" → 🇳🇬 using Unicode regional indicator symbols. */
export function countryCodeToFlag(code) {
  return String.fromCodePoint(...code.toUpperCase().split('').map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}

export function findRegionByCode(code) {
  return regions.find((r) => r.country_code === code) || null;
}

/**
 * Pick the best storefront for this device:
 *   1. exact / prefix match on the IANA zone,
 *   2. otherwise the first region sharing the device's UTC offset on release day,
 *   3. otherwise the United States.
 */
export function detectRegion(releaseDate = '2026-11-19') {
  let zone = '';
  try {
    zone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  } catch {
    /* ignore */
  }

  if (zone) {
    const byZone = regions.find((r) =>
      r.timezones.some((tz) => (tz.endsWith('/') ? zone.startsWith(tz) : zone === tz))
    );
    if (byZone) return byZone;
  }

  const deviceOffset = -new Date(`${releaseDate}T12:00:00Z`).getTimezoneOffset() / 60;
  const sameOffset = regions.filter((r) => r.utc_offset_hours === deviceOffset);
  const preferred = FALLBACK_PRIORITY.map(findRegionByCode).find((r) => r && sameOffset.includes(r));
  return preferred || sameOffset[0] || findRegionByCode('US');
}

// Tie-breaker when the device zone has no storefront of its own (e.g. Africa/Lagos):
// pick the largest market sharing the same UTC offset.
const FALLBACK_PRIORITY = ['US', 'GB', 'DE', 'FR', 'ZA', 'SA', 'AE', 'IN', 'TH', 'SG', 'JP', 'AU', 'NZ', 'BR', 'MX', 'CA'];
