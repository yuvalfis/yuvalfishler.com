"use client";

import { useRef, useState } from "react";

import AboutSection from "./AboutSection";
import BackToTop from "./BackToTop";
import ContactSection from "./ContactSection";
import CursorSparkles from "./CursorSparkles";
import GuestbookSection from "./GuestbookSection";
import HobbiesSection from "./HobbiesSection";
import HomeHero from "./HomeHero";
import NewsTicker from "./NewsTicker";
import ResumeSection from "./ResumeSection";
import styles from "./retro.module.css";
import Sidebar from "./Sidebar";
import SiteFooter from "./SiteFooter";
import SkillsSection from "./SkillsSection";
import SplashIntro from "./SplashIntro";

/** The full 2003-shrine homepage experience: splash, frameset, ticker, and every section. */
export default function RetroHome() {
  const homeRef = useRef<HTMLElement>(null);
  const [hasEntered, setHasEntered] = useState(false);

  const handleEnter = () => {
    setHasEntered(true);
    homeRef.current?.focus({ preventScroll: true });
  };

  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#home">
        Skip to content
      </a>

      <SplashIntro onEnter={handleEnter} />

      <div className={styles.shell}>
        <NewsTicker />

        <div className={styles.construction}>
          🚧 <span className={styles.constructionLabel}>THIS SITE IS ETERNALLY UNDER CONSTRUCTION</span> 🚧{" "}
          (aren&apos;t we all?)
        </div>

        <Sidebar hasEntered={hasEntered} />

        <main className={styles.frameR}>
          <HomeHero sectionRef={homeRef} />
          <AboutSection />
          <ResumeSection />
          <SkillsSection />
          <HobbiesSection />
          <GuestbookSection />
          <ContactSection />
        </main>

        <SiteFooter />
      </div>

      <BackToTop />
      <CursorSparkles />
    </div>
  );
}
