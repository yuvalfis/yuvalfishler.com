import type { RefObject } from "react";

import styles from "./retro.module.css";
import RoleTyper from "./RoleTyper";

type HomeHeroProps = {
  sectionRef: RefObject<HTMLElement | null>;
};

/** The "home base" section: the only true `<h1>` on the page, once the splash is gone. */
export default function HomeHero({ sectionRef }: HomeHeroProps) {
  return (
    <section
      id="home"
      ref={sectionRef}
      tabIndex={-1}
      className={styles.section}
      aria-labelledby="home-heading"
    >
      <div className={styles.hero}>
        <h1 className={styles.heroTitle} id="home-heading">
          WELCOME 2 MY
          <br />
          <em>CORNER OF THE WEB</em>
        </h1>
        <p className={styles.wordArt}>★ Creative Technologist &amp; Multidisciplinary Builder ★</p>
        <RoleTyper />
      </div>
    </section>
  );
}
