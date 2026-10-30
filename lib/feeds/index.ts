import { Product } from '@/types';
import { productImageUrl, productUrl } from '@/lib/site';
import { labelCounts, labelSubtitle, netQuantity } from '@/lib/labels/svg';

const GOOGLE_CATEGORY = {
  human: 'Health & Beauty > Health Care > Fitness & Nutrition > Vitamins & Supplements',
  pets: 'Animals & Pet Supplies > Pet Supplies',
};

export interface FeedItem {
  id: string;
  title: string;
  description: string;
  link: string;
  image: string;
  extraImages: string[];
  inStock: boolean;
  price: string;
  category: string;
  productType: string;
}

// Shopping titles: brand + product + the spec people search for + count, e.g.
// "Noovit Magnesium Sleep+ – Magnesium Glycinate 275 mg – 90 Capsules". No promo words (Google disapproves them).
const FEED_SPECS: Record<string, string> = {
  'magnesium-complex': 'Magnesium Glycinate 275 mg',
  ashwagandha: 'KSM-66 Ashwagandha 600 mg',
  'lions-mane': "Organic Lion's Mane Mushroom 1,000 mg",
  creatine: 'Creatine Monohydrate Powder 5 g',
  coq10: 'CoQ10 Ubiquinone 200 mg',
};
export function feedTitle(p: Product) {
  if (p.bundleItems?.length) return `Noovit ${p.name} – ${p.bundleItems.length}-Product Supplement Bundle`.slice(0, 150);
  const spec = FEED_SPECS[p.slug] ?? labelSubtitle(p);
  const grams = netQuantity(p).match(/^Net Wt (\d+ g)/)?.[1];
  const qty = grams ? `${grams} (${labelCounts(p).servingsPerContainer} Servings)` : netQuantity(p);
  return [`Noovit ${p.name}`, spec, qty].filter(Boolean).join(' – ').slice(0, 150);
}

// Hidden products are already excluded by the caller; out-of-stock ones stay listed as such.
export const toFeedItem = (p: Product): FeedItem => ({
  id: p.slug,
  title: feedTitle(p),
  description: [p.description, p.shortBenefit].filter(Boolean).join(' ').slice(0, 5000),
  link: productUrl(p),
  image: productImageUrl(p),
  extraImages: p.images.slice(1, 11),
  inStock: p.status === 'active',
  price: `${p.basePrice.toFixed(2)} USD`,
  category: p.productType === 'pets' ? GOOGLE_CATEGORY.pets : GOOGLE_CATEGORY.human,
  productType: p.productType,
});

const xml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function googleFeed(items: FeedItem[], siteUrl: string) {
  const entries = items
    .map(
      (i) => `    <item>
      <g:id>${xml(i.id)}</g:id>
      <g:title>${xml(i.title)}</g:title>
      <g:description>${xml(i.description)}</g:description>
      <g:link>${xml(i.link)}</g:link>
      <g:image_link>${xml(i.image)}</g:image_link>
${i.extraImages.map((u) => `      <g:additional_image_link>${xml(u)}</g:additional_image_link>\n`).join('')}      <g:availability>${i.inStock ? 'in_stock' : 'out_of_stock'}</g:availability>
      <g:price>${i.price}</g:price>
      <g:brand>Noovit</g:brand>
      <g:condition>new</g:condition>
      <g:identifier_exists>no</g:identifier_exists>
      <g:google_product_category>${xml(i.category)}</g:google_product_category>
      <g:product_type>${xml(i.productType)}</g:product_type>
    </item>`
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Noovit</title>
    <link>${xml(siteUrl)}</link>
    <description>Noovit product feed</description>
${entries}
  </channel>
</rss>
`;
}

const csvCell = (v: string) => `"${v.replace(/"/g, '""')}"`;

// Meta (Facebook/Instagram) and TikTok catalogs take the same columns; TikTok calls the id "sku_id".
export function catalogCsv(items: FeedItem[], idColumn: 'id' | 'sku_id') {
  const head = [idColumn, 'title', 'description', 'availability', 'condition', 'price', 'link', 'image_link', 'additional_image_link', 'brand', 'google_product_category'];
  const rows = items.map((i) =>
    [i.id, i.title, i.description, i.inStock ? 'in stock' : 'out of stock', 'new', i.price, i.link, i.image, i.extraImages.join(','), 'Noovit', i.category]
      .map(csvCell)
      .join(',')
  );
  return [head.join(','), ...rows].join('\n') + '\n';
}
