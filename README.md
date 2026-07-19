# yuvalfishler.com

The source for Yuval Fishler's personal website, built with the Next.js App Router, React, and TypeScript. The pages are server components and are prerendered as static content.

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
3. Deploy, then connect `yuvalfishler.com` in the project's domain settings.

No custom Vercel configuration is required.

## Project structure

- `app/layout.tsx` — root metadata, viewport settings, JSON-LD, and global layout
- `app/page.tsx` — server-rendered home page
- `app/not-found.tsx` — custom 404 page and its metadata
- `app/robots.ts` and `app/sitemap.ts` — generated crawler metadata routes
- `app/globals.css` — responsive visual design, focus states, and reduced-motion behavior
- `public/` — favicon and Open Graph artwork
- `tests/migration.test.mjs` — dependency-free migration contract
