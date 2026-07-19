import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const requiredFiles = [
  "app/globals.css",
  "app/layout.tsx",
  "app/not-found.tsx",
  "app/page.tsx",
  "app/robots.ts",
  "app/sitemap.ts",
  "eslint.config.mjs",
  "next.config.ts",
  "package-lock.json",
  "package.json",
  "public/favicon.svg",
  "public/social-card.svg",
  "tsconfig.json",
];

test("the production Next.js structure and public assets exist", () => {
  for (const path of requiredFiles) {
    assert.equal(existsSync(new URL(`../${path}`, import.meta.url)), true, `missing ${path}`);
  }
});

test("package scripts cover the required quality gates", () => {
  const packageJson = JSON.parse(read("package.json"));

  assert.equal(packageJson.private, true);
  assert.deepEqual(packageJson.scripts, {
    dev: "next dev",
    build: "next build",
    start: "next start",
    test: "node --test tests/*.test.mjs",
    lint: "eslint .",
    typecheck: "tsc --noEmit",
  });
  assert.ok(packageJson.dependencies.next);
  assert.ok(packageJson.dependencies.react);
  assert.ok(packageJson.dependencies["react-dom"]);
  assert.ok(packageJson.devDependencies.typescript);
  assert.equal(packageJson.overrides.postcss, "8.5.10");
});

test("metadata is scoped between the site-wide layout and home page", () => {
  const layout = read("app/layout.tsx");
  const page = read("app/page.tsx");

  for (const fact of [
    "https://yuvalfishler.com/",
    "#f3efe6",
    'lang="en"',
    '"/favicon.svg"',
  ]) {
    assert.match(layout, new RegExp(fact.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  for (const homepageFact of [
    "Yuval Fishler — Personal Website",
    "The personal website of Yuval Fishler. Get in touch by email or find Yuval on GitHub.",
    'authors: [{ name: "Yuval Fishler" }]',
    "alternates: { canonical: \"/\" }",
    "openGraph:",
    'siteName: "Yuval Fishler"',
    'url: "/social-card.svg"',
    "Yuval Fishler on a warm neutral background",
    "twitter:",
    "summary_large_image",
    'type="application/ld+json"',
    '"@type": "Person"',
    'email: "mailto:yuvalfis@gmail.com"',
    '"https://github.com/yuvalfis"',
  ]) {
    const pattern = new RegExp(homepageFact.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    assert.doesNotMatch(layout, pattern);
    assert.match(page, pattern);
  }
});

test("the home page keeps approved content, links, and accessibility landmarks", () => {
  const page = read("app/page.tsx");

  for (const fact of [
    "Yuval Fishler",
    "A personal corner of the web.",
    "Hello from",
    "Let’s talk.",
    'href="mailto:yuvalfis@gmail.com"',
    'href="https://github.com/yuvalfis"',
    'rel="me noopener noreferrer"',
    'href="#main-content"',
    'id="main-content"',
    'id="about"',
    'id="contact"',
    "opens in a new tab",
  ]) {
    assert.match(page, new RegExp(fact.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.doesNotMatch(page, /["']use client["']/);
});

test("the custom not-found route retains its design and is noindex", () => {
  const notFound = read("app/not-found.tsx");

  assert.match(notFound, /Error 404/);
  assert.match(notFound, /Lost\?/);
  assert.match(notFound, /This page doesn’t exist/);
  assert.match(notFound, /Return home/);
  assert.match(notFound, /robots: \{ index: false \}/);
});

test("robots and sitemap expose the canonical production routes", () => {
  const robots = read("app/robots.ts");
  const sitemap = read("app/sitemap.ts");

  assert.match(robots, /userAgent: "\*"/);
  assert.match(robots, /allow: "\/"/);
  assert.match(robots, /https:\/\/yuvalfishler\.com\/sitemap\.xml/);
  assert.match(sitemap, /https:\/\/yuvalfishler\.com\//);
  assert.match(sitemap, /changeFrequency: "monthly"/);
  assert.match(sitemap, /priority: 1/);
});

test("global styles retain responsive, focus, and reduced-motion behavior", () => {
  const css = read("app/globals.css");

  assert.match(css, /@media \(max-width: 700px\)/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion: reduce/);
});

test("obsolete static entry and generated crawler files are removed", () => {
  for (const path of ["index.html", "404.html", "styles.css", "robots.txt", "sitemap.xml", "verify.py"]) {
    assert.equal(existsSync(new URL(`../${path}`, import.meta.url)), false, `${path} should be removed`);
  }
});
