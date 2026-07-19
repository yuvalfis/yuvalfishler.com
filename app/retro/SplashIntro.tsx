"use client";

import { useEffect, useRef, useState } from "react";

import styles from "./retro.module.css";

type SplashIntroProps = {
  onEnter: () => void;
};

/** The Flash-era loading splash: a fake progress readout and an ENTER/skip pair. */
export default function SplashIntro({ onEnter }: SplashIntroProps) {
  const [percent, setPercent] = useState(0);
  const [gone, setGone] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const enteredRef = useRef(false);

  useEffect(() => {
    if (percent >= 100) return undefined;
    const id = setTimeout(() => {
      setPercent((current) => Math.min(100, current + Math.floor(Math.random() * 11) + 4));
    }, 300);
    return () => clearTimeout(id);
  }, [percent]);

  const handleEnter = () => {
    if (enteredRef.current) return;
    enteredRef.current = true;
    setGone(true);
    onEnter();
    setTimeout(() => setDismissed(true), 850);
  };

  if (dismissed) return null;

  return (
    <div
      className={`${styles.splash} ${gone ? styles.splashGone : ""}`}
      inert={gone || undefined}
    >
      <div className={styles.splashGrid} aria-hidden="true" />
      <h1 className={styles.splashName}>
        YUVAL <span className={styles.highlight}>FISHLER</span>
      </h1>
      <p className={styles.splashTag}>{"// a macromedia flash™ experience //"}</p>
      <div className={styles.loadBar}>
        <span className={styles.loadBarFill} />
      </div>
      <p className={styles.loadText} role="status">
        {percent >= 100 ? "READY. CLICK ENTER ►" : `LOADING FLASH PLAYER 6 ... ${percent}%`}
      </p>
      <div className={styles.splashButtons}>
        <button type="button" className={styles.splashButtonSkip} onClick={handleEnter}>
          skip intro &gt;&gt;
        </button>
        <button type="button" className={styles.splashButtonPrimary} onClick={handleEnter}>
          ENTER &gt;&gt;
        </button>
      </div>
      <p className={styles.splashNote}>
        best viewed in Netscape 7 @ 800×600 · 56k warning: this page rules
      </p>
    </div>
  );
}
