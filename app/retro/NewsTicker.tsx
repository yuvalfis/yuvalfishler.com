import styles from "./retro.module.css";

function TickerMessage({ hidden }: { hidden?: boolean }) {
  return (
    <span className={styles.tickerMessage} aria-hidden={hidden || undefined}>
      🚨 <b>BREAKING:</b> Yuval upgraded from <span className={styles.hot}>software engineer</span> to{" "}
      <span className={styles.hot}>startup CTO</span> to{" "}
      <span className={styles.hot}>founding engineer</span> — nobody saw it coming &nbsp;★&nbsp; NEW! Sign
      the <b>guestbook</b> ↙ &nbsp;★&nbsp; This site is 100% Flash-powered (not really) &nbsp;★&nbsp; Now
      with 30% more neon &nbsp;★&nbsp; Y2K survivor since ▓ 2000 ▓ &nbsp;★&nbsp; 🎸 Currently vibing to a
      MIDI in the left frame → press PLAY
    </span>
  );
}

/**
 * An accessible replacement for the obsolete `<marquee>` tag: a CSS-driven
 * infinite scroll that pauses on hover or keyboard focus, and freezes
 * completely under `prefers-reduced-motion` (handled globally in the module).
 */
export default function NewsTicker() {
  return (
    <div className={styles.tickerBar}>
      <div
        className={styles.tickerViewport}
        role="group"
        aria-label="Site news ticker — hover or focus to pause"
        tabIndex={0}
      >
        <div className={styles.tickerTrack}>
          <TickerMessage />
          <TickerMessage hidden />
        </div>
      </div>
    </div>
  );
}
