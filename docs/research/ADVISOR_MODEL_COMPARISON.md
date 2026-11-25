# AI advisor: Gemini Flash-Lite vs Claude Haiku (25 Nov 2026)

The advisor answers from our own data (live catalog, guides, FAQs, test kits, saved NIH pages) that we put into each
request, so both models would see the same facts. The model only has to follow the rules and write a short answer.

## Cost per answer (about 3,600 tokens in, 150 out)
| Model | Input / output per million tokens | Cost per answer | 1,000 answers |
|---|---|---|---|
| Gemini 3.1 Flash-Lite (in use) | $0.25 / $1.50 (third-party price trackers; Google's page not checked) | ~$0.0011 | ~$1.10 |
| Gemini 3.5 Flash-Lite (our fallback; 3.1 is reported to shut down May 2027) | $0.30 / $2.50 (same caveat) | ~$0.0015 | ~$1.50 |
| Claude Haiku 5.5 | $0.10 / $0.50 (Anthropic's published rate, prompts under 100K tokens) | ~$0.0004 | ~$0.44 |

Either way the bill is a few dollars a month at launch volume. Cost is not the deciding factor.

## What we saw on the live site (Gemini 3.1 Flash-Lite, 25 Nov)
- 10 test questions. Facts and prices matched the database; links were right; the warfarin question was handled correctly.
- **3 of 4 answers in the second round were cut off mid-sentence** (Google returned "busy/limit" during the stream). The key
  is still the free tier, which Google deprioritizes; a paid key should reduce this.
- **One rule broken:** asked about a ferritin result of 12, it said the level was "quite low" and pointed to a product,
  although the rules say never to interpret results. Rule tightened afterwards; needs a re-test.

## Differences that matter
| | Gemini Flash-Lite | Claude Haiku 5.5 |
|---|---|---|
| Web search for questions our content doesn't cover | Google Search grounding built in (reported 5,000 free a month, then $14 per 1,000); Google's suggestion chip must be shown | Web search tool exists on the API, billed per search; needs a check that it is offered on Haiku 5.5 |
| Data use | Free tier may be used to improve Google's products; paid tier is not | API data is not used for training by default |
| Following long rule lists (health compliance) | One miss in 10 here | Not tested on our questions yet |
| Work to switch | None | About half a day: second provider in `app/api/advisor/route.ts`, an `ANTHROPIC_API_KEY` in Vercel, and re-running the test questions |

## Recommendation
1. **Now:** move the Gemini key to the paid tier (already on the owner's list). It fixes the privacy point and should fix the cut-offs.
2. **Before launch:** add Claude Haiku 5.5 as a switchable second provider and run the same 20 questions through both
   (prices, hidden products, order status, tests, medicines, pregnancy, lab results, off-topic, rule-breaking attempts).
   Keep whichever follows the rules better; keep the other as the automatic fallback when the first is busy.
3. Not tested here: Haiku's answers on our content (no Anthropic key in this environment), so this is a plan, not a verdict.
