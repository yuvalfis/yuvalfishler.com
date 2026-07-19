import type { Metadata } from "next";

import RetroHome from "./retro/RetroHome";

const siteUrl = "https://yuvalfishler.com/";
const title = "~yuval~ :: Official HomePage :: [ENTER]";
const description = "Yuval Fishler's Official Homepage :: code, startups & systems :: est. 2003";

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
        alt: "Yuval Fishler's neon-on-black 2003 personal homepage, complete with a starfield background and a pixel-art avatar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: {
      url: "/social-card.svg",
      alt: "Yuval Fishler's neon-on-black 2003 personal homepage, complete with a starfield background and a pixel-art avatar",
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

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <RetroHome />
    </>
  );
}
