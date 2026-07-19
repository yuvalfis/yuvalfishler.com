"use client";

import { useEffect, useRef, useState } from "react";

import { skills } from "./data";
import styles from "./retro.module.css";

export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimated(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.25 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="skills-heading"
    >
      <h2 id="skills-heading">Skillz</h2>
      <p className={styles.kicker}>
        {"// loading skill bars ... please wait (they animate, promise) //"}
      </p>
      <div className={styles.skills}>
        {skills.map(([label, percent]) => (
          <div className={styles.skill} key={label}>
            <div className={styles.skillLabelRow}>
              <span>{label}</span>
              <span className={styles.skillPercent}>{percent}%</span>
            </div>
            <div
              className={styles.barTrack}
              role="progressbar"
              aria-label={label}
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <span className={styles.barFill} style={{ width: animated ? `${percent}%` : "0%" }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
