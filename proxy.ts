import { NextResponse, type NextRequest } from "next/server";

import {
  UPWEST_COOKIE_MAX_AGE_SECONDS,
  UPWEST_COOKIE_NAME,
  authenticateUpWestSession,
  authenticateUpWestToken,
  deriveUpWestSessionToken,
} from "./upwest-auth";

const UPWEST_WRAPPER_PATH = "/soc/upwest";
const MAX_PATH_DECODING_PASSES = 4;

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
  "Referrer-Policy": "no-referrer",
};

const REDIRECT_HEADERS = {
  "Cache-Control": "no-store",
  "Referrer-Policy": "no-referrer",
};

const PROTECTED_HEADERS = {
  "Cache-Control": "private, no-store",
  Vary: "Cookie",
  "Referrer-Policy": "no-referrer",
  "X-Robots-Tag": "noindex, nofollow",
};

const DENIED_HEADERS = {
  "Content-Type": "text/html; charset=utf-8",
  "Cache-Control": "no-store",
  "Referrer-Policy": "no-referrer",
  "X-Robots-Tag": "noindex, nofollow",
};

const ACCESS_DENIED_PAGE = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow" />
    <title>Private Access Required</title>
    <style>
      :root { color-scheme: light; }
      * { box-sizing: border-box; }
      html, body { height: 100%; margin: 0; }
      body {
        display: grid;
        place-items: center;
        min-height: 100dvh;
        padding: 1.5rem;
        background:
          radial-gradient(circle at 86% 8%, rgba(201, 88, 56, 0.09), transparent 27rem),
          #f3efe6;
        color: #17201d;
        font-family: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        text-align: center;
      }
      main {
        max-width: 26rem;
        padding: clamp(2rem, 6vw, 3rem);
        border-radius: 1.5rem;
        background: #faf8f2;
        box-shadow: 0 30px 80px rgba(23, 32, 29, 0.09);
      }
      .eyebrow {
        margin: 0 0 1rem;
        color: #9f3f25;
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.16em;
        text-transform: uppercase;
      }
      h1 {
        margin: 0 0 1rem;
        font-family: Iowan Old Style, Baskerville, "Times New Roman", serif;
        font-size: clamp(1.75rem, 6vw, 2.35rem);
        font-weight: 400;
        letter-spacing: -0.02em;
      }
      p.message {
        margin: 0;
        color: #59615d;
        font-size: 1rem;
        line-height: 1.6;
      }
    </style>
  </head>
  <body>
    <main>
      <p class="eyebrow">UpWest &middot; Private</p>
      <h1>A valid private link is required</h1>
      <p class="message">
        This page is only reachable through the private link that was shared with you.
        If you believe you should have access, please request a fresh link.
      </p>
    </main>
  </body>
</html>
`;

function decodePathnameOnce(pathname: string): string {
  try {
    return decodeURIComponent(pathname);
  } catch {
    return pathname.replace(/%([0-9A-Fa-f]{2})/g, (encoding, hex: string) => {
      const value = Number.parseInt(hex, 16);
      return value >= 0x20 && value <= 0x7e ? String.fromCharCode(value) : encoding;
    });
  }
}

function normalizePathname(pathname: string): string {
  let normalizedPath = pathname;

  for (let pass = 0; pass < MAX_PATH_DECODING_PASSES; pass += 1) {
    const decodedPath = decodePathnameOnce(normalizedPath);

    if (decodedPath === normalizedPath) {
      break;
    }

    normalizedPath = decodedPath;
  }

  return normalizedPath;
}

function isUpWestPath(normalizedPath: string): boolean {
  return (
    normalizedPath === "/soc/upwest" || normalizedPath.startsWith("/soc/upwest/")
  );
}

function unavailableResponse(): NextResponse {
  return new NextResponse(null, { status: 503, headers: NO_STORE_HEADERS });
}

function deniedResponse(): NextResponse {
  return new NextResponse(ACCESS_DENIED_PAGE, { status: 403, headers: DENIED_HEADERS });
}

export async function proxy(request: NextRequest) {
  const normalizedPath = normalizePathname(request.nextUrl.pathname);

  if (!isUpWestPath(normalizedPath)) {
    return NextResponse.next();
  }

  const configuredPassword = process.env.UPWEST_SOW_PASSWORD;

  if (!configuredPassword) {
    return unavailableResponse();
  }

  const isWrapperPath = normalizedPath === UPWEST_WRAPPER_PATH;
  const tokenValues = isWrapperPath ? request.nextUrl.searchParams.getAll("token") : [];

  if (isWrapperPath && tokenValues.length > 0) {
    const token = tokenValues.length === 1 ? tokenValues[0] : null;
    const tokenResult = await authenticateUpWestToken(token, configuredPassword);

    if (tokenResult !== "authorized") {
      return deniedResponse();
    }

    const sessionToken = await deriveUpWestSessionToken(configuredPassword);
    const redirectUrl = new URL(UPWEST_WRAPPER_PATH, request.nextUrl.origin);
    const response = NextResponse.redirect(redirectUrl, { status: 303, headers: REDIRECT_HEADERS });

    response.cookies.set({
      name: UPWEST_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: UPWEST_WRAPPER_PATH,
      maxAge: UPWEST_COOKIE_MAX_AGE_SECONDS,
    });

    return response;
  }

  const sessionCookie = request.cookies.get(UPWEST_COOKIE_NAME)?.value ?? null;
  const sessionResult = await authenticateUpWestSession(sessionCookie, configuredPassword);

  if (sessionResult !== "authorized") {
    return deniedResponse();
  }

  return NextResponse.next({ headers: PROTECTED_HEADERS });
}

export const config = {
  matcher: "/:path*",
};
