import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const rootUrl = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, rootUrl), "utf8");

test("the UpWest SOW uses a broad Next.js proxy that cannot miss encoded paths", () => {
  assert.equal(existsSync(new URL("proxy.ts", rootUrl)), true, "missing proxy.ts");

  const proxy = read("proxy.ts");

  assert.match(proxy, /export\s+async\s+function\s+proxy\s*\(/);
  assert.match(proxy, /matcher:\s*["']\/:path\*["']/);
  assert.doesNotMatch(proxy, /matcher:\s*["']\/soc\/upwest\/:path\*["']/);
  assert.match(proxy, /process\.env\.UPWEST_SOW_PASSWORD/);
  assert.match(proxy, /NextResponse\.next\(/);
  assert.doesNotMatch(proxy, /console\s*\./);
});

test("the proxy safely normalizes repeatedly encoded pathnames before classifying them", () => {
  const proxy = read("proxy.ts");

  assert.match(proxy, /decodeURIComponent\s*\(/);
  assert.match(proxy, /catch\s*\{/);
  assert.match(proxy, /for\s*\([^;]+;[^;]+<\s*MAX_PATH_DECODING_PASSES;/);
  assert.match(
    proxy,
    /normalizedPath\s*===\s*["']\/soc\/upwest["']\s*\|\|\s*normalizedPath\.startsWith\(["']\/soc\/upwest\/["']\)/,
  );
});

test("the broad proxy passes unrelated routes through before invoking UpWest authentication", () => {
  const proxy = read("proxy.ts");
  const routeGuard = proxy.indexOf("if (!isUpWestPath(normalizedPath))");
  const configGuard = proxy.indexOf("if (!configuredPassword)");

  assert.notEqual(routeGuard, -1, "missing unrelated-route guard");
  assert.notEqual(configGuard, -1, "missing missing-configuration guard");
  assert.ok(routeGuard < configGuard, "unrelated-route guard must run before configuration checks");
  assert.match(
    proxy.slice(routeGuard, configGuard),
    /return\s+NextResponse\.next\(\);/,
  );
});

test("the proxy fails closed with no-store when the shared secret is not configured", () => {
  const proxy = read("proxy.ts");

  assert.match(proxy, /if\s*\(!configuredPassword\)\s*\{\s*return\s+unavailableResponse\(\)/);
  assert.match(proxy, /new\s+NextResponse\(null,\s*\{\s*status:\s*503/);
  assert.match(proxy, /["']Cache-Control["']:\s*["']no-store["']/);
});

test("the README documents the private-link token and cookie flow for the protected UpWest route", () => {
  const readme = read("README.md");

  assert.match(readme, /`\/soc\/upwest`[^\n]*dynamic[^\n]*password-protected[^\n]*private-link/i);
  assert.match(readme, /`UPWEST_SOW_PASSWORD`/);
  assert.match(readme, /missing[^\n]*`UPWEST_SOW_PASSWORD`[^\n]*503/i);
  assert.match(readme, /invalid or missing[^\n]*private link[^\n]*403/i);
  assert.match(readme, /UPWEST_SOW_PASSWORD=local-placeholder npm run dev/);
  assert.match(readme, /http:\/\/localhost:3000\/soc\/upwest\?token=local-placeholder/);
  assert.match(readme, /Environment Variables[^\n]*UI/i);
  assert.match(readme, /vercel env add UPWEST_SOW_PASSWORD production --sensitive/);
  assert.match(readme, /redirects?[^\n]*clean[^\n]*URL[^\n]*secure cookie/i);
  assert.match(readme, /HttpOnly[^\n]*Secure[^\n]*SameSite=Lax[^\n]*cookie[^\n]*`\/soc\/upwest`/i);
  assert.match(readme, /never commit[^\n]*(?:password|`UPWEST_SOW_PASSWORD`)/i);
  assert.match(readme, /never[^\n]*publish[^\n]*private link/i);
  assert.doesNotMatch(readme, /Basic Auth/i);
  assert.doesNotMatch(readme, /Basic Auth username/i);
  assert.doesNotMatch(readme, /^No custom Vercel configuration is required\.$/m);
});

test("the README percent-encodes reserved characters when composing a private link", () => {
  const readme = read("README.md");

  assert.match(readme, /percent-encode[^\n]*query value/i);
  assert.match(readme, /`\+`, `#`, `&`, and `%`/);
  assert.match(readme, /encodeURIComponent\(password\)/);
  assert.match(readme, /https:\/\/yuvalfishler\.com\/soc\/upwest\?token=\$\{encodeURIComponent\(password\)\}/);
  assert.doesNotMatch(readme, /\?token=<password>/);
});

test("both standalone UpWest documents locally suppress motion for reduced-motion users", () => {
  for (const path of [
    "public/soc/upwest/working-agreement.html",
    "public/soc/upwest/agent-console-demo.html",
  ]) {
    const source = read(path);
    const mediaStart = source.search(/@media\s*\(prefers-reduced-motion:\s*reduce\)/);

    assert.notEqual(mediaStart, -1, `${path} is missing a reduced-motion media query`);

    const reducedMotionCss = source.slice(mediaStart, source.indexOf("</style>", mediaStart));
    assert.match(reducedMotionCss, /html\s*\{[^}]*scroll-behavior:\s*auto\s*!important;/s);
    assert.match(
      reducedMotionCss,
      /\*,\s*\*::before,\s*\*::after\s*\{[^}]*animation:\s*none\s*!important;[^}]*transition:\s*none\s*!important;/s,
    );
  }
});

test("the UpWest recurring-cost baseline total matches its unchanged line items", () => {
  const agreement = read("public/soc/upwest/working-agreement.html");

  assert.match(agreement, /<td class="amt">\$100 \/ mo<\/td>/);
  assert.match(agreement, /<td class="amt">\$30 \/ mo<\/td>/);
  assert.match(agreement, /<td class="amt">\$15–40 \/ mo<\/td>/);
  assert.match(
    agreement,
    /<tr class="total"><td>Estimated baseline total<\/td><td class="amt">\$145–170 \/ mo<\/td><\/tr>/,
  );
  assert.doesNotMatch(agreement, /\$175–260 \/ mo/);
});

test("the UpWest console never claims that Phase 1 wrote to an external integration", () => {
  const demo = read("public/soc/upwest/agent-console-demo.html");

  for (const externalWriteClaim of [
    /Prepared three outbound drafts in your mailbox/i,
    /Done — moved[^\n]+in Affinity/i,
    /Affinity · record updated/i,
    /Queued reminder notes/i,
    /Ready in your drafts to send/i,
    /emails the digest to/i,
  ]) {
    assert.doesNotMatch(demo, externalWriteClaim);
  }
});

test("Phase 1 draft and reminder suggestions stay visibly inside the UpWest console", () => {
  const demo = read("public/soc/upwest/agent-console-demo.html");

  assert.match(demo, /Phase 1[^\n]+external integrations are read-only/i);
  assert.match(demo, /Suggested intro text · console only/i);
  assert.match(demo, /Nothing was written to a mailbox or sent/i);
  assert.match(demo, /Suggested reminder text · console only/i);
  assert.match(demo, /Nothing was queued, written, or sent/i);
});

test("Phase 1 declines Affinity writes and keeps the sample digest in the console", () => {
  const demo = read("public/soc/upwest/agent-console-demo.html");

  assert.match(demo, /I can’t modify Affinity in Phase 1 because the integration is read-only/i);
  assert.match(demo, /Proposed Affinity update · review only/i);
  assert.match(demo, /No Affinity record was changed/i);
  assert.match(demo, /Controlled actions are deferred to Phase 2/i);
  assert.match(demo, /sample inbound digest[^\n]+display[^\n]+inside this console/i);
  assert.match(demo, /does not email anyone/i);
  assert.match(demo, /Production scheduled reports are deferred to Phase 2/i);
});

test("the proxy never issues an HTTP Basic Auth challenge", () => {
  const proxy = read("proxy.ts");
  const authHelper = read("upwest-auth.ts");

  for (const source of [proxy, authHelper]) {
    assert.doesNotMatch(source, /WWW-Authenticate/i);
    assert.doesNotMatch(source, /realm=/i);
    assert.doesNotMatch(source, /Basic\s+realm/i);
    assert.doesNotMatch(source, /status:\s*401/);
  }
});

test("only the exact /soc/upwest wrapper path reads a token query parameter", () => {
  const proxy = read("proxy.ts");

  assert.match(proxy, /UPWEST_WRAPPER_PATH\s*=\s*["']\/soc\/upwest["']/);
  assert.match(
    proxy,
    /const\s+isWrapperPath\s*=\s*normalizedPath\s*===\s*UPWEST_WRAPPER_PATH/,
  );
  assert.match(proxy, /isWrapperPath\s*\?\s*request\.nextUrl\.searchParams\.getAll\(\s*["']token["']\s*\)\s*:\s*\[\]/);
});

test("duplicate or malformed token query parameters fail closed instead of picking the first value", () => {
  const proxy = read("proxy.ts");

  assert.match(proxy, /tokenValues\.length\s*===\s*1\s*\?\s*tokenValues\[0\]\s*:\s*null/);
  assert.doesNotMatch(proxy, /searchParams\.get\(\s*["']token["']\s*\)/);
});

test("a valid token establishes an HttpOnly, Secure, SameSite=Lax session cookie scoped to /soc/upwest", () => {
  const proxy = read("proxy.ts");
  const helper = read("upwest-auth.ts");

  assert.match(proxy, /response\.cookies\.set\(\s*\{/);
  assert.match(proxy, /httpOnly:\s*true/);
  assert.match(proxy, /secure:\s*true/);
  assert.match(proxy, /sameSite:\s*["']lax["']/);
  assert.match(proxy, /path:\s*UPWEST_WRAPPER_PATH/);
  assert.match(proxy, /maxAge:\s*UPWEST_COOKIE_MAX_AGE_SECONDS/);
  assert.match(
    helper,
    /UPWEST_COOKIE_MAX_AGE_SECONDS\s*=\s*60\s*\*\s*60\s*\*\s*24\s*\*\s*7/,
  );
});

test("the post-token redirect targets a hardcoded clean URL and never reflects request input", () => {
  const proxy = read("proxy.ts");

  assert.match(proxy, /NextResponse\.redirect\(\s*redirectUrl/);
  assert.match(proxy, /new\s+URL\(\s*UPWEST_WRAPPER_PATH,\s*request\.nextUrl\.origin\s*\)/);
  assert.doesNotMatch(proxy, /NextResponse\.redirect\([^)]*searchParams/);
  assert.doesNotMatch(proxy, /NextResponse\.redirect\([^)]*token/);
  assert.doesNotMatch(proxy, /NextResponse\.redirect\([^)]*request\.nextUrl\.pathname/);
});

test("subsequent requests are authorized from the session cookie, never from a query token", () => {
  const proxy = read("proxy.ts");

  assert.match(proxy, /request\.cookies\.get\(\s*UPWEST_COOKIE_NAME\s*\)\?\.value\s*(?:\?\?|\|\|)\s*null/);
  assert.match(proxy, /authenticateUpWestSession\(\s*sessionCookie,\s*configuredPassword\s*\)/);
});

test("denied requests return a small polished branded HTML page, not an empty challenge body", () => {
  const proxy = read("proxy.ts");

  assert.match(proxy, /status:\s*403/);
  assert.match(proxy, /<!doctype html>/i);
  assert.match(proxy, /<meta\s+name="robots"\s+content="noindex, nofollow"\s*\/?>/);
  assert.match(proxy, /private link/i);
  assert.doesNotMatch(proxy, /\$\{token\}/);
  assert.doesNotMatch(proxy, /\$\{.*token.*\}/i);
});

test("every proxy-issued response is no-store, non-referring, and non-indexable as appropriate", () => {
  const proxy = read("proxy.ts");

  assert.match(proxy, /["']Referrer-Policy["']:\s*["']no-referrer["']/);
  assert.match(proxy, /["']Cache-Control["']:\s*["']private, no-store["']/);
  assert.match(proxy, /["']?Vary["']?:\s*["']Cookie["']/);
  assert.match(proxy, /["']X-Robots-Tag["']:\s*["']noindex, nofollow["']/);
  assert.doesNotMatch(proxy, /Vary["']?:\s*["']Authorization["']/);
});

test("the UpWest route handler owns the final wrapper response headers and varies by Cookie", () => {
  assert.equal(
    existsSync(new URL("app/soc/upwest/route.ts", rootUrl)),
    true,
    "missing app/soc/upwest/route.ts",
  );

  const route = read("app/soc/upwest/route.ts");

  assert.match(route, /new\s+Response\(/);
  assert.match(route, /["']Content-Type["']:\s*["']text\/html; charset=utf-8["']/);
  assert.match(route, /["']Cache-Control["']:\s*["']private, no-store["']/);
  assert.match(route, /Vary:\s*["']Cookie["']/);
  assert.match(route, /["']X-Robots-Tag["']:\s*["']noindex, nofollow["']/);
  assert.doesNotMatch(route, /Authorization/);
});

test("Next.js config has no ineffective route-specific headers override", () => {
  const nextConfig = read("next.config.ts");

  assert.match(nextConfig, /const\s+nextConfig:\s*NextConfig\s*=\s*\{\s*\};/);
  assert.doesNotMatch(nextConfig, /headers\s*\(/);
  assert.doesNotMatch(nextConfig, /\/soc\/upwest/);
});

test("the Node test suite never imports TypeScript files at runtime", () => {
  const protectionTest = read("tests/upwest-protection.test.mjs");

  assert.doesNotMatch(protectionTest, /import\s*\(\s*["'][^"']+\.ts["']\s*\)/);
});

test("the auth helper uses Web Crypto digests and a constant-time byte comparison", () => {
  assert.equal(existsSync(new URL("upwest-auth.ts", rootUrl)), true, "missing upwest-auth.ts");

  const helper = read("upwest-auth.ts");

  assert.match(helper, /crypto\.subtle\.digest/);
  assert.match(helper, /difference\s*\|=/);
  assert.doesNotMatch(helper, /console\s*\./);
});

test("the auth helper exposes independent token and session-cookie verifiers that both fail closed", () => {
  const helper = read("upwest-auth.ts");

  assert.match(helper, /export\s+async\s+function\s+authenticateUpWestToken\s*\(/);
  assert.match(helper, /export\s+async\s+function\s+authenticateUpWestSession\s*\(/);
  assert.match(helper, /export\s+async\s+function\s+deriveUpWestSessionToken\s*\(/);

  const tokenFn = helper.slice(helper.indexOf("export async function authenticateUpWestToken"));
  const sessionFn = helper.slice(helper.indexOf("export async function authenticateUpWestSession"));

  for (const fn of [tokenFn, sessionFn]) {
    assert.match(fn, /if\s*\(!configuredPassword\)\s*\{\s*return\s+["']unavailable["']/);
  }
});

test("the session cookie value is derived from the secret and is not the raw secret itself", () => {
  const helper = read("upwest-auth.ts");

  assert.match(helper, /deriveUpWestSessionToken/);
  assert.doesNotMatch(helper, /cookieValue\s*===\s*configuredPassword/);
  assert.doesNotMatch(helper, /sessionCookie\s*===\s*configuredPassword/);
});

test("session tokens carry a strictly parsed authenticated expiry", () => {
  const helper = read("upwest-auth.ts");
  const deriveFn = helper.slice(
    helper.indexOf("export async function deriveUpWestSessionToken"),
    helper.indexOf("export async function authenticateUpWestSession"),
  );
  const sessionFn = helper.slice(helper.indexOf("export async function authenticateUpWestSession"));

  assert.match(helper, /SESSION_TOKEN_CONTEXT\s*=\s*["']upwest-session-v1["']/);
  assert.match(deriveFn, /Math\.floor\(Date\.now\(\)\s*\/\s*1000\)/);
  assert.match(deriveFn, /UPWEST_COOKIE_MAX_AGE_SECONDS/);
  assert.match(
    deriveFn,
    /return\s+`\$\{expiresAtEpochSeconds\}\.\$\{toHex\(signature\)\}`/,
  );
  assert.match(helper, /SESSION_TOKEN_PATTERN\s*=\s*\/\^\(\[1-9\]\\d\*\)\\\.\(\[0-9a-f\]\{64\}\)\$\//);
  assert.match(sessionFn, /SESSION_TOKEN_PATTERN\.exec\(sessionCookie\)/);
  assert.match(sessionFn, /Number\.isSafeInteger\(expiresAtEpochSeconds\)/);
});

test("session expiry signatures use Web Crypto HMAC-SHA-256 keyed by the configured password", () => {
  const helper = read("upwest-auth.ts");

  assert.match(helper, /crypto\.subtle\.importKey\(/);
  assert.match(helper, /name:\s*["']HMAC["']/);
  assert.match(helper, /hash:\s*["']SHA-256["']/);
  assert.match(helper, /crypto\.subtle\.sign\(/);
  assert.match(
    helper,
    /hmacSha256\(\s*sessionSignaturePayload\(expiresAtEpochSeconds\),\s*configuredPassword,?\s*\)/,
  );
  assert.match(helper, /SESSION_TOKEN_CONTEXT[^\n]+expiresAtEpochSeconds/);
});

test("session authentication rejects expired tokens server-side", () => {
  const helper = read("upwest-auth.ts");
  const sessionFn = helper.slice(helper.indexOf("export async function authenticateUpWestSession"));

  assert.match(sessionFn, /expiresAtEpochSeconds\s*<=\s*nowEpochSeconds/);
  assert.match(sessionFn, /return\s+["']unauthorized["']/);
});

test("session authentication rejects expiries beyond the configured lifetime", () => {
  const helper = read("upwest-auth.ts");
  const sessionFn = helper.slice(helper.indexOf("export async function authenticateUpWestSession"));

  assert.match(
    sessionFn,
    /expiresAtEpochSeconds\s*>\s*nowEpochSeconds\s*\+\s*UPWEST_COOKIE_MAX_AGE_SECONDS/,
  );
});

test("session signatures are decoded and compared as bytes in constant time", () => {
  const helper = read("upwest-auth.ts");
  const sessionFn = helper.slice(helper.indexOf("export async function authenticateUpWestSession"));

  assert.match(helper, /function\s+fromHex\s*\(/);
  assert.match(
    sessionFn,
    /constantTimeEqual\(candidateSignature,\s*expectedSignature\)/,
  );
  assert.doesNotMatch(sessionFn, /signature\s*===/);
});

test("the auth helper uses one constant-time byte comparator for token and session checks", () => {
  const helper = read("upwest-auth.ts");
  const matches = [...helper.matchAll(/constantTimeEqual\(/g)];

  assert.ok(matches.length >= 3, "expected the comparator declaration and both verifier calls");
  assert.match(helper, /function\s+constantTimeEqual\s*\(/);
});

test("proxy source never logs or reflects the token or cookie value", () => {
  const proxy = read("proxy.ts");

  assert.doesNotMatch(proxy, /console\./);
  assert.doesNotMatch(proxy, /token\s*\}\s*\)/);
});

test("cookie constants live alongside the auth helper as the single source of truth", () => {
  const helper = read("upwest-auth.ts");
  const proxy = read("proxy.ts");

  assert.match(helper, /export\s+const\s+UPWEST_COOKIE_NAME\s*=/);
  assert.match(proxy, /import\s*\{[^}]*UPWEST_COOKIE_NAME[^}]*\}\s*from\s*["']\.\/upwest-auth["']/);
});
