#!/usr/bin/env python3
"""Small, dependency-free verification suite for the static site."""

from __future__ import annotations

import json
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse
from xml.etree import ElementTree


ROOT = Path(__file__).resolve().parent
SITE_URL = "https://yuvalfishler.com/"
REQUIRED_FILES = {
    "index.html",
    "404.html",
    "styles.css",
    "favicon.svg",
    "social-card.svg",
    "robots.txt",
    "sitemap.xml",
    "README.md",
}


class SiteHTMLParser(HTMLParser):
    """Collect the small set of HTML details this project cares about."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ids: set[str] = set()
        self.links: list[dict[str, str | None]] = []
        self.metas: list[dict[str, str | None]] = []
        self.elements: list[str] = []
        self.lang: str | None = None
        self.title_parts: list[str] = []
        self._in_title = False
        self.json_ld_parts: list[str] = []
        self._in_json_ld = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        self.elements.append(tag)
        if tag == "html":
            self.lang = values.get("lang")
        if element_id := values.get("id"):
            self.ids.add(element_id)
        if tag == "a":
            self.links.append(values)
        if tag == "meta":
            self.metas.append(values)
        if tag == "title":
            self._in_title = True
        if tag == "script" and values.get("type") == "application/ld+json":
            self._in_json_ld = True

    def handle_endtag(self, tag: str) -> None:
        if tag == "title":
            self._in_title = False
        if tag == "script":
            self._in_json_ld = False

    def handle_data(self, data: str) -> None:
        if self._in_title:
            self.title_parts.append(data)
        if self._in_json_ld:
            self.json_ld_parts.append(data)

    @property
    def title(self) -> str:
        return "".join(self.title_parts).strip()


class Checks:
    def __init__(self) -> None:
        self.failures: list[str] = []
        self.passes = 0

    def check(self, condition: bool, message: str) -> None:
        if condition:
            self.passes += 1
        else:
            self.failures.append(message)


def parse_html(path: Path, checks: Checks) -> SiteHTMLParser:
    parser = SiteHTMLParser()
    try:
        parser.feed(path.read_text(encoding="utf-8"))
        parser.close()
    except (OSError, UnicodeError) as error:
        checks.check(False, f"Could not read {path.name}: {error}")
    return parser


def meta_content(parser: SiteHTMLParser, key: str, value: str) -> str | None:
    for meta in parser.metas:
        if meta.get(key) == value:
            return meta.get("content")
    return None


def check_html(path: Path, parser: SiteHTMLParser, checks: Checks) -> None:
    checks.check(parser.lang == "en", f"{path.name} must declare lang='en'")
    checks.check(bool(parser.title), f"{path.name} must have a non-empty title")
    checks.check("main" in parser.elements, f"{path.name} must contain a main element")
    checks.check("h1" in parser.elements, f"{path.name} must contain an h1")
    checks.check(
        meta_content(parser, "name", "viewport") is not None,
        f"{path.name} must include a viewport meta tag",
    )

    for link in parser.links:
        href = link.get("href")
        checks.check(bool(href), f"{path.name} contains a link without href")
        if not href:
            continue
        if href.startswith("#"):
            checks.check(href[1:] in parser.ids, f"{path.name} has a broken fragment link: {href}")
        elif href.startswith("/"):
            target = href.split("#", 1)[0].split("?", 1)[0]
            if target not in {"", "/"}:
                checks.check((ROOT / target.lstrip("/")).is_file(), f"{path.name} links to missing file: {href}")
        elif not href.startswith("mailto:"):
            parsed = urlparse(href)
            checks.check(parsed.scheme in {"http", "https"} and bool(parsed.netloc), f"{path.name} has an invalid URL: {href}")

        if link.get("target") == "_blank":
            rel_values = set((link.get("rel") or "").split())
            checks.check("noopener" in rel_values, f"{path.name} target=_blank link lacks noopener: {href}")


def main() -> int:
    checks = Checks()

    for name in sorted(REQUIRED_FILES):
        checks.check((ROOT / name).is_file(), f"Missing required file: {name}")

    index = parse_html(ROOT / "index.html", checks)
    not_found = parse_html(ROOT / "404.html", checks)
    check_html(ROOT / "index.html", index, checks)
    check_html(ROOT / "404.html", not_found, checks)

    checks.check("header" in index.elements, "index.html must contain a header")
    checks.check("nav" in index.elements, "index.html must contain a nav")
    checks.check("footer" in index.elements, "index.html must contain a footer")
    checks.check(
        meta_content(index, "name", "description") is not None,
        "index.html must include a meta description",
    )
    for property_name in ("og:title", "og:description", "og:url", "og:image"):
        checks.check(
            meta_content(index, "property", property_name) is not None,
            f"index.html must include {property_name}",
        )

    index_source = (ROOT / "index.html").read_text(encoding="utf-8")
    checks.check("Yuval Fishler" in index_source, "index.html must include Yuval Fishler")
    checks.check("mailto:yuvalfis@gmail.com" in index_source, "index.html must include the contact email")
    checks.check("https://github.com/yuvalfis" in index_source, "index.html must include the GitHub profile")

    try:
        structured_data = json.loads("".join(index.json_ld_parts))
        checks.check(structured_data.get("name") == "Yuval Fishler", "JSON-LD must identify Yuval Fishler")
        checks.check(structured_data.get("url") == SITE_URL, "JSON-LD must use the canonical site URL")
    except (json.JSONDecodeError, AttributeError) as error:
        checks.check(False, f"index.html has invalid JSON-LD: {error}")

    try:
        sitemap = ElementTree.parse(ROOT / "sitemap.xml")
        locations = [node.text for node in sitemap.findall("{http://www.sitemaps.org/schemas/sitemap/0.9}url/{http://www.sitemaps.org/schemas/sitemap/0.9}loc")]
        checks.check(SITE_URL in locations, "sitemap.xml must contain the canonical home URL")
    except (ElementTree.ParseError, OSError) as error:
        checks.check(False, f"sitemap.xml is invalid: {error}")

    robots = (ROOT / "robots.txt").read_text(encoding="utf-8")
    checks.check("User-agent: *" in robots, "robots.txt must address all user agents")
    checks.check(f"Sitemap: {SITE_URL}sitemap.xml" in robots, "robots.txt must link to sitemap.xml")

    css = (ROOT / "styles.css").read_text(encoding="utf-8")
    checks.check("prefers-reduced-motion: reduce" in css, "styles.css must respect reduced-motion preferences")
    checks.check(":focus-visible" in css, "styles.css must provide visible keyboard focus")

    if checks.failures:
        print(f"FAILED: {len(checks.failures)} problem(s), {checks.passes} checks passed")
        for failure in checks.failures:
            print(f"  - {failure}")
        return 1

    print(f"OK: {checks.passes} checks passed")
    return 0


if __name__ == "__main__":
    sys.exit(main())
