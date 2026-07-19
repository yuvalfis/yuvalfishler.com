import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const rootUrl = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, rootUrl), "utf8");

const css = () => read("app/retro/retro.module.css");
const retroHomeSource = () => read("app/retro/RetroHome.tsx");
const sidebarSource = () => read("app/retro/Sidebar.tsx");
const splashSource = () => read("app/retro/SplashIntro.tsx");

/**
 * Pulls a single top-level CSS rule (or at-rule block) out of a stylesheet by
 * matching its opening selector/prelude and then balancing braces, so nested
 * `@media { ... }` blocks can be inspected as a unit just like flat rules.
 */
function extractBlock(source, selectorPattern) {
  const match = source.match(selectorPattern);
  if (!match) return null;
  const start = source.indexOf("{", match.index);
  if (start === -1) return null;
  let depth = 0;
  for (let i = start; i < source.length; i += 1) {
    if (source[i] === "{") depth += 1;
    else if (source[i] === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(match.index, i + 1);
    }
  }
  return null;
}


test("the decorative splash grid layer is pointer-safe and never blocks ENTER/skip clicks", () => {
  const rule = extractBlock(css(), /\.splashGrid\s*\{/);
  assert.ok(rule, "expected a .splashGrid rule in retro.module.css");
  assert.match(
    rule,
    /pointer-events:\s*none/,
    ".splashGrid is decorative (aria-hidden) and absolutely positioned over the whole splash; " +
      "without pointer-events: none it can intercept taps meant for ENTER/skip on small screens",
  );

  const splash = splashSource();
  assert.match(splash, /className=\{styles\.splashGrid\}\s+aria-hidden="true"/);
  assert.match(splash, /<button[^>]*className=\{styles\.splashButtonSkip\}/s);
  assert.match(splash, /<button[^>]*className=\{styles\.splashButtonPrimary\}/s);
});

test("frameset grid items are shrinkable instead of forcing a horizontal blowout", () => {
  const rule = extractBlock(css(), /\.shell\s*>\s*\*\s*\{/);
  assert.ok(
    rule,
    "expected a `.shell > *` rule: every direct grid child needs an explicit min-width so a single " +
      "long unbreakable descendant (ticker/player marquee text) cannot force the whole grid track — and " +
      "therefore the document — wider than the viewport",
  );
  assert.match(rule, /min-width:\s*0/);

  const frameL = extractBlock(css(), /\.frameL\s*\{/);
  assert.ok(frameL, "expected a .frameL rule");
  assert.doesNotMatch(
    frameL,
    /overflow-x:\s*hidden/,
    "desktop sidebar glow/focus effects must not be clipped by a mobile-only overflow safeguard",
  );

  const mobileBlock = extractBlock(css(), /@media \(max-width:\s*760px\)\s*\{/);
  const mobileFrameL = extractBlock(mobileBlock, /\.frameL\s*\{/);
  assert.ok(mobileFrameL, "expected a mobile .frameL rule");
  assert.match(mobileFrameL, /overflow-x:\s*hidden/);
});

test("long, unbreakable contact and footer text wraps instead of stretching the layout", () => {
  const rule = extractBlock(
    css(),
    /\.contactBox a,\s*\n\s*\.mailLink,\s*\n\s*\.entryMessage,\s*\n\s*\.footer\s*\{/,
  );
  assert.ok(
    rule,
    "expected a combined rule making contact links, the mailto link, guestbook messages, and the " +
      "footer wrap long tokens instead of overflowing",
  );
  assert.match(rule, /overflow-wrap:\s*anywhere/);
});

test("DOM and mobile visual order both place main content ahead of the sidebar", () => {
  const home = retroHomeSource();
  assert.ok(
    home.indexOf("<main className={styles.frameR}") < home.indexOf("<Sidebar hasEntered={hasEntered}"),
    "main must precede Sidebar in DOM order so keyboard and assistive-technology order matches mobile visuals",
  );

  const mobileBlock = extractBlock(css(), /@media \(max-width:\s*760px\)\s*\{/);
  assert.ok(mobileBlock, "expected the existing max-width: 760px mobile breakpoint");
  assert.match(
    mobileBlock,
    /grid-template-areas:\s*"ticker"\s*"construction"\s*"main"\s*"sidebar"\s*"footer"/,
    "mobile named grid areas must follow the same main-before-sidebar sequence as the DOM",
  );
  assert.doesNotMatch(
    mobileBlock,
    /order:\s*-?\d+/,
    "CSS order must not create a visual sequence that diverges from keyboard/AT traversal",
  );
});

test("the mobile breakpoint compacts the sidebar navigation into a wrapping row", () => {
  const nav = sidebarSource();
  assert.match(
    nav,
    /<nav aria-label="Section navigation" className=\{styles\.sectionNav\}>/,
    "the <nav> needs its own class so mobile can restyle it independently of the sidebar container",
  );

  const mobileBlock = extractBlock(css(), /@media \(max-width:\s*760px\)\s*\{/);
  const sectionNavRule = extractBlock(mobileBlock, /\.sectionNav\s*\{/);
  assert.ok(sectionNavRule, "expected a compacted .sectionNav rule inside the mobile breakpoint");
  assert.match(sectionNavRule, /flex-wrap:\s*wrap/);

  const navButtonRule = extractBlock(mobileBlock, /\.navButton\s*\{/);
  assert.ok(navButtonRule, "expected a compacted .navButton rule inside the mobile breakpoint");
  assert.match(
    navButtonRule,
    /flex:\s*1 1 calc\(50% - 8px\)/,
    "nav buttons should wrap two-per-row on mobile instead of stacking as seven full-width blocks",
  );
});

test("there is more than one responsive breakpoint tuning the retro layout for small phones", () => {
  const source = css();
  const breakpoints = [...source.matchAll(/@media \(max-width:\s*(\d+)px\)/g)].map((match) =>
    Number(match[1]),
  );
  assert.ok(breakpoints.includes(760), "the frameset stacking breakpoint must still exist");
  assert.ok(
    breakpoints.includes(480),
    "a tighter breakpoint is needed to fine-tune padding/nav for 320-430px phones, not just the 760px stack point",
  );
});

test("interactive controls meet a 44px touch target on mobile", () => {
  const mobileBlock = extractBlock(css(), /@media \(max-width:\s*760px\)\s*\{/);
  assert.ok(mobileBlock);

  for (const selectorPattern of [
    /\.navButton\s*\{/,
    /\.playerControls button\s*\{/,
    /\.splashButtonPrimary,\s*\n\s*\.splashButtonSkip\s*\{/,
    /\.guestbookSubmit\s*\{/,
    /\.guestbookForm input,\s*\n\s*\.guestbookForm textarea\s*\{/,
  ]) {
    const rule = extractBlock(mobileBlock, selectorPattern);
    assert.ok(rule, `expected a mobile rule matching ${selectorPattern}`);
    assert.match(rule, /min-height:\s*44px/, `expected a 44px min-height in ${rule}`);
  }
});
