"use client";

import ChiptunePlayer from "./ChiptunePlayer";
import PixelAvatar from "./PixelAvatar";
import styles from "./retro.module.css";
import { scrollToSection } from "./scroll";
import VisitorCounter from "./VisitorCounter";

const NAV_ITEMS = [
  { id: "home", label: "Home Base" },
  { id: "about", label: "About Me" },
  { id: "resume", label: "My Résumé" },
  { id: "skills", label: "Skillz" },
  { id: "hobbies", label: "Hobbies" },
  { id: "guestbook", label: "Guestbook" },
  { id: "contact", label: "Contact" },
];

type SidebarProps = {
  hasEntered: boolean;
};

/** The fake left-frame: identity badge, pixel avatar, section nav, and widgets. */
export default function Sidebar({ hasEntered }: SidebarProps) {
  return (
    <aside className={styles.frameL} aria-label="Sidebar navigation and widgets">
      <div className={styles.badge}>
        <p className={styles.badgeName}>YUVAL.EXE</p>
        <p className={styles.badgeSub}>TEL AVIV · ISRAEL</p>
      </div>

      <PixelAvatar />
      <p className={styles.avatarCaption}>~ that&apos;s me! (webcam &apos;03) ~</p>

      <p className={styles.navTitle}>:: NAVIGATION ::</p>
      <nav aria-label="Section navigation">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={styles.navButton}
            onClick={() => scrollToSection(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className={styles.widget}>
        <p className={styles.widgetTitle}>Visitor Counter</p>
        <VisitorCounter />
        <p className={styles.counterLabel}>YOU ARE VISITOR!</p>
      </div>

      <div className={`${styles.widget} ${styles.widgetBare}`}>
        <ChiptunePlayer hasEntered={hasEntered} />
      </div>
    </aside>
  );
}
