import styles from "./retro.module.css";

export default function AboutSection() {
  return (
    <section id="about" className={styles.section} aria-labelledby="about-heading">
      <h2 id="about-heading">About Me</h2>
      <p className={styles.kicker}>{"// the human behind the .exe //"}</p>
      <p className={styles.lead}>
        I&apos;m a <b className={styles.cyanText}>creative technologist and multidisciplinary builder</b> — a
        decade spent leading teams, architecting complex platforms, and shipping products across AI,
        blockchain, analytics, and communication systems.
      </p>
      <p>
        Having worked in <b className={styles.magentaText}>high-intensity, high-stakes environments</b> —
        from <b className={styles.magentaText}>startup leadership</b> to shipping under real deadlines —
        I&apos;m especially drawn to problems about people, systems, identity, and human behavior.
      </p>
      <p className={styles.terminalNote}>
        &gt; TL;DR: I build systems by day, and tell human stories by night.
      </p>
    </section>
  );
}
