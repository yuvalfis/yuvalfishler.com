# yuvalfishler.com

The source for Yuval Fishler's personal website. It is a small, responsive static site with no framework, package manager, build step, or runtime dependency.

## Run locally

From the project directory, start Python's built-in web server:

```sh
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000). To view the custom error page directly, open [http://localhost:8000/404.html](http://localhost:8000/404.html).

## Verify

Run the dependency-free verification script:

```sh
python3 verify.py
```

It checks required files, internal links, core metadata, semantic HTML landmarks, structured data, the sitemap, keyboard-focus styling, and reduced-motion support.

## Deploy to Vercel

1. Import the repository into Vercel.
2. Leave the framework preset as **Other** and the build command empty.
3. Leave the output directory empty (the repository root is the published site).
4. Deploy, then connect `yuvalfishler.com` in the project's domain settings.

Vercel serves `index.html` automatically and uses `404.html` for unmatched static routes. No `vercel.json` is needed for this layout.

## Files

- `index.html` — the single-page site and SEO/Open Graph metadata
- `styles.css` — responsive layout, visual design, and accessible motion/focus styles
- `404.html` — custom not-found page
- `favicon.svg` and `social-card.svg` — site and sharing artwork
- `robots.txt` and `sitemap.xml` — crawler discovery files
- `verify.py` — standard-library-only automated checks
