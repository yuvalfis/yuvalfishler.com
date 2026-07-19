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
  "app/retro/RetroHome.tsx",
  "app/retro/retro.module.css",
  "app/retro/data.tsx",
  "app/retro/GuestbookSection.tsx",
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
    "#05010a",
    'lang="en"',
    '"/favicon.svg"',
  ]) {
    assert.match(layout, new RegExp(fact.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  for (const homepageFact of [
    "~yuval~ :: Official HomePage :: [ENTER]",
    "Yuval Fishler's Official Homepage :: code, startups & systems :: est. 2003",
    'authors: [{ name: "Yuval Fishler" }]',
    "alternates: { canonical: \"/\" }",
    "openGraph:",
    'siteName: "Yuval Fishler"',
    'url: "/social-card.svg"',
    "Yuval Fishler's neon-on-black 2003 personal homepage",
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

test("the home page renders the retro shrine and stays a server component", () => {
  const page = read("app/page.tsx");

  for (const fact of [
    'import RetroHome from "./retro/RetroHome"',
    '"@type": "Person"',
    'email: "mailto:yuvalfis@gmail.com"',
    '"https://github.com/yuvalfis"',
    "<RetroHome />",
  ]) {
    assert.match(page, new RegExp(fact.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.doesNotMatch(page, /["']use client["']/);
});

test("the retro homepage preserves 2003 content, sections, and safe guestbook rendering", () => {
  const retroHome = read("app/retro/RetroHome.tsx");
  const homeHero = read("app/retro/HomeHero.tsx");
  const sidebar = read("app/retro/Sidebar.tsx");
  const guestbook = read("app/retro/GuestbookSection.tsx");
  const resumeData = read("app/retro/data.tsx");
  const cssModule = read("app/retro/retro.module.css");

  assert.match(retroHome, /skipLink/);
  assert.match(retroHome, /href="#home"/);
  assert.match(homeHero, /WELCOME 2 MY/);
  assert.match(homeHero, /CORNER OF THE WEB/);
  assert.match(sidebar, /YUVAL\.EXE/);
  assert.match(sidebar, /Home Base/);
  assert.match(sidebar, /Guestbook/);
  assert.match(resumeData, /AGAM Analytics/);
  assert.match(resumeData, /Founding Engineer/);

  assert.doesNotMatch(guestbook, /dangerouslySetInnerHTML/);
  assert.match(guestbook, /localStorage/);
  assert.match(guestbook, /yuval2003_guestbook/);

  assert.match(cssModule, /prefers-reduced-motion: reduce/);
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

test("the private UpWest wrapper is an accessible full-viewport HTML route handler", () => {
  const route = read("app/soc/upwest/route.ts");

  assert.match(route, /<!doctype html>/i);
  assert.match(route, /<html\s+lang="en">/);
  assert.match(route, /<title>UpWest Scope of Work<\/title>/);
  assert.match(route, /<meta\s+name="robots"\s+content="noindex, nofollow"\s*\/?>/);
  assert.match(route, /<iframe/);
  assert.match(route, /src="\/soc\/upwest\/working-agreement\.html"/);
  assert.match(route, /title="UpWest Scope of Work"/);
  assert.match(route, /height:\s*100(?:dvh|%)/);
  assert.match(route, /width:\s*100%/);
  assert.match(route, /border:\s*0/);
});

test("the UpWest wrapper has no conflicting App Router page", () => {
  assert.equal(existsSync(new URL("../app/soc/upwest/route.ts", import.meta.url)), true);
  assert.equal(existsSync(new URL("../app/soc/upwest/page.tsx", import.meta.url)), false);
});

test("the UpWest public HTML screens stay private and preserve their interactions", () => {
  const agreement = read("public/soc/upwest/working-agreement.html");
  const consoleDemo = read("public/soc/upwest/agent-console-demo.html");

  for (const html of [agreement, consoleDemo]) {
    assert.match(html, /<meta\s+name="robots"\s+content="noindex,\s*nofollow"\s*\/?>/i);
  }

  assert.match(agreement, /data-src="\/soc\/upwest\/agent-console-demo\.html"/);
  assert.match(agreement, /window\.print\(\)/);
  assert.match(agreement, /IntersectionObserver/);
  assert.match(agreement, /class="toc-wrap"/);
  assert.match(agreement, /id="demoOverlay"/);
  assert.match(consoleDemo, /data-panel="agents"/);
  assert.match(consoleDemo, /function applyActor\(\)/);
  assert.match(consoleDemo, /data-gil-only/);
  assert.match(consoleDemo, /toast/i);
});

test("the UpWest demo uses Dana Levi consistently for the non-Gil identity", () => {
  const consoleDemo = read("public/soc/upwest/agent-console-demo.html");

  assert.match(consoleDemo, /<option value="dana">Dana Levi — Principal<\/option>/);
  assert.doesNotMatch(consoleDemo, /Aya Cohen/);
  assert.match(consoleDemo, /var first = gil \? 'Gil' : 'Dana';/);
  assert.match(consoleDemo, /<b>Dana Levi<\/b><span>Principal<\/span>/);
});

test("the UpWest live demo modal manages and traps focus", () => {
  const agreement = read("public/soc/upwest/working-agreement.html");

  assert.match(agreement, /var closeButton = document\.getElementById\('demoClose'\);/);
  assert.match(agreement, /launcher = e\.currentTarget;/);
  assert.match(agreement, /closeButton\.focus\(\);/);
  assert.match(agreement, /frame\.addEventListener\('load', bindFrameDocument\);/);
  assert.match(agreement, /frame\.contentDocument/);
  assert.match(agreement, /querySelectorAll\(focusableSelector\)/);
  assert.match(agreement, /frameDocument\.addEventListener\('keydown', handleFrameKeydown\);/);
  assert.match(agreement, /if\(e\.key === 'Tab'\)/);
  assert.match(agreement, /document\.activeElement === closeButton/);
  assert.match(agreement, /frameDocument\.activeElement === firstFocusable/);
  assert.match(agreement, /frameDocument\.activeElement === lastFocusable/);
  assert.match(agreement, /firstFocusable\.focus\(\);/);
  assert.match(agreement, /lastFocusable\.focus\(\);/);
  assert.match(agreement, /launcher\.focus\(\);/);
  assert.match(agreement, /e\.key === 'Escape'/);
  assert.match(agreement, /if\(e\.target === overlay\) close\(\);/);
});

test("the UpWest schedule switches expose and synchronize their state", () => {
  const consoleDemo = read("public/soc/upwest/agent-console-demo.html");
  const switchTags = [...consoleDemo.matchAll(/<button\b[^>]*\bclass="[^"]*\bswitch\b[^"]*"[^>]*>/g)].map(
    ([tag]) => tag,
  );

  assert.equal(switchTags.length, 3);
  for (const tag of switchTags) {
    const classes = tag.match(/class="([^"]+)"/)?.[1].split(/\s+/) ?? [];
    const name = tag.match(/data-name="([^"]+)"/)?.[1];
    const label = tag.match(/aria-label="([^"]+)"/)?.[1];
    const pressed = tag.match(/aria-pressed="([^"]+)"/)?.[1];

    assert.ok(name, `missing data-name on ${tag}`);
    assert.equal(label, name, `accessible label must match data-name on ${tag}`);
    assert.equal(pressed, String(classes.includes("on")), `initial state must match CSS on ${tag}`);
  }

  assert.match(consoleDemo, /s\.setAttribute\('aria-pressed', String\(on\)\);/);
});

test("private UpWest source-only artifacts are not published or added to the sitemap", () => {
  const sitemap = read("app/sitemap.ts");

  for (const path of [
    "public/soc/upwest/document.pdf",
    "public/soc/upwest/DESIGN-HANDOFF.md",
    "public/soc/upwest/DESIGN-MANIFEST.json",
    "public/soc/upwest/upwest-working-agreement.html",
  ]) {
    assert.equal(existsSync(new URL(`../${path}`, import.meta.url)), false, `${path} must not be public`);
  }

  assert.doesNotMatch(sitemap, /soc\/upwest/i);
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
