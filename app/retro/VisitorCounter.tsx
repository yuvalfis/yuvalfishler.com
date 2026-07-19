"use client";

import { useSyncExternalStore } from "react";

import styles from "./retro.module.css";

const STORAGE_KEY = "yuval2003_visits";
const DIGIT_COUNT = 7;

// Computed and persisted exactly once per page load, then cached: this is a
// counter increment (a write), not a pure read, so it must not re-run on
// every render or on React's Strict Mode double-invoke in development.
let cachedDigits: string[] | null = null;

function computeDigits(): string[] {
  if (cachedDigits) return cachedDigits;
  let count = parseInt(window.localStorage.getItem(STORAGE_KEY) || "0", 10);
  if (!count) {
    count = 130000 + Math.floor(Math.random() * 7000);
  }
  count += 1;
  window.localStorage.setItem(STORAGE_KEY, String(count));
  cachedDigits = String(count).padStart(DIGIT_COUNT, "0").split("");
  return cachedDigits;
}

function subscribe() {
  return () => undefined;
}

function getServerSnapshot(): string[] {
  return Array(DIGIT_COUNT).fill("0");
}

/** A persisted, odometer-style hit counter — seeded with a believable 2003 number. */
export default function VisitorCounter() {
  const digits = useSyncExternalStore(subscribe, computeDigits, getServerSnapshot);

  return (
    <div className={styles.counter} aria-label={`You are visitor number ${digits.join("")}`}>
      {digits.map((digit, index) => (
        <span key={index} className={styles.counterDigit} aria-hidden="true">
          {digit}
        </span>
      ))}
    </div>
  );
}
