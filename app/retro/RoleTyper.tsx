"use client";

import { useEffect, useState } from "react";

import { roleTyperRoles } from "./data";
import styles from "./retro.module.css";

/** The boxed "> I am a ..." typewriter identity plaque in the hero. */
export default function RoleTyper() {
  const [text, setText] = useState("");

  useEffect(() => {
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const tick = () => {
      const word = roleTyperRoles[roleIndex];
      setText(word.substring(0, charIndex));
      if (!deleting) {
        if (charIndex < word.length) {
          charIndex += 1;
          timeoutId = setTimeout(tick, 70);
        } else {
          deleting = true;
          timeoutId = setTimeout(tick, 1300);
        }
      } else if (charIndex > 0) {
        charIndex -= 1;
        timeoutId = setTimeout(tick, 34);
      } else {
        deleting = false;
        roleIndex = (roleIndex + 1) % roleTyperRoles.length;
        timeoutId = setTimeout(tick, 340);
      }
    };

    timeoutId = setTimeout(tick, 70);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className={styles.typer}>
      <span className={styles.typerPrefix}>&gt; I am a</span>
      <span className={styles.typerText} role="status">
        {text}
      </span>
      <span className={styles.typerCaret} aria-hidden="true">
        ▊
      </span>
    </div>
  );
}
