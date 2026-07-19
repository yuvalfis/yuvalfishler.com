import styles from "./retro.module.css";

/** Pure inline SVG pixel-art avatar — zero external image assets, matches the 2003 aesthetic. */
export default function PixelAvatar() {
  return (
    <svg
      className={styles.avatar}
      viewBox="0 0 16 16"
      width={180}
      height={180}
      role="img"
      aria-label="Pixel-art portrait of Yuval wearing headphones"
    >
      <rect width="16" height="16" fill="#0a0620" />
      {/* headphones band */}
      <rect x="4" y="1" width="8" height="1" fill="#00e5ff" />
      <rect x="3" y="2" width="1" height="2" fill="#00e5ff" />
      <rect x="12" y="2" width="1" height="2" fill="#00e5ff" />
      {/* ear cups */}
      <rect x="2" y="4" width="2" height="4" fill="#ff2bd6" />
      <rect x="12" y="4" width="2" height="4" fill="#ff2bd6" />
      {/* face */}
      <rect x="4" y="3" width="8" height="9" fill="#e9c9a8" />
      <rect x="4" y="3" width="8" height="1" fill="#f3d9be" />
      {/* hair */}
      <rect x="4" y="2" width="8" height="2" fill="#2b1c12" />
      <rect x="4" y="3" width="1" height="1" fill="#2b1c12" />
      <rect x="11" y="3" width="1" height="1" fill="#2b1c12" />
      {/* dither shadow cheek */}
      <rect x="10" y="6" width="1" height="1" fill="#cbab8a" />
      <rect x="11" y="7" width="1" height="1" fill="#cbab8a" />
      <rect x="5" y="7" width="1" height="1" fill="#cbab8a" />
      {/* eyes */}
      <rect x="6" y="6" width="1" height="1" fill="#05010a" />
      <rect x="9" y="6" width="1" height="1" fill="#05010a" />
      <rect x="6" y="5" width="1" height="1" fill="#7cff3f" />
      <rect x="9" y="5" width="1" height="1" fill="#7cff3f" />
      {/* nose + smirk */}
      <rect x="8" y="8" width="1" height="1" fill="#cbab8a" />
      <rect x="6" y="9" width="3" height="1" fill="#8a4a3a" />
      <rect x="9" y="10" width="1" height="1" fill="#8a4a3a" />
      {/* neck + collar */}
      <rect x="6" y="12" width="4" height="1" fill="#d8b896" />
      <rect x="4" y="13" width="8" height="3" fill="#12002b" />
      <rect x="7" y="13" width="2" height="3" fill="#00e5ff" />
    </svg>
  );
}
