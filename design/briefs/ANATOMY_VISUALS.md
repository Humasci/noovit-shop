# Anatomy visuals: image + short video briefs (23 Nov 2026)

Style: "see-through anatomy". A real person in a calm, everyday pose; a translucent, medically accurate anatomy layer shows
where the nutrient works. Inspired by the format in IM8's ads, but our own look. **Don't copy theirs**: their settings,
models, colors, text styles or scripts.

## House style (every brief)
- **Set:** seamless white or very light warm-grey studio, soft daylight from the upper left, gentle floor shadow.
- **People:**
  - Real-looking adults aged 25 to 65, a mix of women and men, varied ethnicities.
  - Natural skin, no heavy retouching.
  - White or cream clothing, so the anatomy reads clearly.
- **Anatomy layer:**
  - Translucent, illustrated, textbook-accurate (shape, position and side of the body).
  - Soft edges where it meets skin.
  - The focus area glows slightly; nothing gory, no blood, no open skin.
  - Tint toward the product's label color, kept subtle: Magnesium navy #4A6B94, Ashwagandha rose #AE5559, Lion's Mane teal #2B7C82, Creatine green #2F6F4E, CoQ10 plum #7B3F86, Turmeric saffron #C98F14, Creatine for Her berry #A8467A,
  Iron #D2483C, Collagen #E86AA6, Biotin #8F7BC8, Creatine Hydration+ lime #8FB339, Vitamin D3 + K2 #E0A63A, Probiotic Gut+ #5B8DB8,
  Glucosamine Joint+ #4A9B8E, for-Men versions gold #D9A21B (accent on navy #1E2A3A).
- **No text in the generated image.** We add captions ourselves, so the AI can't misspell or overclaim.
- **No product in the image,** or only a blank white bottle or tub. Our real bottle or tub photos are added in editing, so the label is always correct.
- **Format:** images 4:5 (1600 × 2000) plus a 1:1 crop. Video 9:16, 6 to 10 seconds, no sound needed (captions carry it).

## Video structure (every product)
1. **0–2 s:** the person does the everyday action, with no anatomy visible yet.
2. **2–6 s:** the anatomy layer fades in from the focus area outward; a slow, soft glow pulses once on the focus area.
3. **6–9 s:** the layer fades out. Cut to our real product photo on the cream backdrop, with the caption and the asterisk.

**Caption rules:**
- **Wording:** structure/function language only, with "*" pointing to the disclaimer "These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease."
- **Never** use treat, cure, fix, repair, reverse, detox, boost your brain, burns fat, or disease names.
- **The picture and the words together must not say more than our evidence does** (FTC "net impression").

