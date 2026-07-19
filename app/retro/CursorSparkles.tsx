"use client";

import { useEffect, useRef } from "react";

import styles from "./retro.module.css";
import { useReducedMotion } from "./useReducedMotion";

const CHARACTERS = ["✦", "✧", "★", "∗", "·"];
const COLORS = ["#00e5ff", "#ff2bd6", "#7cff3f", "#ffd23f"];

/** A decorative, throttled sparkle trail that follows the pointer. Skipped for reduced motion. */
export default function CursorSparkles() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastSparkRef = useRef(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return undefined;
    const container = containerRef.current;
    if (!container) return undefined;

    const handleMouseMove = (event: MouseEvent) => {
      const now = Date.now();
      if (now - lastSparkRef.current < 55) return;
      lastSparkRef.current = now;

      const spark = document.createElement("div");
      spark.className = styles.spark;
      spark.textContent = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
      spark.style.left = `${event.clientX}px`;
      spark.style.top = `${event.clientY}px`;
      spark.style.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      container.appendChild(spark);
      setTimeout(() => spark.remove(), 800);
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [reducedMotion]);

  return <div ref={containerRef} aria-hidden="true" />;
}
