"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";

import styles from "./retro.module.css";
import { scrollToSection } from "./scroll";

type Entry = { name: string; loc: string; msg: string; when: string };

const STORAGE_KEY = "yuval2003_guestbook";
const MAX_ENTRIES = 60;

// Cache the parsed snapshot so useSyncExternalStore gets a stable reference
// when localStorage hasn't actually changed since the last read.
let cachedRaw: string | null = null;
let cachedEntries: Entry[] = [];

function parseEntries(raw: string | null): Entry[] {
  if (raw === cachedRaw) return cachedEntries;
  cachedRaw = raw;
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    cachedEntries = Array.isArray(parsed) ? (parsed as Entry[]) : [];
  } catch {
    cachedEntries = [];
  }
  return cachedEntries;
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot(): Entry[] {
  return parseEntries(window.localStorage.getItem(STORAGE_KEY));
}

function getServerSnapshot(): Entry[] {
  return [];
}

function saveEntries(entries: Entry[]) {
  const trimmed = entries.slice(0, MAX_ENTRIES);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  cachedRaw = null; // force the next external read to re-parse
  return trimmed;
}

/** localStorage-backed guestbook. Entries are rendered as plain JSX — never innerHTML. */
export default function GuestbookSection() {
  const storedEntries = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [ownEntries, setOwnEntries] = useState<Entry[] | null>(null);
  const entries = ownEntries ?? storedEntries;

  const [name, setName] = useState("");
  const [loc, setLoc] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedMsg = msg.trim();
    if (!trimmedName || !trimmedMsg) return;

    const now = new Date();
    const when = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
    const next = saveEntries([{ name: trimmedName, loc: loc.trim(), msg: trimmedMsg, when }, ...entries]);

    setOwnEntries(next);
    setName("");
    setLoc("");
    setMsg("");
    scrollToSection("guestbook");
  };

  return (
    <section id="guestbook" className={styles.section} aria-labelledby="guestbook-heading">
      <h2 id="guestbook-heading">Guestbook</h2>
      <p className={styles.kicker}>{"// part of the CREATIVE-TECHNOLOGISTS ring //"}</p>

      <form className={styles.guestbookForm} onSubmit={handleSubmit}>
        <div className={styles.formRow}>
          <div>
            <label htmlFor="gbName">Your Name / Handle</label>
            <input
              id="gbName"
              maxLength={40}
              placeholder="xX_webmaster_Xx"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="gbLoc">Where U From?</label>
            <input
              id="gbLoc"
              maxLength={40}
              placeholder="somewhere on dial-up"
              value={loc}
              onChange={(event) => setLoc(event.target.value)}
            />
          </div>
        </div>
        <label htmlFor="gbMsg">Leave a Message</label>
        <textarea
          id="gbMsg"
          maxLength={280}
          placeholder="cool site! how did u make the star background??"
          required
          value={msg}
          onChange={(event) => setMsg(event.target.value)}
        />
        <button className={styles.guestbookSubmit} type="submit">
          ✎ Sign My Guestbook
        </button>
      </form>

      <div className={styles.guestbookList} aria-live="polite">
        {entries.length === 0 ? (
          <div className={styles.guestbookEntry}>
            <div className={styles.entryTop}>
              <span className={styles.entryName}>Yuval (webmaster)</span>
              <span className={styles.entryWhen}>day one</span>
            </div>
            <p className={styles.entryMessage}>Welcome to my guestbook! Be the first human to sign it. 🌊</p>
          </div>
        ) : (
          entries.map((entry, index) => (
            <div className={styles.guestbookEntry} key={`${entry.when}-${index}`}>
              <div className={styles.entryTop}>
                <span>
                  <span className={styles.entryName}>{entry.name}</span>
                  {entry.loc ? <span className={styles.entryLocation}> @ {entry.loc}</span> : null}
                </span>
                <span className={styles.entryWhen}>{entry.when}</span>
              </div>
              <p className={styles.entryMessage}>{entry.msg}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