## Production decisions (23 Nov, answers to Gemini)
- **Stomach image:** keep it, once fixed. It's for "gentle on the stomach" (Magnesium Sleep+, Iron) and the gut health page. The Iron staircase/red-blood-cell image is made as well; both are wanted.
- **Close-ups:** Collagen skin layers, Biotin follicles and CoQ10 mitochondria are separate close-up images and clips, cut together in editing (not insets).
- **Menopause Balance+:** paused. No visuals for now (evidence weak, claim under review); adding "occasional" doesn't fix the evidence.
- **Glucosamine Joint+:** last, after the catalog check (shellfish warning).
- **Order:** stomach fix first. Batch 1 images: Magnesium Sleep+, Ashwagandha Calm+, Lion's Mane, Creatine (men's version), CoQ10, Turmeric Complex, Iron. Batch 2: Vitamin D3 + K2, Collagen, Biotin, Probiotic Gut+, Creatine Hydration+, Glucosamine Joint+. Videos one at a time: Creatine for Her first, then Magnesium.
- **Delivery:** send the results as file attachments (pasted chat images don't reach the site).

## Status (23 Nov)
- **Done and on the site:** Creatine for Her, Turmeric Complex (woman gardening, knees and hands), Iron (woman on stairs, blood vessels), Magnesium Sleep+ (woman on bed, back), Ashwagandha Calm+ (man at desk, brain + adrenals), Creatine (squat, fixed tint), Lion's Mane (woman writing) and CoQ10 (man on stairs, fixed heart, with the mitochondria close-up as an inset). Images in `public/images/lifestyle/`; captions in `lib/lifestyle.ts`.
- **Still to come:** Batch 2 (Vitamin D3 + K2, Collagen, Biotin, Probiotic Gut+, Creatine Hydration+, Glucosamine Joint+), the stomach fix, videos, and the program photos (`PROGRAM_PHOTOS.md`).

## Fix for the existing stomach image (woman drinking water)
**Problem:** the tube starts at the voice box (larynx) and runs straight to the stomach, which reads as water going down the windpipe.

**Prompt fix:** "Remove the larynx/thyroid-cartilage shape. The esophagus starts behind the throat, runs down behind the windpipe and in front of the spine, through the diaphragm into the stomach on the body's left side."

---

## Briefs by product

### Creatine for Her (image done: woman with arm/shoulder muscles and brain)
- **Caption:** "Strength with training,* plus early research on memory." Video: woman doing a light dumbbell curl; muscles fade in on her arms and shoulders, a faint brain layer appears last.

### Creatine (and Creatine for Men)
- **Image:** man, early 40s, holding a goblet-squat position with a kettlebell. The quadriceps, glutes, deltoids and biceps are visible; the brain is very faint.
- **Accuracy:** quads on the front of the thigh, hamstrings behind; the muscle fiber direction is correct.
- **Video:** squat up and down; the leg muscles light on the way up.
- **Caption:** "5 g a day supports strength and power with training.*"
- **Avoid:** "builds muscle fast", bulking, steroid imagery.

### Creatine Hydration+
- **Image:** woman after a run, wiping her brow, holding a clear shaker. The leg and arm muscles are visible, with a few soft blue droplets/particles moving through the muscles.
- **Video:** she drinks; soft blue particles flow from the stomach area into the muscles.
- **Caption:** "Creatine plus electrolytes for training and hot days.*"
- **Avoid:** "prevents cramps", "rehydrates faster than water".

### Magnesium Sleep+
- **Image:** woman, around 35, sitting on the edge of a bed in light loungewear, rolling her shoulders, eyes half closed. The neck and upper back muscles (trapezius, the neck muscles) are visible and the brain softly lit; navy tint, slightly dimmer, evening light.
- **Accuracy:** the trapezius is diamond-shaped, from the neck to mid-back and out to the shoulders.
- **Video:** shoulder roll, then the muscles soften from bright to calm (the glow fades), and she lies back.
- **Caption:** "Supports restful sleep and muscle relaxation.*"
- **Avoid:** heart imagery, "cures insomnia", "knocks you out".

### Ashwagandha Calm+
- **Image:** man or woman, around 40, at a desk, taking a slow breath with eyes closed. The brain is softly lit; the adrenal glands (small triangular glands on top of each kidney, at the back, around the lowest ribs) glow gently; rose tint.
- **Accuracy:** the kidneys sit at the back, at the level of the lowest ribs; the adrenals cap their tops.
- **Video:** shoulders drop on the exhale; the adrenal glow calms from warm to soft.
- **Caption:** "Supports stress resilience and calm.*"
- **Avoid:** "lowers cortisol", "treats anxiety", pregnancy imagery.

### Lion's Mane
- **Image:** woman, around 30, reading or writing at a table, focused. The brain is visible, with a fine network of nerve cells lighting softly; teal tint.
- **Accuracy:** realistic brain proportions inside the skull; nerve cells drawn as a fine web, no lightning bolts.
- **Video:** she looks up from her notebook; a ripple of light crosses the network once.
- **Caption:** "1,000 mg of lion's mane mushroom daily, to support focus.*"
- **Avoid:** "nerve regrowth", "brain repair", dementia, "smarter".

### CoQ10
- **Image:** man, around 55, walking briskly or climbing stairs. The heart is visible in the correct place (center-left of the chest, behind the breastbone, tilted to the left), with a soft plum glow; inset optional: mitochondria in a muscle cell.
- **Video:** he climbs two steps; the heart glows softly, then a quick zoom into tiny glowing mitochondria in the leg muscle.
- **Caption:** "Your body makes CoQ10 for cellular energy; levels are highest in the heart. 200 mg daily.*"
- **Avoid:** "heart health" as a promise, statins, blood pressure, heart disease.

### Turmeric Complex (turmeric + glucosamine + chondroitin)
- **Image:** woman, around 55, gardening and kneeling, or opening a jar. The knee joints and finger joints are visible, with cartilage softly lit; saffron tint.
- **Accuracy:** the knee shows the femur, tibia, kneecap and the cartilage between them.
- **Video:** she stands up from kneeling; the knee joints glow softly as she rises.
- **Caption:** "Supports joint comfort.*"
- **Note:** the product contains shellfish; say so on the page, not in the ad.
- **Avoid:** arthritis, "anti-inflammatory", red-hot "pain" glow.

### Iron (bisglycinate)
- **Image:** woman, around 30, mid-stride on a staircase. The blood vessels in her arms and chest are visible, with red blood cells (disc-shaped) flowing; warm red tint kept soft.
- **Accuracy:** the red blood cells are biconcave discs, not spheres.
- **Video:** cells flow faster as she climbs; she reaches the top.
- **Caption:** "Gentle iron to support normal energy levels and red blood cell formation.*"
- **Avoid:** anemia, "cures fatigue"; add "Keep out of reach of children" on the end card.

### Vitamin D3 + K2
- **Image:** man, around 45, stepping outdoors into soft sunlight (a white studio with a light beam). The skeleton is visible (spine, hips, legs), with bones softly lit.
- **Accuracy:** correct spine curves, pelvis and femur proportions.
- **Video:** a sun beam crosses him; the bones light from the feet upward.
- **Caption:** "Supports healthy bones and immune function.*"
- **Avoid:** "osteoporosis", "clears arteries".

### Collagen with Hyaluronic Acid
- **Image:** woman, around 45, touching her cheek in a mirror-like pose. A cutaway shows the skin layers on the cheek, with the dermis' collagen fibers as a soft mesh; optional knee joint.
- **Accuracy:** layers from the top: epidermis, dermis (collagen), fat layer.
- **Video:** a slow zoom from the face into the skin layers; the fibers glow.
- **Caption:** "Supports skin elasticity, hair and nails.*"
- **Avoid:** "anti-aging", "erases wrinkles", before/after images.

### Biotin (with zinc and selenium)
- **Image:** woman, around 30, running fingers through her hair. A scalp cutaway shows the hair follicles; nails optional.
- **Accuracy:** the follicles sit in the dermis, one hair per follicle, angled.
- **Video:** her hand moves through her hair; the follicles light in a row.
- **Caption:** "Supports healthy hair, skin and nails.*"
- **Avoid:** "hair growth", "stops hair loss", "thicker hair"; note on the page that biotin can affect lab tests.

### Probiotic Gut+
- **Image:** man, around 35, after a meal, hand resting lightly on his belly, relaxed. The small and large intestine are visible, with tiny friendly microbes as soft dots.
- **Accuracy:** the large intestine frames the coiled small intestine (up the right side, across, down the left).
- **Video:** soft dots spread through the intestine; he smiles and moves on.
- **Caption:** "Supports digestive balance.*"
- **Avoid:** IBS, "cures bloating", "detox".

### Glucosamine Joint+
- **Image:** man, around 60, mid-stride on a walk or hiking. The knee and hip joints are visible, with cartilage glowing softly.
- **Video:** he steps up onto a rock; the knee cartilage glows.
- **Caption:** "Supports joint comfort and mobility.*"
- **Note:** made from shellfish; say so on the page.
- **Avoid:** arthritis.

### Menopause Balance+
- **Image:** woman, around 50, by an open window, calm, fanning herself lightly. The brain is softly lit, with a faint warm-to-cool color shift across the skin.
- **Accuracy:** keep the body anatomy minimal; the brain is enough.
- **Video:** warm tint, then a cool, calm tint, then she relaxes.
- **Caption:** "Supports comfort during hot flashes, mood and sleep.*"
- **Avoid:** "treats menopause", "hormone replacement", "balances hormones".

---

## Ready-to-paste image prompt (fill in the [brackets])
"Photorealistic studio photograph, seamless white background, soft daylight from upper left, gentle floor shadow. [Person,
age, clothing in white/cream], [pose/action]. A translucent, medically accurate illustrated anatomy overlay shows [anatomy,
with accuracy notes], blending softly into the skin, with a subtle [color] tint and a gentle glow on [focus area]. Clean,
calm, premium health-brand look. No text, no logos, no product packaging. Vertical 4:5."

## Ready-to-paste video prompt
"9:16 vertical, 8 seconds, white studio, soft daylight. [Person] [action]. At 2 seconds a translucent, medically accurate
anatomy layer showing [anatomy] fades in from [focus area] outward, glows softly once in [color], then fades out by 6
seconds. Smooth, slow camera push-in. No text, no logos, no packaging, realistic hands and faces."
