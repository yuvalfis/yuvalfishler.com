import styles from "./retro.module.css";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerBadges}>
        <span className={`${styles.footerBadge} ${styles.footerBadgeBest}`}>★ Best Viewed in Netscape ★</span>
        <span className={styles.footerBadge}>Made with Notepad</span>
        <span className={styles.footerBadge}>800×600</span>
        <span className={styles.footerBadge}>HTML 4.01 (probably)</span>
        <span className={styles.footerBadge}>No Cookies, Just Vibes</span>
      </div>
      © 2003–<span suppressHydrationWarning>{year}</span> Yuval Fishler · Tel Aviv, Israel
      <br />
      This page has been lovingly hand-coded and will never be responsive. (it kind of is though.)
      <br />
      <span className={styles.blink} aria-hidden="true">
        ✦
      </span>{" "}
      Thanks 4 visiting — don&apos;t forget to sign the guestbook!{" "}
      <span className={styles.blink} aria-hidden="true">
        ✦
      </span>
    </footer>
  );
}
