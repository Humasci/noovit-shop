# Noovit brand kit (24 Nov 2026)

Everything here is generated from the real logo (Funnel Display Medium + the five-tile mosaic cross) by
`npx tsx --conditions=react-server scripts/brand-kit.ts`. Re-run it after any logo or colour change; never redraw the
logo by hand or let an AI tool retype it.

## Logo files (`design/brand/logo/`)
| File | Use |
|---|---|
| `noovit-logo-navy.png` | Default logo on white |
| `noovit-logo-navy-transparent.png` | On light photos and colours |
| `noovit-logo-white-on-navy.png`, `noovit-logo-white-transparent.png` | On navy or dark photos |
| `noovit-icon-navy.png`, `noovit-icon-white.png` | The n⁺ icon: avatars, app icons, favicons |
| `noovit-mosaic-cross.png` | The cross alone (stickers, patterns, loaders) |

**Rules**
- The name is always lowercase: noovit.
- The cross is always the five separate square tiles, never a plus sign. On dark backgrounds the lighter tiles are solid tints, not see-through.
- Keep clear space around the logo equal to the height of the cross.
- For AI image tools: upload `noovit-logo-navy.png` and write "use this exact logo; the cross is five separate square tiles, not a plus sign".

## Colours
| Name | Hex | Use |
|---|---|---|
| Navy | `#14213D` | Logo, headings, buttons |
| Orange | `#FF5F00` | The cross, small accents only |
| Cream (studio) | `#EFE9DF` | Product photo backdrop, banners |
| Sage | `#D9E0D2` | Section backgrounds |
| Lilac | `#E8E2F2` | Women's health and the perimenopause program |
| Ink | `#1F2937` | Body text |

Product label colours are in `CLAUDE.md` (Magnesium navy, Lion's Mane teal, Ashwagandha coral, Creatine emerald, CoQ10 plum, Turmeric saffron).

## Fonts
- **Funnel Display Medium:** the logo only.
- **Manrope:** headlines.
- **Inter:** body text.
All three are free (SIL Open Font License); the files are in `assets/fonts/`.

## Emails
- Every email the site sends now has the logo image at the top (`public/brand/noovit-logo-email.png`, hosted at
  https://noovit.com/brand/noovit-logo-email.png) and a branded footer.
- **Gmail signature:** open https://noovit.com/brand/signature.html, copy the signature in the dashed box, and paste it in
  Gmail → Settings → See all settings → General → Signature.

## Social kits (`design/brand/social/`)
| Platform | Profile picture | Banner / cover | Notes |
|---|---|---|---|
| Facebook (Meta) | `meta/facebook-profile-720.png` | `meta/facebook-cover-1640x624.png` | Phones crop the cover's sides; content stays in the centre |
| Instagram | `instagram/instagram-profile-1080.png` | Story highlight covers: `instagram/highlight-*.png` (Shop, Science, Tests, Reviews) | Profile shows as a circle |
| TikTok | `tiktok/tiktok-profile-1080.png` | (no banner) | |
| X | `x/x-profile-400.png` | `x/x-header-1500x500.png` | The profile picture covers the bottom-left of the header |
| LinkedIn (company page) | `linkedin/linkedin-logo-400.png` | `linkedin/linkedin-cover-1128x191.png` | |
| YouTube | `youtube/youtube-profile-800.png` | `youtube/youtube-banner-2560x1440.png` | Only the centre strip shows on desktop; the logo and text sit inside it. Video watermark: `youtube/youtube-watermark-150.png` |

**Handle:** use `@noovit` everywhere if it's free; otherwise `@noovit.health` or `@getnoovit`, the same on every platform.
**Link:** https://noovit.com (on Instagram and TikTok, the link in bio).

### Bios (copy-paste; no health claims, so they pass ad and platform reviews)
- **Instagram** (150 max): `Evidence-led wellness: supplements and at-home health tests. Every dose clearly labeled. Free US shipping · Guides with every source graded ↓`
- **TikTok** (80 max): `Evidence-led wellness. Supplements + at-home tests. 🇺🇸`
- **X** (160 max): `Evidence-led wellness: supplements with every dose clearly labeled and at-home health tests. We read the studies and show our sources. US only.`
- **Facebook** (255 max): `Noovit is an evidence-led wellness brand: supplements with every dose clearly labeled (no hidden blends), at-home health tests and more on the way. Free US shipping, subscribe & save, and a 90-day money-back guarantee. Our free guides grade the evidence behind every ingredient.`
- **LinkedIn tagline** (120 max): `Evidence-led wellness: supplements, at-home health tests and more, with every dose clearly labeled.`
- **LinkedIn about:** `Noovit LLC is a US direct-to-consumer health brand. We make evidence-led wellness simple: supplements with every dose printed clearly on the label, at-home health tests with a certified US lab partner, and more wellness products over time. Our guides grade the evidence behind every ingredient, null results included.`
- **YouTube description:** `Evidence-led wellness, explained. Short videos on what the research really says about magnesium, creatine, ashwagandha, lion's mane and more, with every source linked. Education, not medical advice. Shop: noovit.com`

**Category picks:** Health & Beauty → Vitamins/Supplements (Facebook: "Health & wellness website"; LinkedIn industry: "Wellness and Fitness Services" or "Personal Care Product Manufacturing").
