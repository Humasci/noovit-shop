import { ordersOpen } from '@/lib/launch';
import { Product } from '@/types';
import { SITE_URL, productImageUrl, productUrl } from '@/lib/site';
import { productSpec } from '@/lib/seo';
import { productGalleryUrls } from '@/lib/labels/image-url';
import { GOAL_PAGES } from '@/lib/goals';
import { goalsForProduct } from '@/lib/quiz';
import { FOR_HER_WEB } from '@/lib/for-her';
import { labelCounts, netQuantity } from '@/lib/labels/svg';

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
  highlights: string[];
  isBundle: boolean;
  goal: string;
  forHer: boolean;
}

// Shopping titles: brand + product + the spec people search for + count, e.g.
// "Noovit Magnesium Sleep+ – Magnesium Glycinate 275 mg – 90 Capsules". No promo words (Google disapproves them).
// Specs live in lib/seo.ts (PRODUCT_SPECS), shared with image alt text and structured data.
export function feedTitle(p: Product) {
  if (p.bundleItems?.length) {
    const spec = productSpec(p);
    return `Noovit ${p.name} – ${spec ? `${spec} ` : ''}${p.bundleItems.length}-Product Supplement Bundle`.slice(0, 150);
  }
  const spec = productSpec(p);
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
  // Fact images, label close-up and Supplement Facts as extra images (Shopping shows them in the product panel).
  extraImages: productGalleryUrls(p, SITE_URL).slice(1, 11),
  // Google rejects a feed that says "in stock" while the page says "Coming soon": follow the coming-soon switch.
  inStock: p.status === 'active' && ordersOpen(),
  price: `${p.basePrice.toFixed(2)} USD`,
  category: p.productType === 'pets' ? GOOGLE_CATEGORY.pets : GOOGLE_CATEGORY.human,
  productType: feedProductType(p),
  // Short benefit lines (Google "product highlights", 2–100 allowed, max 150 characters each). Structure/function only.
  // Ads carry no disclaimer, so only "supports"-style lines go in; anything that reads as reducing/relieving is left out.
  highlights: p.benefits
    .map((b) => b.replace(/\*/g, '').trim())
    .filter((b) => b && b.length <= 150 && !/\b(reduc|reliev|prevent|treat|cure|heal|fight)/i.test(b))
    .slice(0, 10),
  isBundle: Boolean(p.bundleItems?.length),
  goal: feedGoal(p),
  forHer: FOR_HER_WEB.has(p.slug),
});

// The shop's own category path (Google "product_type"), e.g. "Supplements > Sleep & Stress", for campaign grouping.
function feedGoal(p: Product) {
  const g = goalsForProduct(p.slug).map((x) => GOAL_PAGES.find((page) => page.goal === x)).find(Boolean);
  return g?.name ?? '';
}
function feedProductType(p: Product) {
  if (p.productType === 'pets') return 'Pets';
  const goal = feedGoal(p);
  return [p.bundleItems?.length ? 'Bundles' : 'Supplements', goal].filter(Boolean).join(' > ');
}

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
${i.isBundle ? '      <g:is_bundle>yes</g:is_bundle>\n' : ''}${i.highlights.map((h) => `      <g:product_highlight>${xml(h)}</g:product_highlight>\n`).join('')}      <g:shipping>
        <g:country>US</g:country>
        <g:service>Standard</g:service>
        <g:price>0.00 USD</g:price>
        <g:min_handling_time>2</g:min_handling_time>
        <g:max_handling_time>5</g:max_handling_time>
        <g:min_transit_time>2</g:min_transit_time>
        <g:max_transit_time>4</g:max_transit_time>
      </g:shipping>
      <g:custom_label_0>${xml(i.goal || 'other')}</g:custom_label_0>
      <g:custom_label_1>${i.forHer ? 'for-her' : 'all'}</g:custom_label_1>
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
  const head = [idColumn, 'title', 'description', 'availability', 'condition', 'price', 'link', 'image_link', 'additional_image_link', 'brand', 'google_product_category', 'product_type', 'custom_label_0', 'custom_label_1'];
  const rows = items.map((i) =>
    [i.id, i.title, i.description, i.inStock ? 'in stock' : 'out of stock', 'new', i.price, i.link, i.image, i.extraImages.join(','), 'Noovit', i.category, i.productType, i.goal || 'other', i.forHer ? 'for-her' : 'all']
      .map(csvCell)
      .join(',')
  );
  return [head.join(','), ...rows].join('\n') + '\n';
}

// OpenAI (ChatGPT shopping) product feed, JSON Lines, one product per line
// (spec: developers.openai.com/commerce/specs/file-upload/products). Delivered as a hosted HTTPS URL
// (/feeds/openai.jsonl) set up in OpenAI's merchant portal. Discovery only: buyers check out on noovit.com.
export function openaiFeed(items: FeedItem[], site: string) {
  return items
    .map((i) =>
      JSON.stringify({
        item_id: i.id,
        title: i.title,
        description: i.description,
        url: i.link,
        brand: 'Noovit',
        seller_name: 'Noovit',
        seller_url: site,
        image_url: i.image,
        ...(i.extraImages.length ? { additional_image_urls: i.extraImages } : {}),
        availability: i.inStock ? 'in_stock' : 'out_of_stock',
        price: i.price,
        condition: 'new',
        product_category: i.category,
        target_countries: ['US'],
        store_country: 'US',
        shipping_price: '0.00 USD',
        accepts_returns: true,
        return_deadline_in_days: 90,
        return_policy: `${site}/policies/delivery-returns`,
        seller_privacy_policy: `${site}/policies/privacy`,
        seller_tos: `${site}/policies/terms`,
        is_eligible_search: true,
        is_eligible_checkout: false,
      })
    )
    .join('\n') + '\n';
}
