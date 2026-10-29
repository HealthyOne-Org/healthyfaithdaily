# Healthy Faith Daily blog pipeline

Two posts a week (Tue + Fri, 8:41 AM ET) are written and published by the
scheduled task **"Healthy Faith blog publisher"**. This file is the operator's
manual; the task prompt follows it. It mirrors the HealthyOne pipeline.

## What the blog is for
healthyfaithdaily.com exists to turn search traffic into installs of Healthy
Faith (study app, paid Premium) and Faith Daily Bible (free). Every post is
written around something a person actually types into Google when they are
reading the Bible or hurting, and every post ends by showing how the app helps
with exactly that thing. Never a hard sell.

## Topic queue
`blog/_content/topics.json`. Each run takes the first entry without a `done`
date. When fewer than 3 are left, the run appends 10 more in the same shape.
Four lanes, rotate through them:
1. **Verses for hard seasons** ("bible verses for anxiety / grief / doubt /
   discouragement / loneliness / fear / healing") → ties to The Way (guided
   paths). Group verses by the specific feeling; one line on how to pray each.
2. **Word studies** ("what does selah / shalom / abide / agape mean",
   "hesed meaning", "logos vs rhema") → ties to hold-any-word Strong's.
   Give the Strong's number, the literal sense, 3–5 places it appears, and
   one practical takeaway. No invented etymology; when scholars disagree, say so.
3. **How to read / study** ("bible reading plan for beginners", "how to read
   the psalms", "how to use strong's concordance", "how to start a prayer
   journal", "how to take sermon notes") → ties to plans, journal, sermon notes.
4. **Free Bible app intent** ("free bible app no ads", "audio bible app free",
   "bible app with NIV and ESV") → ties to Faith Daily Bible. Compare honestly.

## Files
- `blog/_content/<slug>.json` — the post (schema in scripts/blog_publish.py)
- `blog/_content/_template.html` — layout: nav, hero + mid image, FAQ +
  FAQPage JSON-LD, bottom line, CTA box with both apps, sticky bar, PostHog
- `scripts/blog_publish.py` — renders the HTML, images, blog index card,
  homepage "From the blog" cards (3 newest), sitemap, topics.json
- `blog/images/<slug>-hero.jpg`, `<slug>-mid.jpg` — 1200×675 (Pexels)

## Publish by hand
```bash
git clone https://github.com/HealthyOne-Org/healthyfaithdaily.git && cd healthyfaithdaily
# write blog/_content/my-post.json
python3 -I scripts/blog_publish.py my-post --pexels-key "$PEXELS_API_KEY"
git add -A && git commit -m "Blog: my post" && git push origin main
curl -s -o /dev/null -w "%{http_code}" https://www.healthyfaithdaily.com/blog/my-post   # expect 200
```
Vercel deploys `main` automatically (1–2 min).

## Editorial standard
- Title names the exact search phrase; 55–70 chars; year only on list/guide posts.
- 1,300–1,800 words. Real structure: <h2> sections, numbered verses or steps,
  one `.scripture` block quoting a passage (KJV, since that is what Healthy
  Faith ships; name the translation), one `.highlight-box` with the key idea.
- Quote Scripture accurately (KJV text, verify the reference). Never fabricate
  a quote, a statistic or a scholar. Hebrew/Greek: give the Strong's number.
- Reverent, plain, direct voice. No "in today's fast-paced world". No hype.
- Mental-health topics: one line that Scripture is not a substitute for care;
  for crisis topics include 988 (US). Doctrine: stay inside broad historic
  Christian consensus; where traditions differ, say so rather than pick a side.
- 4 FAQ entries phrased as people search them. 3 internal links to related
  posts (verify the target file exists). `<!--MID-->` about a third of the way down.
- Bridge section near the end: how Healthy Faith (or Faith Daily Bible) does
  the thing the post is about. Link to `/#healthy-faith` or `/#faith-daily-bible`.
