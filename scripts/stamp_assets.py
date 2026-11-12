#!/usr/bin/env python3
"""Stamp /assets/site.css and /assets/site.js links in every page with a hash of the file
(?v=1a2b3c4d5e), so phones that cached an older copy fetch the new one. Browsers keep /assets
for a week (vercel.json), so a page without a fresh stamp shows new HTML with old styling.
Run it by hand after editing site.css/site.js (new posts copy the stamped links from the template):
    python3 -I scripts/stamp_assets.py
"""
import hashlib
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent


def stamp() -> int:
    ver = {name: hashlib.sha1((ROOT / "assets" / name).read_bytes()).hexdigest()[:10]
           for name in ("site.css", "site.js")}
    changed = 0
    for page in ROOT.rglob("*.html"):
        if ".git" in page.parts:
            continue
        s = page.read_text()
        new = s
        for name, v in ver.items():
            new = re.sub(rf'/assets/{re.escape(name)}(\?v=[0-9a-f]+)?"', f'/assets/{name}?v={v}"', new)
        if new != s:
            page.write_text(new)
            changed += 1
    return changed


if __name__ == "__main__":
    print(f"stamped {stamp()} page(s)")
