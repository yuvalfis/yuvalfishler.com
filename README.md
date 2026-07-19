# yuvalfishler.com

The source for Yuval Fishler's personal website, built with the Next.js App Router, React, and TypeScript. The homepage is a 2003-style retro shrine — splash intro, sidebar frame, ticker, chiptune player, guestbook, and all — implemented as a server-rendered `app/page.tsx` that mounts the interactive `app/retro/RetroHome` client component tree; `/soc/upwest` is a separate dynamic, password-protected private-link route.

## Requirements

- Node.js 20.9 or newer
- npm (the committed `package-lock.json` is the dependency source of truth)

## Install and run locally

Install the exact dependency tree represented by the lockfile:

```sh
npm install
```

Start the development server:

```sh
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000). Any unmatched path displays the custom not-found page.

To access `/soc/upwest` locally, set a non-secret placeholder password:

```sh
UPWEST_SOW_PASSWORD=local-placeholder npm run dev
```

Then open `http://localhost:3000/soc/upwest?token=local-placeholder` once. A valid token sets an HttpOnly Secure SameSite=Lax cookie scoped to `/soc/upwest` and redirects to the clean `/soc/upwest` URL; subsequent wrapper and asset requests use that cookie.

Missing `UPWEST_SOW_PASSWORD` configuration returns HTTP 503 for the protected route. An invalid or missing private link returns the branded HTTP 403 page.

For a production-mode local run:

```sh
npm run build
npm start
```

## Verify

Run the focused migration contract, Next-aware ESLint rules, TypeScript, and the production build:

```sh
npm test
npm run lint
npm run typecheck
npm run build
```

The tests lock down required App Router files, package scripts, approved identity and contact facts, metadata and structured data, crawler routes, accessible page landmarks, responsive/reduced-motion CSS, public assets, and removal of obsolete static entry files.

## Deploy to Vercel

1. Import the repository into Vercel.
2. Keep the automatically detected **Next.js** framework preset and default build settings.
3. Set `UPWEST_SOW_PASSWORD` for Production through the project **Environment Variables** UI, or run `vercel env add UPWEST_SOW_PASSWORD production --sensitive`.
4. Deploy, then connect `yuvalfishler.com` in the project's domain settings.
5. Percent-encode the secret when composing the `token` query value. Characters such as `+`, `#`, `&`, and `%` are URL-reserved and must not be inserted literally. For example, this browser-console/JavaScript snippet uses an explicitly fake password:

   ```js
   const password = "example+only#not-a-real-secret";
   const privateLink = `https://yuvalfishler.com/soc/upwest?token=${encodeURIComponent(password)}`;
   privateLink;
   ```

   Substitute the shared password locally, then share the generated `privateLink`. It redirects to the clean URL after setting the secure cookie.

The public static pages require no custom Vercel configuration. The dynamic `/soc/upwest` route and its assets require `UPWEST_SOW_PASSWORD`. Never commit the password or place it in source files, and never publish the private link.

## Project structure

- `app/layout.tsx` — root metadata, viewport settings, JSON-LD, and global layout
- `app/page.tsx` — home page metadata/JSON-LD, rendering the retro client tree
- `app/retro/` — the retro homepage's client components, data, CSS module, and shared helpers
- `app/not-found.tsx` — custom 404 page and its metadata
- `app/robots.ts` and `app/sitemap.ts` — generated crawler metadata routes
- `app/globals.css` — shared tokens, resets, and the 404 page's visual design
- `public/` — favicon and Open Graph artwork
- `tests/migration.test.mjs` — dependency-free migration contract
