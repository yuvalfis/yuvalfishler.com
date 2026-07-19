import type { Metadata } from "next";
import Link from "next/link";

const siteUrl = "https://yuvalfishler.com/";
const title = "Yuval Fishler — Personal Website";
const description =
  "The personal website of Yuval Fishler. Get in touch by email or find Yuval on GitHub.";

export const metadata: Metadata = {
  title,
  description,
  authors: [{ name: "Yuval Fishler" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Yuval Fishler",
    title,
    description,
    url: "/",
    images: [
      {
        url: "/social-card.svg",
        type: "image/svg+xml",
        width: 1200,
        height: 630,
        alt: "Yuval Fishler on a warm neutral background",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: {
      url: "/social-card.svg",
      alt: "Yuval Fishler on a warm neutral background",
    },
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Yuval Fishler",
  url: siteUrl,
  email: "mailto:yuvalfis@gmail.com",
  sameAs: ["https://github.com/yuvalfis"],
};

const ArrowRight = ({ size = 20 }: { size?: number }) => (
  <svg aria-hidden="true" viewBox="0 0 20 20" width={size} height={size}>
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

const ArrowUpRight = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24">
    <path
      d="M5 19 19 5M9 5h10v10"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
  </svg>
);

const GitHubMark = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
    <path
      fill="currentColor"
      d="M12 .7a11.5 11.5 0 0 0-3.64 22.4c.58.1.79-.25.79-.56v-2.23c-3.23.7-3.91-1.37-3.91-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.77 2.72 1.26 3.38.96.1-.75.4-1.26.74-1.55-2.58-.29-5.29-1.29-5.29-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.16 1.18a10.98 10.98 0 0 1 5.76 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.4-2.72 5.38-5.3 5.67.42.36.79 1.06.79 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .7Z"
    />
  </svg>
);

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <div className="site-shell">
        <header className="site-header" aria-label="Site header">
          <Link className="wordmark" href="/" aria-label="Yuval Fishler, home">
            <span className="wordmark-mark" aria-hidden="true">
              YF
            </span>
            <span>yuvalfishler.com</span>
          </Link>

          <nav aria-label="Primary navigation">
            <ul className="nav-list">
              <li>
                <a href="#about">About</a>
              </li>
              <li>
                <a href="#contact">Contact</a>
              </li>
            </ul>
          </nav>
        </header>

        <main id="main-content">
          <section className="hero" aria-labelledby="hero-title">
            <div className="hero-copy">
              <p className="eyebrow">
                <span aria-hidden="true" /> Personal website
              </p>
              <h1 id="hero-title">
                Yuval
                <br />
                <em>Fishler.</em>
              </h1>
              <p className="hero-intro">
                A personal corner of the web. For a conversation, a question, or a simple hello,
                you can reach Yuval directly.
              </p>

              <div className="hero-actions" aria-label="Contact links">
                <a className="button button-primary" href="mailto:yuvalfis@gmail.com">
                  <span>Get in touch</span>
                  <ArrowRight />
                </a>
                <a
                  className="button button-secondary"
                  href="https://github.com/yuvalfis"
                  target="_blank"
                  rel="me noopener noreferrer"
                >
                  <GitHubMark />
                  <span>View GitHub</span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>
            </div>

            <div className="hero-art" aria-hidden="true">
              <div className="monogram">YF</div>
              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <div className="art-dot art-dot-one" />
              <div className="art-dot art-dot-two" />
            </div>
          </section>

          <section className="about-section" id="about" aria-labelledby="about-title">
            <p className="section-label">01 / About</p>
            <div className="about-copy">
              <h2 id="about-title">
                Hello from
                <br />
                this side of the screen.
              </h2>
              <p>
                This is the home of Yuval Fishler on the web—a simple place to connect and find
                the links that matter. More may appear here over time.
              </p>
            </div>
          </section>

          <section className="contact-section" id="contact" aria-labelledby="contact-title">
            <div className="contact-heading">
              <p className="section-label">02 / Contact</p>
              <h2 id="contact-title">Let’s talk.</h2>
            </div>

            <div className="contact-links">
              <a className="contact-row" href="mailto:yuvalfis@gmail.com">
                <span className="contact-meta">Email</span>
                <span className="contact-value">yuvalfis@gmail.com</span>
                <ArrowUpRight />
              </a>
              <a
                className="contact-row"
                href="https://github.com/yuvalfis"
                target="_blank"
                rel="me noopener noreferrer"
              >
                <span className="contact-meta">GitHub</span>
                <span className="contact-value">github.com/yuvalfis</span>
                <ArrowUpRight />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </section>
        </main>

        <footer className="site-footer">
          <p>Yuval Fishler</p>
          <a href="#main-content">
            Back to top <span aria-hidden="true">↑</span>
          </a>
        </footer>
      </div>
    </>
  );
}
