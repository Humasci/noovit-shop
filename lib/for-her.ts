// "For Her" marks (owner, 20 Nov). Label: a berry "For Her" badge top-right on the front of products mainly bought by
// women (Creatine for Her already says it in its name). Website: the same tag on product cards, plus shared products
// featured in Women's Health (their bottles stay unchanged, so no duplicate print runs).
export const FOR_HER_BERRY = '#C9558F';
// Website badge: deeper berry so 10px white text meets WCAG AA 4.5:1 (21 Nov audit).
export const FOR_HER_BADGE = '#A8407A';
// Ashwagandha (owner, 20 Nov): unisex product, so no badge on its printed label; it keeps the website tag on the Women's page.
export const FOR_HER_LABEL = new Set(['menopause-complex', 'iron-complex', 'collagen-complex', 'biotin-complex']);
export const FOR_HER_WEB = new Set([...FOR_HER_LABEL, 'ashwagandha', 'creatine-for-women', 'magnesium-complex']);
