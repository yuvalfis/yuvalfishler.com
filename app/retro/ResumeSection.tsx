import { resumeJobs } from "./data";
import styles from "./retro.module.css";

export default function ResumeSection() {
  return (
    <section id="resume" className={styles.section} aria-labelledby="resume-heading">
      <h2 id="resume-heading">My Résumé</h2>
      <p className={styles.kicker}>
        {"// professional experience · reverse-chronological, like a good edit //"}
      </p>

      {resumeJobs.map((job) => (
        <article key={job.id} className={styles.job}>
          <header className={styles.jobHead}>
            <span>
              <span className={styles.jobRole}>{job.role}</span>
              {job.company ? (
                <>
                  {" "}
                  · <span className={styles.jobCompany}>{job.company}</span>
                </>
              ) : null}
            </span>
            <span className={styles.jobYear}>{job.years}</span>
          </header>
          <ul>
            {job.bullets.map((bullet, index) => (
              <li key={index}>{bullet}</li>
            ))}
          </ul>
        </article>
      ))}
    </section>
  );
}
