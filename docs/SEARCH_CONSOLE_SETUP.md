# Google Search Console setup (21 Nov 2026)

The 7 public guides are live on noovit.com (lib/public-early.ts). Everything else still shows Coming Soon and sends
`noindex`. The sitemap (https://noovit.com/sitemap.xml) lists only `/guides` and the 7 guides; it grows by itself when
more guides are made public or when SITE_LIVE=true.

## 1. Add and verify the site (10 minutes)
1. Go to https://search.google.com/search-console and sign in with the Google account you'll use for the business.
2. Click **Add property** and choose **Domain**. Type `noovit.com`.
3. Google shows a **TXT record** (it starts with `google-site-verification=`). Copy it.
4. Send me that TXT value (it is not a secret) and I add it to the noovit.com DNS in Vercel, or add it yourself:
   Vercel → Domains → noovit.com → DNS Records → Add → Type TXT, Name `@`, Value = the text Google gave you.
5. Back in Search Console click **Verify**. DNS can take a few minutes; if it fails, wait 10 minutes and try again.

Alternative (if you prefer the URL-prefix property): choose **URL prefix** `https://noovit.com`, pick **HTML tag**,
copy only the code inside `content="…"`, paste it in Admin → Settings → "Google verification code", save, then Verify.

## 2. Submit the sitemap
Search Console → **Sitemaps** → enter `sitemap.xml` → Submit. Status should read "Success" with 8 URLs discovered.

## 3. Ask Google to crawl the guides now
Search Console → **URL Inspection** → paste each address → **Request indexing**:
- https://noovit.com/guides
- https://noovit.com/guides/magnesium
- https://noovit.com/guides/magnesium-glycinate
- https://noovit.com/guides/creatine
- https://noovit.com/guides/lions-mane
- https://noovit.com/guides/coq10
- https://noovit.com/guides/ashwagandha
- https://noovit.com/guides/turmeric

## 4. What to expect
- Indexing usually takes days to a couple of weeks for a new domain. Ranking takes longer; links help.
- "Excluded by noindex" reports for other pages are expected until launch. They are not errors.
- Also add the site to **Bing Webmaster Tools** (it can import from Search Console in one click): Bing feeds ChatGPT
  search and Copilot.
