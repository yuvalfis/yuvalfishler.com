import { hobbies } from "./data";
import styles from "./retro.module.css";

export default function HobbiesSection() {
  return (
    <section id="hobbies" className={styles.section} aria-labelledby="hobbies-heading">
      <h2 id="hobbies-heading">Hobbies</h2>
      <p className={styles.kicker}>{"// what I do when the compiler is done //"}</p>
      <ul className={styles.chips}>
        {hobbies.map((hobby) => (
          <li key={hobby} className={styles.chip}>
            {hobby}
          </li>
        ))}
      </ul>
      <p className={styles.hobbiesNote}>&gt; hover the chips. yes, they wiggle.</p>
    </section>
  );
}
