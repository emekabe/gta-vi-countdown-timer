/**
 * Full-bleed fixed artwork layer.
 *
 * Expects three files in `public/artwork/<folder>/`:
 *   small.jpg  — portrait phones   (≈1080×1920)
 *   medium.jpg — tablets / landscape phones (≈1600×1600)
 *   large.jpg  — desktop           (≈2560×1440)
 *
 * Both tabs mount their own instance at all times; only `active` toggles opacity,
 * so switching tabs is a pure 600ms crossfade with no re-download or remount.
 */
const BASE = import.meta.env.BASE_URL;

export default function ArtworkBackground({ folder, active }) {
  const src = (size) => `${BASE}artwork/${folder}/${size}.jpg`;

  return (
    <div
      className={`artwork${active ? ' artwork--active' : ''}`}
      aria-hidden="true"
      data-folder={folder}
    >
      <picture className="artwork__picture">
        <source media="(max-width: 767px) and (orientation: portrait)" srcSet={src('small')} />
        <source media="(max-width: 1279px)" srcSet={src('medium')} />
        <img
          className="artwork__img"
          src={src('large')}
          alt=""
          decoding="async"
          fetchPriority={active ? 'high' : 'low'}
          draggable="false"
        />
      </picture>
      <div className="artwork__overlay" />
    </div>
  );
}
