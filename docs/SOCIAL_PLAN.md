# Noovit — Social media plan (Buffer first)

_v1 · 28 Oct 2026. Decisions: Buffer first, channels in the order TikTok → Instagram → YouTube Shorts → Pinterest → X, owner and/or AI avatar plus a real dietitian, nerdy and data-forward voice. Content rules live in `CONTENT_GUIDELINES.md`._

## 1. Goals (first 90 days)
1. **Reach:** 3 videos a week on TikTok, Reels and Shorts, plus Pinterest pins for every guide.
2. **Traffic and sales:** every post links (UTM-tagged) to a guide, goal page, product or the quiz.
3. **Trust:** the dietitian on camera at least twice a month; every claim has a source.
4. **Learn:** find the 3 formats and 5 topics that drive clicks and sales, then double down.

## 2. Content pillars → post formats
| Pillar | Example posts | Format |
|---|---|---|
| **The evidence, honestly** | "Does magnesium actually help sleep? Here's what 3 trials found" · "Evidence grade: Limited" | 30–45 s talking head + on-screen numbers; carousel "the studies" |
| **Which one and why** | "Magnesium glycinate vs citrate vs threonate in 40 s" · "Creatine: gummies vs powder" | Split-screen comparison; carousel table |
| **Can I take X with Y?** | "Zinc and iron together?" · "Ashwagandha with SSRIs: ask your doctor, here's why" | 20–30 s quick answer; always ends with "talk to your doctor/pharmacist" |
| **Biohacker corner** | "My sleep stack and the evidence for each" · "Timing creatine: does it matter?" | Owner/dietitian routine video, evidence grade overlay |
| **Behind the bottle** | "How to read a Supplement Facts label" · "What FU / CFU / elemental magnesium mean" · "Our lab results, explained" | Screen-recording / close-ups of labels and COAs |
| **Myth-busting** | "More CFU isn't always better" · "You probably don't need 10,000 IU D3" | Hook + 3 facts + source on screen |

**Hooks that fit the brand:** "The study everyone quotes found…", "Evidence grade: Limited. Here's why", "3 numbers to check before you buy [X]".

## 3. The content pack (made from every guide or comparison)
Each new guide or comparison becomes one **pack**:
- **5 short-video scripts** (TikTok, Reels, Shorts) from the FAQ and "the numbers": hook ≤2 s, one idea, the source shown on screen, a call to action.
- **2 carousels** for Instagram (and Pinterest as stand-alone pins): "the studies at a glance", "who should avoid it".
- **1 dietitian clip brief:** a "What I tell my clients" angle.
- **Captions per channel:**
  - TikTok: short, with 3–5 hashtags
  - Instagram: longer, with a save-worthy summary
  - YouTube: title plus description with links
  - Pinterest: keyword-rich title and description
  - X: one-line insight plus a link
- **Alt text** for images, and **AI-generated** labels for avatar videos.
- **UTM link:** `?utm_source=<channel>&utm_medium=social&utm_campaign=<guide-slug>&utm_content=<post-id>`.

**Weekly rhythm:**
- 1 guide or comparison → 1 pack
- Publish 3–5 videos, 2 carousels and 3–5 pins
- 1 dietitian clip every 2 weeks (recorded monthly in a batch)

## 4. Who presents
- **Owner on camera (recommended for key videos):** real faces build more trust in health than avatars.
- **AI avatar (HeyGen or similar):** volume formats (myth-busting, quick answers). Always disclosed as AI-generated, in the caption and on screen where the platform requires it.
- **Dietitian:** reviews scripts that make health statements and appears in "expert" clips. Named, with credentials, and any payment disclosed (#ad or "paid advisor").

## 5. Compliance (every post, before approval)
- Automatic check against FDA/FTC rules:
  - no disease, treatment or drug-comparison claims ("works like Ozempic")
  - `*` and the disclaimer on product posts
  - #ad for paid creators
  - AI-avatar disclosure
  - no invented results or testimonials
- **Reuse the owner's compliance skill** from the other projects (add it to `.claude/skills/` in this repo).
- Health claims are only allowed when the linked guide supports them; anything else is flagged for the owner.
- **Never:** before/after body claims, weight-loss promises, "cure", "doctor recommended" without a named doctor.

## 6. The system to build
```
Guide / comparison (lib/guides.ts)
      │  generate pack (Claude)
      ▼
Draft posts ──► Compliance check ──► Admin "Social" queue ──► Owner approves / edits
                                                        │
                                                        ▼
                                          Buffer API (schedule per channel)
                                                        │
                                                        ▼
                                  Published → UTM clicks → orders (attribution)
```

**Build steps:**
1. **Data:** a `social_posts` table holding channel, type, script/caption, media URL, status (draft → flagged → approved → scheduled → published), scheduled time, Buffer IDs, UTM, source guide, and metrics.
2. **Generator:** a script or admin action that turns a guide into a content pack (scripts, captions, carousel text, pins) using the guide's facts and sources.
3. **Compliance pass:** the owner's skill, plus our rule list. Flagged items show the reason.
4. **Admin → Social:** a calendar and queue. Approve, edit, reschedule, preview per channel. Only approved posts go to Buffer.
5. **Buffer integration:** Buffer's API (GraphQL beta with a personal API key) can create posts for TikTok, Instagram, YouTube, Pinterest and X ([Buffer](https://support.buffer.com/articles/using-buffers-api-GtIYIQilz5.md)).
   - Known limits: no custom video thumbnails (pick a frame instead), and a reported bug where Pinterest links aren't saved through the API ([status](https://developers.buffer.com/examples/../roadmap.html)).
   - Confirm current access at developers.buffer.com before building.
6. **Media:**
   - avatar videos generated (HeyGen) or uploaded (owner/dietitian recordings) to storage
   - carousels rendered in brand style (mosaic, navy/orange/opal, Manrope/Inter); we already render brand graphics server-side
7. **Tracking:** UTM links → GA4 and our orders (we already store first-touch attribution for affiliates; extend to UTM), plus a weekly report by post, topic and format.
8. **Later:** connect directly to the platform APIs channel by channel where Buffer limits us (TikTok Content Posting API, Instagram Graph API, YouTube Data API, Pinterest API, X API). Each needs a developer app and review.

## 7. Cost (estimates)
- **Buffer:** about **$6 per channel per month**, so ~$30/month for 5 channels; the free plan covers 3 channels and 10 posts each ([Buffer vs Metricool](https://buffer.com/resources/buffer-vs-metricool/)). Check current pricing at sign-up.
- **Avatar tool:** depends on plan and minutes.
- **Dietitian:** a monthly retainer or per-clip fee.

## 8. What the owner needs to do
1. Create the brand accounts: TikTok, Instagram (business), YouTube channel, Pinterest business, X. Use the same handle everywhere (@noovit or similar).
2. Create Buffer, connect the 5 channels, and create a personal API key (into Vercel as `BUFFER_API_KEY`).
3. Choose the presenter mix and the avatar.
4. Add the compliance skill to the repo.
5. Approve the first 2 weeks of posts in the queue.

## 9. Measures of success (review monthly)
- Views and saves per format.
- Clicks per post (UTM), and add-to-carts and orders by campaign.
- Follower growth per channel.
- Best topics, which feed into the next guides (search and social reinforce each other).
