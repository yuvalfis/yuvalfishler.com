import styles from "./retro.module.css";

export default function ContactSection() {
  return (
    <section
      id="contact"
      className={`${styles.section} ${styles.sectionNoBorder}`}
      aria-labelledby="contact-heading"
    >
      <h2 id="contact-heading">Contact</h2>
      <p className={styles.kicker}>{"// beam me a message · no ICQ, sorry //"}</p>
      <div className={styles.contactBox}>
        <p className={styles.mailLink}>
          <a href="mailto:yuvalfis@gmail.com">📧 yuvalfis@gmail.com</a>
        </p>
        <p>
          <a href="tel:+972547308809">☎ +972-54-730-8809</a>
        </p>
        <p className={styles.contactLocation}>📍 Tel Aviv, Israel</p>
        <p className={styles.contactNote}>
          response time: faster than a 56k handshake · slower than a page full of GIFs loading
        </p>
      </div>
    </section>
  );
}
