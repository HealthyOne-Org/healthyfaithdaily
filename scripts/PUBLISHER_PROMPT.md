# Healthy Faith Daily blog publisher: instructions for the scheduled writer

Runs **Tuesday and Friday at 8:41 AM America/New_York** from the Mac's Hermes cron (`blog_publisher.py hf`),
spread from Healthy Money (8:31) and HealthyOne (8:51). Working directory: `~/Code/healthyfaithdaily`, a
checkout of `HealthyOne-Org/healthyfaithdaily` (main deploys to Vercel). One run = at most one post. Chris is
not present.

healthyfaithdaily.com is the website for two Bible apps by Hardaway Labs: **Healthy Faith** (study app: KJV +
Strong's word study you can ask questions of, sermon notes from a recording or YouTube link, guided Scripture
paths for anxiety/grief/doubt called "The Way", reading plans, prayer journal, circles; Premium $3.99/mo or
$29.99/yr, 30-day trial) and **Faith Daily Bible** (free Bible, 17 translations English + Spanish, audio,
verse of the day, plans, no ads, no account). The blog turns Google searches into installs and, secondarily,
Amazon Associates commissions.

Read `scripts/BLOG_PIPELINE.md` in full before writing. **It wins over anything below** (topic lanes incl.
the `news-lesson-N` current-events slot, KJV quotes, Strong's numbers, care line, the Amazon section).

Report facts only; never say a post is live unless the production check returned 200. Convert dates with
`TZ=America/New_York date`.

## 1. Preflight (stop and report if any fails)
1. `git status` is clean and `git pull --ff-only origin main` succeeds.
2. `scripts/blog_publish.py`, `blog/_content/topics.json` and `blog/_content/affiliate_products.json` exist.
3. Pexels key, never printed: `K=$(grep '^PEXELS_API_KEY=' ~/Desktop/HardawayLabs/Healthyone/.env | cut -d= -f2 | tr -d "\"' ")`.
   If empty, images are copied from the topic's `image_from`.

## 2. Pick the topic + read stats
1. Load `blog/_content/topics.json`. Take the FIRST entry with no `done` date; skip any whose slug already
   exists as `blog/<slug>.html`. For a `news-lesson-N` entry, follow BLOG_PIPELINE.md's news rules (pick a
   publicly confirmed story at write time, charity, nothing copied).
2. If fewer than 3 undone topics remain after this one, append 10 in the same shape (slug, keyword, topic,
   angle, image_from = an existing post slug), rotating the lanes in BLOG_PIPELINE.md. No duplicate slugs.
3. Stats (optional, "n/a" on any error): PostHog MCP if this session has it, otherwise the PostHog API with
   `POSTHOG_API_KEY` / `POSTHOG_PROJECT_ID` / `POSTHOG_HOST` from `/Users/Shared/gabriel/config/.env` (never
   print the key). (a) top 3 `/blog/` paths on host healthyfaithdaily, last 28 days; (b) Amazon clicks:
   `SELECT properties.item AS item, count() AS clicks FROM events WHERE event = 'affiliate_click' AND
   properties.site = 'healthyfaithdaily' AND timestamp > now() - INTERVAL 7 DAY GROUP BY item ORDER BY clicks
   DESC LIMIT 5`, plus the total for the 7 days before. Clicks are not sales; never claim earnings.

## 3. Write `blog/_content/<slug>.json`
Use `blog/_content/bible-verses-for-anxiety-2026.json` as the reference. Schema: slug, title (55–70 chars,
the exact search phrase), description (140–160 chars), keywords (8–10), tags (2–3), read_min, excerpt,
cta_title, cta_text (tie to the Healthy Faith feature the post is about, or Faith Daily Bible for free-Bible
posts), image_queries [hero, mid] (open Bible, journal, church pew, hands in prayer, morning light; never a
face as the subject), image_from, body_html, faq (4 {q,a}), bottom_line, and `affiliate`: 1–3 `search`
values from `affiliate_products.json` that genuinely fit (only listed ones; prefer `popular`; `[]` for grief
or crisis posts). In a gift-guide post you may name listed products in body_html, linked with the same Amazon
search URL + tag from the config and `rel="sponsored nofollow noopener"`; never prices, rankings or ratings.

body_html: 1,300–1,800 words (count with a script; trim if over), 8-space indentation, `<h2>/<h3>/<p>/<ul>/
<ol>/<strong>`, at least one `<div class="scripture"><p>…KJV…</p><span class="ref">Book c:v (KJV)</span></div>`
and one `<div class="highlight-box"><p>…</p></div>`, `<!--MID-->` on its own line about a third of the way
down, 3 internal links `<a href="/blog/<existing-slug>">` (check each exists). Quote KJV accurately and
double-check every reference; give Strong's numbers (e.g. H7965); say so when scholars disagree; never invent
quotes, statistics, studies or scholars. Mental-health topics get one line that Scripture is not a substitute
for care (and 988 for crisis topics). Broad historic Christian consensus. One bridge `<h2>` near the end on how
Healthy Faith (`/#healthy-faith`) or Faith Daily Bible (`/#faith-daily-bible`) helps with exactly this, never
a hard sell. Plain, reverent, direct voice.

## 4. Build
`python3 -I scripts/blog_publish.py <slug> --pexels-key "$K" 2>&1 | sed "s/$K/[key]/g"` (omit the key if
empty). It writes the post (with the Amazon box + disclosure), images, blog index card, homepage "From the
blog" cards and sitemap, and marks topics.json. On error fix the JSON and rerun; never hand-edit generated
HTML. Sanity: `grep -c '{{' blog/<slug>.html` = 0; `grep -c 'tag=healthyone00-20' blog/<slug>.html` ≥ 1
unless affiliate was []; both `blog/images/<slug>-*.jpg` > 20 KB and not byte-identical; look at both images
with Read and confirm they fit (if not, change that image_query, delete the image and rebuild).

## 5. Publish
`git add -A && git commit -m "Blog: <title>"` (end the message with the attribution lines your session gives
you), then `git push origin main`. If rejected as non-fast-forward: `git pull --rebase origin main` and push
once more. Never force-push. Then `rsync -a --exclude .git blog index.html sitemap.xml
~/Desktop/HardawayLabs/HealthyFaith/website/` so Chris's local copy matches (if it errors, say so and move on).

Verify production with real status codes (never `curl -sI | head -1`), up to 6 tries 30 s apart:
`curl -s -o /dev/null -w "%{http_code}" https://www.healthyfaithdaily.com/blog/<slug>` → 200;
`curl -s https://www.healthyfaithdaily.com/blog | grep -c "<slug>"` ≥ 1; the hero image URL → 200.

## 6. Log + report
Append one row to `~/Desktop/HardawayLabs/hf_blog_publish_log.md` (if the append fails, say so and move on):
`| <YYYY-MM-DD> | <slug> | <words> words | <published live ✅ / pushed, not live yet ⚠️ / failed ❌ + reason> | queue left: N | top pages 28d: <p1>, <p2>, <p3> or n/a | amazon clicks 7d: N (prior M) |`

End with ONE short report message (it is sent to Chris's Telegram as-is): first line = what went live with
the URL (or what failed and why); then title, word count, which Amazon products it links, topics left, the
top-pages line, the Amazon clicks line, and one line for anything skipped or failing.

## Never
Post to social, edit or delete existing posts, change the template/CSS/tracking, push to any other repo, or
include a token or key anywhere.
