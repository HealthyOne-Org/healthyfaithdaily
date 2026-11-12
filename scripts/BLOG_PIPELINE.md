# Healthy Faith Daily blog pipeline

<!-- blog_learner: read-first -->
> **Read `scripts/WHAT_WORKS.md` first.** `blog_learner.py` rewrites it every Sunday from the last 28 days of
> traffic: the winning posts and why, the losers, and 3 instructions for this week's posts. Follow them unless
> they conflict with the rules in this file.

## Refresh entries (`"lane": "refresh"`, added by blog_learner.py)

A refresh entry's slug is an EXISTING post that is winning but getting old. It is not a new post.
- Update `blog/<slug>.html` in place, and `blog/_content/<slug>.json` too if it exists, so a later rebuild
  keeps the change. Keep the URL, the slug and the title's search phrase. Do not run `blog_publish.py` for it
  (that would add a second index card and sitemap entry) and do not change `datePublished`.
- Do what the entry's `angle` says: fix anything stale, add the missing section or FAQ searchers want, add
  links to newer related posts. Keep the page's shape; that shape is why it wins.
- Bump `dateModified` in the JSON-LD to today, and the post's `<lastmod>` in `sitemap.xml`.
- Mark the entry `done` like any other. Commit message: `Blog refresh: <title>`.
- The Monday `blog_weekly.py` skips refresh entries; the Tue/Fri publisher does them.


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
Six lanes, rotate through them (Chris 11-12: lanes 5 and 6 carry the blog; the queue alternates them with the others):
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
5. **Hard questions people actually search** (Chris 11-12: "hot topics like drug
   abuse, porn addiction, masturbation, witchcraft and what the Bible says, make
   it interesting to read"): addiction, pornography, masturbation, witchcraft and
   astrology, depression and suicidal thoughts, sex before marriage, gambling,
   weed, tattoos, "can I lose my salvation". How to write them:
   - Open with a real-life hook (a scene, a question someone texts their pastor at
     midnight), not a definition. Short paragraphs, honest tone, never preachy.
   - Say plainly what Scripture says, with exact KJV references (verify each
     verse text; never invent one). If the Bible doesn't address it directly
     (masturbation, tattoos, weed), SAY SO, then give the principles.
   - Where Christians disagree, show the main views fairly.
   - No shaming, no graphic detail, no fear-mongering. End with grace, hope and
     one practical next step.
   - Safety lines are REQUIRED where they apply: suicide → "call or text 988"
     near the top; drugs or alcohol → SAMHSA 1-800-662-4357; gambling →
     1-800-GAMBLER; any emergency → 911. Recommend a pastor or counselor.
   → ties to The Way (guided paths) and the app's Ask feature.
6. **Current events with a biblical lesson** (Chris 11-12: "research current
   events and news and extract biblical lesson from it so blogs are relevant and
   popular search results"). Queue entries with `"lane": "current_events"` have a
   placeholder slug (`news-lesson-N`); the writer picks the story at write time:
   - **Research first** (web search): the story from the last 7 days that the
     most people are talking about and searching for. Good fits: a disaster and
     how people helped, a public figure's fall or comeback, a cultural moment, a
     money or work story, a sports story, a viral act of kindness, a new
     technology people are anxious about. Read at least 3 reputable sources.
   - **Rename the entry's slug** to match what people search
     (`what-the-bible-says-about-<topic>-2026`) before building, and set
     `keyword` to the real search phrase.
   - **Structure:** what happened (5-6 plain sentences, facts only, with links
     to 2+ reputable sources in the post) → the question it raises for a
     believer → what Scripture says (exact KJV references, 3-5 passages) → one
     thing to do or pray this week.
   - **Rules:** facts must come from the sources, never from memory; no rumors
     or unconfirmed details; never take a political party's side or tell
     readers how to vote; no blaming victims or saying a tragedy was God's
     judgment on someone; no end-times date-setting; name real people only for
     what is publicly confirmed, and with charity; nothing copied from news
     articles (our own words, short attributed quotes at most). If the week has
     no story that fits, write the next queue entry instead and leave this one.
   → ties to Ask ("ask the app what the Bible says about this") and The Way.

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

## Amazon affiliate links
`blog/_content/affiliate_products.json` (tag `healthyone00-20`, same Associates
account and approach as HealthyOne). `blog_publish.py` adds a "Helpful for this"
box with up to 3 Amazon search links + FTC disclosure below the app CTA, picked by
keyword match. To choose them yourself, add `"affiliate": ["<search>", ...]` to the
post JSON (only searches listed in the config; `[]` = none). Add new products to
the config, never invent tags. Clicks are tracked as `affiliate_click` in PostHog.
The homepage "Study tools" strip (`#study-tools` in index.html) uses the same config.
