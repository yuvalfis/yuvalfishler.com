import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found — Yuval Fishler",
  description: "The requested page could not be found on Yuval Fishler's personal website.",
  robots: { index: false },
};

const ArrowRight = () => (
  <svg aria-hidden="true" viewBox="0 0 20 20" width="20" height="20">
    <path
      d="M4 10h12M11 5l5 5-5 5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
  </svg>
);

export default function NotFound() {
  return (
    <>
      <div className="error-page">
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <div className="site-shell">
          <header className="site-header">
            <Link className="wordmark" href="/" aria-label="Yuval Fishler, home">
              <span className="wordmark-mark" aria-hidden="true">
                YF
              </span>
              <span>yuvalfishler.com</span>
            </Link>
          </header>

          <main className="error-main" id="main-content">
            <div>
              <p className="error-code">Error 404</p>
              <h1>Lost?</h1>
              <p className="error-message">This page doesn’t exist, but the way home is close by.</p>
              <Link className="button button-primary" href="/">
                <span>Return home</span>
                <ArrowRight />
              </Link>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
