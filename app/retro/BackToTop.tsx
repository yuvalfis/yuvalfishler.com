"use client";

import { useEffect, useState } from "react";

import styles from "./retro.module.css";
import { scrollToTop } from "./scroll";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.pageYOffset > 400);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button type="button" className={styles.toTop} onClick={scrollToTop} title="back to top">
      <span aria-hidden="true">🚀</span>
      <span className="sr-only">Back to top</span>
    </button>
  );
}
